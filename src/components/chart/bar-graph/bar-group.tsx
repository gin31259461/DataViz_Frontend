import { BarGroup as VisxBarGroup } from '@visx/shape';
import {
  Accessor,
  AnyScaleBand,
  PositionScale,
  BarGroup as VisxBarGroupType,
} from '@visx/shape/lib/types';

interface BarGroupProps {
  data: any;
  keys: string[];
  height: number;
  x0: Accessor<any, any>;
  x0Scale: AnyScaleBand;
  x1Scale: AnyScaleBand;
  yScale: PositionScale;
  colorScale: (key: string, index: number) => string;
  children: (barGroups: VisxBarGroupType<string>[]) => React.ReactNode;
}

export const BarGroup = (props: BarGroupProps) => {
  return (
    <VisxBarGroup
      data={props.data}
      keys={props.keys}
      height={props.height}
      x0={props.x0}
      x0Scale={props.x0Scale}
      x1Scale={props.x1Scale}
      yScale={props.yScale}
      color={props.colorScale}
    >
      {props.children}
    </VisxBarGroup>
  );
};
