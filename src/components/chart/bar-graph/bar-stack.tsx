import { BarStackHorizontal, BarStack as VisxBarStack } from '@visx/shape';
import {
  Accessor,
  PositionScale,
  BarStack as VisxBarStackType,
} from '@visx/shape/lib/types';

type BarStackVerticalProps = {
  data: any;
  keys: string[];
  x: Accessor<any, any>;
  xScale: PositionScale;
  yScale: PositionScale;
  colorScale: any;
  children: (batStacks: VisxBarStackType<any, string>[]) => React.ReactNode;
  mode: 'horizontal' | 'vertical';
};

export const BarStack = ({
  data,
  keys,
  x,
  xScale,
  yScale,
  colorScale,
  children,
  mode,
}: BarStackVerticalProps) => {
  return (
    <>
      {mode == 'vertical' ? (
        <VisxBarStack
          data={data}
          keys={keys}
          xScale={xScale}
          yScale={yScale}
          x={x}
          color={colorScale}
        >
          {children}
        </VisxBarStack>
      ) : (
        <BarStackHorizontal
          data={data}
          keys={keys}
          xScale={xScale}
          yScale={yScale}
          y={x}
          color={colorScale}
        >
          {children}
        </BarStackHorizontal>
      )}
    </>
  );
};
