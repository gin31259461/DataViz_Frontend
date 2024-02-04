import { BarStack as VisxBarStack } from '@visx/shape';
import {
  Accessor,
  PositionScale,
  BarStack as VisxBarStackType,
} from '@visx/shape/lib/types';

interface BarStackProps {
  data: any;
  keys: string[];
  x: Accessor<any, any>;
  xScale: PositionScale;
  yScale: PositionScale;
  colorScale: any;
  children: (batStacks: VisxBarStackType<any, any>[]) => React.ReactNode;
}

export const BarStack = (props: BarStackProps) => {
  return (
    <VisxBarStack
      data={props.data}
      keys={props.keys}
      xScale={props.xScale}
      yScale={props.yScale}
      x={props.x}
      color={props.colorScale}
    >
      {props.children}
    </VisxBarStack>
  );
};
