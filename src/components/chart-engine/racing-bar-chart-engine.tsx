import LoadingWithTitle from '@/components/loading/loading-with-title';
import { DataArgsProps } from '@/hooks/store/use-project-store';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import { Container, IconButton } from '@mui/material';
import { Suspense, useEffect, useRef, useState } from 'react';
import RacingBarChart, { RacingBarChartController } from '../chart/racing-bar-chart/racing-bar-chart';
import { FrameDataProps, makeKeyframes } from '../chart/racing-bar-chart/use-keyframes';

export interface RacingBarChartMapping {
  [k: string]: string;
  date: string;
  name: string;
  value: string;
  category: string;
}

export interface RacingBarChartArgs {
  numOfBars: number;
  numOfSlice: number;
  chartMargin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  chartHeight: number;
}

export const convertToRacingBarChartData = (
  data: { [k: string]: any }[],
  args: DataArgsProps<RacingBarChartMapping>,
) => {
  const newData = data.map((tuple) => {
    return {
      date: tuple[args.mapping['date']],
      name: tuple[args.mapping['name']],
      value: parseInt(tuple[args.mapping['value']]),
      category: tuple[args.mapping['category']],
    };
  });
  return newData;
};

function RacingBarChartEngine(props: { data: FrameDataProps[]; args: RacingBarChartArgs }) {
  const keyframes = makeKeyframes(props.data, props.args.numOfSlice);
  const chartRef = useRef<RacingBarChartController>();
  const ChartContainerRef = useRef(null);
  const [chartContainerOffset, setChartContainerOffset] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (ChartContainerRef.current) {
      const element = ChartContainerRef.current as HTMLDivElement;
      setChartContainerOffset({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    }
  }, [ChartContainerRef]);

  const handleReplay = () => {
    if (chartRef.current) chartRef.current.replay();
  };
  const handleStart = () => {
    if (chartRef.current) chartRef.current.start();
  };
  const handleStop = () => {
    if (chartRef.current) chartRef.current.stop();
  };

  const playing = chartRef.current ? chartRef.current.playing : false;
  const [_, forceUpdate] = useState<boolean>();

  return (
    <Container>
      <div ref={ChartContainerRef} style={{ display: 'flex' }}>
        {keyframes.length > 0 && chartContainerOffset && (
          <Suspense fallback={<LoadingWithTitle title="Generating racing bar chart" />}>
            <RacingBarChart
              {...props.args}
              keyframes={keyframes}
              numOfBars={props.args.numOfBars}
              width={chartContainerOffset.width}
              height={props.args.chartHeight}
              margin={props.args.chartMargin}
              onStart={() => forceUpdate(true)}
              onStop={() => forceUpdate(false)}
              barGap={10}
              ref={chartRef}
            />
            <div>
              <IconButton onClick={handleReplay}>
                <ReplayIcon />
              </IconButton>
            </div>
            <div>
              {playing ? (
                <IconButton onClick={handleStop}>
                  <PauseIcon />
                </IconButton>
              ) : (
                <IconButton onClick={handleStart}>
                  <PlayArrowIcon />
                </IconButton>
              )}
            </div>
          </Suspense>
        )}
      </div>
    </Container>
  );
}
export default RacingBarChartEngine;
