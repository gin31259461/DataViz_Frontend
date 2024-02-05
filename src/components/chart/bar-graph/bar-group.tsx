import { BarGroupHorizontal, BarGroup as VisxBarGroup } from '@visx/shape';
import {
  Accessor,
  AnyScaleBand,
  PositionScale,
  BarGroupHorizontal as VisxBarGroupHorizontalType,
  BarGroup as VisxBarGroupType,
} from '@visx/shape/lib/types';

type BarGroupMode = 'horizontal' | 'vertical';

export type BarGroupHorizontalProps = {
  data: any;
  keys: string[];
  height: number;
  x0: Accessor<any, any>;
  x0Scale: AnyScaleBand;
  x1Scale: AnyScaleBand;
  yScale: PositionScale;
  colorScale: (key: string, index: number) => string;
  children: (baGroups: VisxBarGroupHorizontalType<string>[]) => React.ReactNode;
  mode: 'horizontal';
};

export type BarGroupVerticalProps = {
  data: any;
  keys: string[];
  height: number;
  x0: Accessor<any, any>;
  x0Scale: AnyScaleBand;
  x1Scale: AnyScaleBand;
  yScale: PositionScale;
  colorScale: (key: string, index: number) => string;
  children: (barGroups: VisxBarGroupType<string>[]) => React.ReactNode;
  mode: 'vertical';
};

export const BarGroup = ({
  data,
  keys,
  height,
  x0,
  x0Scale,
  x1Scale,
  yScale,
  colorScale,
  children,
  mode,
}: BarGroupHorizontalProps | BarGroupVerticalProps) => {
  return (
    <>
      {mode === 'horizontal' ? (
        <BarGroupHorizontal
          data={data}
          keys={keys}
          width={height}
          y0={x0}
          y0Scale={x0Scale}
          y1Scale={x1Scale}
          xScale={yScale}
          color={colorScale}
        >
          {children}
        </BarGroupHorizontal>
      ) : (
        <VisxBarGroup
          data={data}
          keys={keys}
          height={height}
          x0={x0}
          x0Scale={x0Scale}
          x1Scale={x1Scale}
          yScale={yScale}
          color={colorScale}
        >
          {children}
        </VisxBarGroup>
      )}
    </>
  );
};
