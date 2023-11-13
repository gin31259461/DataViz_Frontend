import { useTheme } from '@mui/material';
import { AxisTop as VisxAxisTop } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';

export interface AxisTopProps {
  domainMax: number;
  xMax: number;
  height: number;
}

const AxisTop = ({ domainMax, xMax, height }: AxisTopProps) => {
  const theme = useTheme();
  const numTicks = xMax > 500 ? 5 : Math.floor(xMax / 100);
  const xScaleForAxis = scaleLinear({
    domain: [0, domainMax],
    range: [0, xMax],
  });
  return (
    <Group>
      <GridColumns
        scale={xScaleForAxis}
        width={xMax}
        height={height}
        numTicks={numTicks}
        stroke="white"
        strokeWidth={2}
        opacity={0.2}
      />
      <VisxAxisTop
        top={0}
        left={0}
        scale={xScaleForAxis}
        tickLabelProps={() => ({
          textAnchor: 'middle',
          dy: '-0.25em',
          fontSize: 12,
          fill: theme.palette.text.primary,
        })}
        tickStroke={theme.palette.text.primary}
        hideAxisLine={true}
        numTicks={numTicks}
      />
    </Group>
  );
};

export default AxisTop;
