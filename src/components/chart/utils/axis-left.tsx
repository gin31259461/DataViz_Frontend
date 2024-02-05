import { useTheme } from '@mui/material';
import { AxisLeft as VisxAxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { PositionScale } from '@visx/shape/lib/types';

interface AxisLeftProps {
  top: number;
  left: number;
  scale: PositionScale;
}

const strokeWidth = 1;

export const AxisLeft = ({ scale, top, left }: AxisLeftProps) => {
  const theme = useTheme();

  return (
    <Group>
      <VisxAxisLeft
        top={top}
        left={left}
        scale={scale}
        tickLabelProps={() => ({
          textAnchor: 'end',
          dx: '-0.25em',
          dy: '0.25em',
          fontSize: 12,
          fill: theme.palette.text.primary,
        })}
        stroke={theme.palette.text.secondary}
        tickStroke={theme.palette.text.primary}
        strokeWidth={strokeWidth}
        hideAxisLine={false}
      />
    </Group>
  );
};
