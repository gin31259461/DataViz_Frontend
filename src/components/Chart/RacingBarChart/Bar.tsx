import { useTheme } from '@mui/material';
import { Group } from '@visx/group';
import { Bar as VisxBar } from '@visx/shape';
import { Text as VisxText } from '@visx/text';
import { Fragment } from 'react';
import { Interpolation } from 'react-spring';

interface BarProps {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  value: number | Interpolation<number>;
}

const Bar = ({ color, x, y, width, height, name, value }: BarProps) => {
  const theme = useTheme();

  return (
    <Fragment>
      {name && (
        <Group>
          <VisxBar
            x={x}
            y={y}
            width={width}
            height={height}
            fill={color}
            style={{ opacity: 0.8 }}
          />
          <VisxText
            verticalAnchor="middle"
            textAnchor="end"
            x={x - 10}
            y={y + height / 2}
            fontSize={height / 3}
            fontWeight={'bold'}
            fill={theme.palette.text.primary}
          >
            {name}
          </VisxText>
          <VisxText
            textAnchor="start"
            verticalAnchor="middle"
            x={width + 10}
            y={y + height / 2}
            fontSize={height / 3}
            fill={theme.palette.text.primary}
          >
            {value.toString()}
          </VisxText>
          {/* <Icon x={x - 25} y={y + height / 3} width={20} height={20} /> */}
        </Group>
      )}
    </Fragment>
  );
};

export default Bar;
