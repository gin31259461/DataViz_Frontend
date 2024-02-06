import { LinePath as VisxLinePath } from '@visx/shape';
import { AreaGraphDataInstance } from '.';

type LinePathProps = {
  data: AreaGraphDataInstance[];
  x: (d: AreaGraphDataInstance) => number;
  y: (d: AreaGraphDataInstance) => number;
  stroke: string;
  strokeWidth?: number;
} & Pick<React.ComponentProps<typeof VisxLinePath>, 'curve'>;

export const LinePath = ({
  data,
  x,
  y,
  stroke,
  strokeWidth = 2,
  curve,
}: LinePathProps) => {
  return (
    <VisxLinePath
      data={data}
      x={x}
      y={y}
      stroke={stroke}
      strokeWidth={strokeWidth}
      curve={curve}
    ></VisxLinePath>
  );
};
