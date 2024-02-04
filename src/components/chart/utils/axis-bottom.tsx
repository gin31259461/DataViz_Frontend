import { useTheme } from '@mui/material';
import { AxisBottom as VisxAxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { PositionScale } from '@visx/shape/lib/types';

interface AxisBottomProps {
  x: number;
  y2: number;
  scale: PositionScale;
}

const strokeWidth = 1;

export const AxisBottom = (props: AxisBottomProps) => {
  const theme = useTheme();

  return (
    <Group>
      <VisxAxisBottom
        top={props.y2}
        left={props.x}
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
      />
      ;
    </Group>
  );
};
