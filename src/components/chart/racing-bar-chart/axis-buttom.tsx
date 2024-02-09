import { useTheme } from '@mui/material';
import { AxisBottom as VisxAxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { Bar as VisxBar, Circle as VisxCircle } from '@visx/shape';
import { Text as VisxText } from '@visx/text';
import { MouseEvent as MouseEventGeneric, RefObject, useRef, useState } from 'react';

export interface AxisBottomProps {
  x: number;
  y2: number;
  maxFrameLength: number;
  cursorWidth: number;
  cursorHeight?: number;
  scale: any;
  currentFrameIndex: number;
  currentDate: string;
  onAnimationChange: (frameIdx: number) => void;
}

const strokeWidth = 2;

const AxisBottom = (props: AxisBottomProps) => {
  const theme = useTheme();
  const GroupRef = useRef<SVGGElement>();
  const [mousemove, setMousemove] = useState(false);
  const [mouseover, setMouseover] = useState(false);
  const rectHeight = strokeWidth * 20;
  const rectWidthOffset = 40;
  const rectWidth = props.scale(props.maxFrameLength - 1) - props.scale(0) + rectWidthOffset;

  const handleMouseMove = (e: Event | MouseEventGeneric<SVGGElement, MouseEvent>) => {
    const event = e as MouseEventGeneric<SVGGElement, MouseEvent>;
    const originOffset = GroupRef.current?.getBoundingClientRect().x ?? 0;
    const inGroupCurrentX = event.clientX - originOffset;

    let closestIndex = props.currentFrameIndex;
    let shortestDistance = Math.abs(props.scale(0) - props.scale(props.maxFrameLength - 1));

    for (let i = 0; i < props.maxFrameLength; i++) {
      const scaleXPoint = props.scale(i);
      const distance = Math.abs(scaleXPoint - inGroupCurrentX);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestIndex = i;
      }
    }
    props.onAnimationChange(closestIndex);
  };

  return (
    <Group>
      <Group
        onMouseOver={() => setMouseover(true)}
        onMouseLeave={() => {
          setMousemove(false);
          setMouseover(false);
        }}
      >
        <VisxBar
          // fill="red"
          opacity={0}
          x={-rectWidthOffset / 2}
          y={props.y2 - strokeWidth - rectHeight / 2}
          style={{ userSelect: 'none', cursor: 'pointer' }}
          width={rectWidth}
          height={rectHeight}
          onMouseDown={(event) => {
            setMousemove(true);
            handleMouseMove(event);
          }}
          onMouseMove={(event) => {
            if (mousemove) handleMouseMove(event);
          }}
          onMouseUp={() => setMousemove(false)}
        />
        <Group
          innerRef={GroupRef as RefObject<SVGGElement>}
          onMouseDown={(event) => {
            setMousemove(true);
            handleMouseMove(event);
          }}
          onMouseMove={(event) => {
            if (mousemove) handleMouseMove(event);
          }}
          onMouseUp={() => setMousemove(false)}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <VisxAxisBottom
            top={props.y2}
            left={0}
            scale={props.scale}
            tickLabelProps={() => ({
              textAnchor: 'middle',
              dy: '-0.25em',
              fontSize: 12,
              fill: theme.palette.text.primary,
            })}
            stroke={theme.palette.text.secondary}
            tickStroke={theme.palette.text.primary}
            strokeWidth={strokeWidth}
            hideAxisLine={false}
            numTicks={0}
            hideZero={true}
          />
        </Group>
        <VisxCircle
          onMouseDown={(event) => {
            setMousemove(true);
            handleMouseMove(event);
          }}
          onMouseMove={(event) => {
            if (mousemove) handleMouseMove(event);
          }}
          onMouseUp={() => setMousemove(false)}
          style={{
            cursor: 'col-resize',
            userSelect: 'none',
          }}
          opacity={1}
          cx={props.x}
          cy={props.y2}
          r={mouseover ? props.cursorWidth * 1.5 : props.cursorWidth}
          fill={mouseover ? theme.palette.info.main : theme.palette.grey[500]}
        />
      </Group>
      {mouseover && (
        <VisxText
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          x={props.x}
          y={props.y2 + 30}
          fill={theme.palette.text.primary}
        >
          {props.currentDate}
        </VisxText>
      )}
    </Group>
  );
};

export default AxisBottom;
