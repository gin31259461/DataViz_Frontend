import { useTheme } from '@mui/material';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar, Line } from '@visx/shape';
import {
  defaultStyles,
  useTooltip,
  Tooltip as VisxTooltip,
  TooltipWithBounds as VisxTooltipWithBounds,
} from '@visx/tooltip';
import { bisector, extent, max } from '@visx/vendor/d3-array';
import { timeFormat } from '@visx/vendor/d3-time-format';
import { AxisBottom } from '../utils/axis-bottom';
import { AxisLeft } from '../utils/axis-left';
import { AreaClosed } from './area-closed';
import { LinePath } from './line-path';

export type AreaGraphDataInstance = {
  date: string;
  value: number;
};

export type AreaGraphMode = 'line' | 'area';

type AreaGraphTooltipData = {
  date: string;
  value: number;
};

interface AreaGraphProps {
  data: AreaGraphDataInstance[];
  mode?: AreaGraphMode;
  axisBottom?: boolean;
  axisLeft?: boolean;
  animate?: boolean;
  grid?: boolean;
  width: number | undefined;
  height: number | undefined;
  events?: boolean;
  timeFormatString?: string;
  fillColor?: string;
  margin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

const defaultMargin = { top: 0, right: 10, bottom: 10, left: 10 };
const getDate = (d: AreaGraphDataInstance) => new Date(d.date);
const getValue = (d: AreaGraphDataInstance) => d.value;
const bisectDate = bisector<AreaGraphDataInstance, Date>(
  (d) => new Date(d.date),
).left;

export default function AreaGraph({
  margin = defaultMargin,
  data,
  mode = 'area',
  grid = true,
  axisBottom = false,
  axisLeft = false,
  fillColor,
  timeFormatString = '%Y/%m/%d',
  width,
  height,
}: AreaGraphProps) {
  const theme = useTheme();
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip<AreaGraphTooltipData>();

  if (!width || !height) return null;

  if (!margin.left) margin.left = defaultMargin.left;
  if (!margin.right) margin.right = defaultMargin.right;
  if (!margin.top) margin.top = defaultMargin.top;
  if (!margin.bottom) margin.bottom = defaultMargin.bottom;

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const dateScale = scaleTime({
    domain: extent(data, getDate) as [Date, Date],
    range: [0, xMax],
  });

  const valueScale = scaleLinear({
    domain: [0, (max(data, getValue) || 0) + yMax / 3],
    range: [yMax, 0],
    nice: true,
  });

  const formatDate = timeFormat(timeFormatString);

  if (!fillColor) fillColor = theme.palette.info.main;

  // tooltip handler
  const handleTooltip = (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>,
  ) => {
    const { x } = localPoint(event) || { x: 0 };
    const x0 = dateScale.invert(x);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    if (d1 && getDate(d1)) {
      d =
        x0.valueOf() - getDate(d0).valueOf() >
        getDate(d1).valueOf() - x0.valueOf()
          ? d1
          : d0;
    }
    showTooltip({
      tooltipData: d,
      tooltipLeft: x,
      tooltipTop: valueScale(getValue(d)),
    });
  };

  const tooltipStyles = {
    ...defaultStyles,
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.text.secondary}`,
    color: theme.palette.text.primary,
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <LinearGradient
          id="area-gradient"
          from={fillColor}
          to={fillColor}
          toOpacity={0.1}
        />
        <Group>
          {grid && (
            <>
              <GridRows
                left={margin.left}
                scale={valueScale}
                width={xMax}
                strokeDasharray="1,3"
                stroke={fillColor}
                strokeOpacity={0}
                pointerEvents={'none'}
              />
              <GridColumns
                top={margin.top}
                scale={dateScale}
                height={yMax}
                strokeDasharray="1,3"
                stroke={fillColor}
                strokeOpacity={0.6}
                pointerEvents={'none'}
              />
            </>
          )}
        </Group>
        <Group top={margin.top} left={margin.left}>
          {mode === 'area' ? (
            <AreaClosed
              data={data}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => valueScale(getValue(d)) ?? 0}
              yScale={valueScale}
              stroke={'url(#area-gradient)'}
              fill={'url(#area-gradient)'}
              curve={curveMonotoneX}
            ></AreaClosed>
          ) : (
            <LinePath
              data={data}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => valueScale(getValue(d)) ?? 0}
              stroke={fillColor}
              curve={curveMonotoneX}
            ></LinePath>
          )}
        </Group>
        {axisLeft && (
          <AxisLeft top={margin.top} left={margin.left} scale={valueScale} />
        )}
        {axisBottom && (
          <AxisBottom
            top={margin.top + yMax}
            left={margin.left}
            scale={dateScale}
          />
        )}
        <Group>
          <Bar
            x={margin.left}
            y={margin.top}
            width={xMax}
            height={yMax}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={theme.palette.secondary.main}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </Group>
      </svg>
      {tooltipData && (
        <div>
          <VisxTooltipWithBounds
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {`${getValue(tooltipData)}`}
          </VisxTooltipWithBounds>
          <VisxTooltip
            top={yMax + margin.top - 14}
            left={tooltipLeft}
            style={{
              ...tooltipStyles,
              minWidth: 72,
              textAlign: 'center',
              transform: 'translateX(-50%)',
            }}
          >
            {formatDate(getDate(tooltipData))}
          </VisxTooltip>
        </div>
      )}
    </div>
  );
}
