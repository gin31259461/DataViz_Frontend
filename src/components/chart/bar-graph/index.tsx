'use client';

import { omit } from '@/utils/object';
import { useTheme } from '@mui/material';
import { localPoint } from '@visx/event';
import { Grid } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { AxisBottom } from '../utils/axis-bottom';
import { AxisLeft } from '../utils/axis-left';
import { Legend } from '../utils/legend';
import { useTooltip } from '../utils/tooltip';
import { BarGroup } from './bar-group';
import { BarStack } from './bar-stack';

export type BarGraphTooltipData = {
  value: number;
  tick: string;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export type BarGraphDataInstance = {
  x: string;
  group: any;
};

export type BarGraphMode = 'group' | 'stack';

interface BarGraphProps {
  data: BarGraphDataInstance[];
  mode?: BarGraphMode;
  axisBottom?: boolean;
  axisLeft?: boolean;
  grid?: boolean;
  legend?: boolean;
  horizontal?: boolean;
  animate?: boolean;
  width: number | undefined;
  height: number | undefined;
  events?: boolean;
  margin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

let tooltipTimeout: number;
const yDomainMaxScale = 1.1;
const defaultMargin = { top: 40, left: 0, bottom: 30, right: 0 };

export default function BarGraph({
  data,
  mode = 'group',
  grid = true,
  legend = true,
  axisBottom = true,
  axisLeft = false,
  animate = true,
  horizontal = false,
  width,
  height,
  events,
  margin = defaultMargin,
}: BarGraphProps) {
  const theme = useTheme();

  const {
    tooltipOpen,
    tooltipTop,
    tooltipLeft,
    tooltipStyles,
    TooltipInPortal,
    tooltipData,
    hideTooltip,
    showTooltip,
    containerRef,
  } = useTooltip<BarGraphTooltipData>();

  if (width === undefined || height === undefined) {
    return null;
  }

  if (!margin.left) margin.left = defaultMargin.left;
  if (!margin.right) margin.right = defaultMargin.right;
  if (!margin.top) margin.top = defaultMargin.top;
  if (!margin.bottom) margin.bottom = defaultMargin.bottom;

  const getX = (d: BarGraphDataInstance) => d.x;
  // groups
  const keys = Object.keys(data[0].group);

  const totals = data.reduce((xTotals, currentX) => {
    const groupTotal = keys.reduce((groupTotal, key) => {
      groupTotal += Number(currentX.group[key]);
      return groupTotal;
    }, 0);
    xTotals.push(groupTotal);
    return xTotals;
  }, [] as number[]);

  const xScale = scaleBand<string>({
    domain: data.map(getX),
    padding: 0.2,
  });
  const x1Scale = scaleBand<string>({
    domain: keys,
    padding: 0.1,
  });
  const yScale = scaleLinear<number>({
    domain: [
      0,
      mode === 'stack'
        ? Math.max(...totals) * yDomainMaxScale
        : Math.max(...data.map((d) => Math.max(...keys.map((key) => Number(d.group[key]))))) * yDomainMaxScale,
    ],
    nice: true,
  });
  const colorScale = scaleOrdinal({
    domain: keys,
    range: [...schemeTableau10],
  });

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  xScale.rangeRound(horizontal ? [0, yMax] : [0, xMax]);
  x1Scale.rangeRound([0, xScale.bandwidth()]);
  yScale.rangeRound(horizontal ? [0, xMax] : [yMax, 0]);

  const barData = data.map((d: BarGraphDataInstance) => ({
    ...d.group,
    x: d.x,
  }));

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={containerRef} width={width} height={height}>
        {grid && (
          <Grid
            top={margin.top}
            left={margin.left}
            xScale={xScale}
            yScale={yScale}
            width={xMax}
            height={yMax}
            stroke={theme.palette.text.primary}
            strokeOpacity={0.1}
            xOffset={xScale.bandwidth() / 2}
          />
        )}
        <Group top={margin.top} left={margin.left}>
          {mode === 'stack' ? (
            <BarStack
              x={getX}
              data={barData}
              xScale={horizontal ? yScale : xScale}
              yScale={horizontal ? xScale : yScale}
              colorScale={colorScale}
              keys={keys}
              mode={horizontal ? 'horizontal' : 'vertical'}
            >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar) => (
                    <rect
                      key={`bar-stack-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      height={bar.height}
                      width={bar.width}
                      fill={bar.color}
                      onClick={() => {
                        if (events) alert(`clicked: ${JSON.stringify(bar)}`);
                      }}
                      onMouseLeave={() => {
                        tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      }}
                      onMouseMove={(event) => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        // TooltipInPortal expects coordinates to be relative to containerRef
                        // localPoint returns coordinates relative to the nearest SVG, which
                        // is what containerRef is set to in this example.
                        const eventSvgCoords = localPoint(event);
                        const omitData = omit(bar, 'bar');

                        showTooltip({
                          tooltipData: {
                            ...omitData,
                            value: bar.bar.data[bar.key],
                            tick: getX(data[bar.index]),
                          },
                          tooltipTop: eventSvgCoords?.y,
                          tooltipLeft: eventSvgCoords?.x,
                        });
                      }}
                    />
                  )),
                )
              }
            </BarStack>
          ) : (
            <>
              {horizontal ? (
                <BarGroup
                  data={barData}
                  keys={keys}
                  height={yMax}
                  x0={getX}
                  x0Scale={xScale}
                  x1Scale={x1Scale}
                  yScale={yScale}
                  colorScale={colorScale}
                  mode={'horizontal'}
                >
                  {(barGroups) => {
                    return barGroups.map((barGroup, i) => (
                      <Group key={`bar-group-${barGroup.index}-${barGroup.y0}`} top={barGroup.y0}>
                        {barGroup.bars.map((bar) => (
                          <rect
                            key={`bar-stack-${barGroup.index}-${bar.index}`}
                            x={bar.x}
                            y={bar.y}
                            height={bar.height}
                            width={bar.width}
                            fill={bar.color}
                            onClick={() => {
                              if (events) alert(`clicked: ${JSON.stringify(bar)}`);
                            }}
                            onMouseLeave={() => {
                              tooltipTimeout = window.setTimeout(() => {
                                hideTooltip();
                              }, 300);
                            }}
                            onMouseMove={(event) => {
                              if (tooltipTimeout) clearTimeout(tooltipTimeout);
                              const eventSvgCoords = localPoint(event);

                              showTooltip({
                                tooltipData: {
                                  ...bar,
                                  tick: getX(data[barGroup.index]),
                                },
                                tooltipTop: eventSvgCoords?.y,
                                tooltipLeft: eventSvgCoords?.x,
                              });
                            }}
                          />
                        ))}
                      </Group>
                    ));
                  }}
                </BarGroup>
              ) : (
                <BarGroup
                  data={barData}
                  keys={keys}
                  height={yMax}
                  x0={getX}
                  x0Scale={xScale}
                  x1Scale={x1Scale}
                  yScale={yScale}
                  colorScale={colorScale}
                  mode={'vertical'}
                >
                  {(barGroups) => {
                    return barGroups.map((barGroup, i) => (
                      <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                        {barGroup.bars.map((bar) => (
                          <rect
                            key={`bar-stack-${barGroup.index}-${bar.index}`}
                            x={bar.x}
                            y={bar.y}
                            height={bar.height}
                            width={bar.width}
                            fill={bar.color}
                            onClick={() => {
                              if (events) alert(`clicked: ${JSON.stringify(bar)}`);
                            }}
                            onMouseLeave={() => {
                              tooltipTimeout = window.setTimeout(() => {
                                hideTooltip();
                              }, 300);
                            }}
                            onMouseMove={(event) => {
                              if (tooltipTimeout) clearTimeout(tooltipTimeout);
                              const eventSvgCoords = localPoint(event);

                              showTooltip({
                                tooltipData: {
                                  ...bar,
                                  tick: getX(data[barGroup.index]),
                                },
                                tooltipTop: eventSvgCoords?.y,
                                tooltipLeft: eventSvgCoords?.x,
                              });
                            }}
                          />
                        ))}
                      </Group>
                    ));
                  }}
                </BarGroup>
              )}
            </>
          )}
        </Group>
        {axisBottom && <AxisBottom top={yMax + margin.top} left={margin.left} scale={horizontal ? yScale : xScale} />}
        {axisLeft && <AxisLeft top={margin.top} left={margin.left} scale={horizontal ? xScale : yScale} />}
      </svg>

      {legend && <Legend top={margin.top / 2} colorScale={colorScale} />}

      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div style={{ color: colorScale(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{tooltipData.value}</div>
          <div>
            <small>{tooltipData.tick}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
