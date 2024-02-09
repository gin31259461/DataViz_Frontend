import { useTheme } from '@mui/material';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { Text as VisxText } from '@visx/text';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SpringRef } from 'react-spring';
import RacingAxisBottom from './racing-axis-bottom';
import RacingAxisTop from './racing-axis-top';
import RacingBarGroup from './racing-bar-group';
import { KeyFrameProps } from './use-keyframes';

export interface RacingBarChartController {
  replay: () => void;
  start: () => void;
  stop: () => void;
  playing: boolean;
}

interface RacingBarChartProps {
  numOfBars: number;
  width: number;
  height: number;
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  keyframes: KeyFrameProps[];
  onStart: any;
  onStop: any;
  barGap: number;
}

export interface AnimationStateProps {
  frameIdx: number;
  animationKey: number;
  playing: boolean;
}

const RacingBarChart = forwardRef(function ForwardRacingBarChart(
  { numOfBars, width, height, margin, keyframes, onStart, onStop, barGap }: RacingBarChartProps,
  ref
) {
  const theme = useTheme();

  const [{ frameIdx, animationKey, playing }, setAnimation] = useState<AnimationStateProps>({
    frameIdx: 0,
    animationKey: 0,
    playing: false,
  });

  const updateFrameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // when replay, increment the key to rerender the chart.
  useEffect(() => {
    if (playing && !updateFrameRef.current) {
      updateFrameRef.current = setTimeout(() => {
        setAnimation(({ frameIdx: prevFrameIdx, playing, ...others }) => {
          const isLastFrame = prevFrameIdx === keyframes.length - 1;
          const nextFrameIdx = isLastFrame ? prevFrameIdx : prevFrameIdx + 1;
          return {
            ...others,
            frameIdx: playing ? nextFrameIdx : prevFrameIdx,
            playing: !!(playing && !isLastFrame),
          };
        });
        updateFrameRef.current = null;
      }, 250);
    }
  });

  const barGroupRef = useRef<SpringRef>();
  const axisTopRef = useRef<SpringRef>();
  const axisBottomRef = useRef<SpringRef>();

  useImperativeHandle(ref, () => ({
    replay: () => {
      clearTimeout(updateFrameRef.current as ReturnType<typeof setTimeout>);
      updateFrameRef.current = null;
      setAnimation(({ animationKey, ...others }) => ({
        ...others,
        frameIdx: 0,
        animationKey: animationKey + 1,
        playing: true,
      }));
    },
    start: () => {
      setAnimation((animation) => ({
        ...animation,
        playing: true,
      }));
    },
    stop: () => {
      setAnimation((animation) => ({
        ...animation,
        playing: false,
      }));
      if (barGroupRef.current) barGroupRef.current.stop();
      if (axisTopRef.current) axisTopRef.current.stop();
      if (axisBottomRef.current) axisBottomRef.current.stop();
    },
    playing,
  }));

  const prevPlayingRef = useRef(playing);

  useEffect(() => {
    if (prevPlayingRef.current !== playing) {
      if (playing) {
        onStart();
      } else {
        onStop();
      }
    }
    prevPlayingRef.current = playing;
  }, [playing, onStart, onStop]);

  useLayoutEffect(() => {
    if (playing) {
      if (barGroupRef.current) barGroupRef.current.start();
      if (axisTopRef.current) axisTopRef.current.start();
      if (axisBottomRef.current) axisBottomRef.current.start();
    }
  });

  const frame = keyframes[frameIdx];
  const { date: currentDate, data: frameData } = frame;
  const dates = useMemo(() => keyframes.map((frame) => frame.date as Date), [keyframes]);
  const values = frameData.map(({ value }) => value);
  const gapOffset = barGap * (numOfBars - 1);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom - gapOffset;
  const domainMax = Math.max(...values);

  const xScale = scaleLinear({
    domain: [0, domainMax],
    range: [0, xMax],
  });

  const yScale = useMemo(
    () =>
      scaleBand({
        domain: Array(numOfBars)
          .fill(0)
          .map((_, idx) => idx),
        range: [0, yMax],
      }),
    [numOfBars, yMax]
  );

  const timeScale = useMemo(
    () =>
      scaleBand({
        domain: Array(keyframes.length)
          .fill(0)
          .map((_, i) => i),
        range: [0, xMax],
      }),
    [keyframes, xMax]
  );

  const nameList = useMemo(() => {
    if (keyframes.length === 0) {
      return [];
    }
    return keyframes[0].data.map((d) => d.name);
  }, [keyframes]);

  const colorScale = useMemo(() => scaleOrdinal().domain(nameList).range(schemeTableau10), [nameList]);
  const dateInYear = new Date(currentDate).getFullYear();

  return (
    <svg width={width} height={height}>
      <Group top={margin.top} left={margin.left} key={animationKey}>
        <RacingBarGroup
          frameData={frameData.slice(0, numOfBars)}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
          barGap={barGap}
          ref={barGroupRef}
        />
        <RacingAxisTop domainMax={domainMax} xMax={xMax} height={yMax + gapOffset} ref={axisTopRef} />
        <text
          textAnchor="end"
          style={{
            fontSize: '2.25em',
            fill: theme.palette.text.primary,
          }}
          x={xMax}
          y={yMax}
        >
          {dateInYear}
        </text>
        <line x1={0} y1={0} x2={0} y2={yMax + gapOffset} stroke={theme.palette.text.primary} />
        <Group>
          <VisxText
            fill={theme.palette.text.primary}
            style={{ userSelect: 'none' }}
            textAnchor="end"
            x={-15}
            y={height - margin.bottom / 2}
          >
            {dates[0].toDateString()}
          </VisxText>
          <RacingAxisBottom
            onAnimationChange={(frameIdx) => {
              setAnimation(({ animationKey, ...others }) => ({
                ...others,
                frameIdx: frameIdx,
                animationKey: animationKey,
                playing: true,
              }));

              setTimeout(() => {
                setAnimation(({ animationKey, ...others }) => ({
                  ...others,
                  frameIdx: frameIdx,
                  animationKey: animationKey,
                  playing: false,
                }));
              }, 500);
            }}
            dates={dates as Date[]}
            frameIdx={frameIdx}
            y2={height - margin.bottom / 2}
            scale={timeScale}
            maxFrameLength={keyframes.length}
            cursorWidth={7}
            ref={axisBottomRef}
          />
          <VisxText
            fill={theme.palette.text.primary}
            style={{ userSelect: 'none' }}
            textAnchor="start"
            x={xMax + 15}
            y={height - margin.bottom / 2}
          >
            {dates[keyframes.length - 1].toDateString()}
          </VisxText>
        </Group>
      </Group>
    </svg>
  );
});

export default RacingBarChart;
