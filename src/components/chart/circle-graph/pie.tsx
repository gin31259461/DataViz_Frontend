import VisxPie, { ProvidedProps } from '@visx/shape/lib/shapes/Pie';
import { ReactNode } from 'react';
import { CircleGraphDataInstance } from '.';

interface PieProps {
  data: CircleGraphDataInstance[];
  pieValue: (d: CircleGraphDataInstance) => number;
  pieSortValues?: (a: number, b: number) => number;
  outerRadius: number;
  innerRadius?: number;
  cornerRadius?: number;
  padAngle?: number;
  children?: (provided: ProvidedProps<CircleGraphDataInstance>) => ReactNode;
}

export const Pie = ({
  data,
  pieValue,
  pieSortValues = () => -1,
  outerRadius,
  innerRadius,
  cornerRadius = 3,
  padAngle = 0.005,
  children,
}: PieProps) => {
  return (
    <VisxPie
      data={data}
      pieValue={pieValue}
      outerRadius={outerRadius}
      innerRadius={innerRadius}
      cornerRadius={cornerRadius}
      pieSortValues={pieSortValues}
      padAngle={padAngle}
    >
      {children}
    </VisxPie>
  );
};
