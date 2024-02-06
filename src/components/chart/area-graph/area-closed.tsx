import { AreaClosed as VisxAreaClosed } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { AreaGraphDataInstance } from '.';

type AreaClosedProps = {
  data: AreaGraphDataInstance[];
  x: (d: AreaGraphDataInstance) => number;
  y: (d: AreaGraphDataInstance) => number;
  yScale: PositionScale;
  strokeWidth?: number;
  stroke: string;
  fill?: string;
} & Pick<React.ComponentProps<typeof VisxAreaClosed>, 'curve'>;

export const AreaClosed = ({
  data,
  x,
  y,
  yScale,
  strokeWidth = 1,
  stroke,
  fill = 'none',
  curve,
}: AreaClosedProps) => {
  return (
    <VisxAreaClosed
      data={data}
      x={x}
      y={y}
      yScale={yScale}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      curve={curve}
    ></VisxAreaClosed>
  );
};
