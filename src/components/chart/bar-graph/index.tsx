'use client';

import { omit } from '@/utils/obj';
import { useTheme } from '@mui/material';
import { localPoint } from '@visx/event';
import { Grid } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { useMemo } from 'react';
import { AxisBottom } from '../utils/axis-bottom';
import { Legend } from '../utils/legend';
import { TooltipData } from '../utils/tooltip';
import { BarGroup } from './bar-group';
import { BarStack } from './bar-stack';

export type BarGraphDataInstance = {
  x: string;
  group: any;
};

export type BarGraphMode = 'group' | 'stack';

interface BarGraphProps {
  data: BarGraphDataInstance[];
  mode?: BarGraphMode;
  width: number;
  height: number;
  events?: boolean;
  margin?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

let tooltipTimeout: number;

export default function BarGraph(props: BarGraphProps) {
  const theme = useTheme();

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
    scroll: true,
  });

  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  };

  const getX = (d: BarGraphDataInstance) => d.x;
  // groups
  const keys = Object.keys(props.data[0].group);
  const mode = props.mode ?? 'group';

  const totals = props.data.reduce((xTotals, currentX) => {
    const groupTotal = keys.reduce((groupTotal, key) => {
      groupTotal += Number(currentX.group[key]);
      return groupTotal;
    }, 0);
    xTotals.push(groupTotal);
    return xTotals;
  }, [] as number[]);

  const xScale = scaleBand<string>({
    domain: props.data.map(getX),
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
        ? Math.max(...totals)
        : Math.max(
            ...props.data.map((d) =>
              Math.max(...keys.map((key) => Number(d.group[key]))),
            ),
          ),
    ],
    nice: true,
  });
  const colorScale = useMemo(
    () => scaleOrdinal({ domain: keys, range: [...schemeTableau10] }),
    [keys],
  );

  const margin = props.margin ?? { top: 40, left: 0, bottom: 20, right: 0 };

  const xMax = props.width - margin.left - margin.right;
  const yMax = props.height - margin.top - margin.bottom;

  xScale.rangeRound([0, xMax]);
  x1Scale.rangeRound([0, xScale.bandwidth()]);
  yScale.rangeRound([yMax, 0]);

  const barData = props.data.map((d: BarGraphDataInstance) => ({
    ...d.group,
    x: d.x,
  }));

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={containerRef} width={props.width} height={props.height}>
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
        <Group top={margin.top} left={margin.left}>
          {mode === 'stack' ? (
            <BarStack
              x={getX}
              data={barData}
              xScale={xScale}
              yScale={yScale}
              colorScale={colorScale}
              keys={keys}
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
                        if (props.events)
                          alert(`clicked: ${JSON.stringify(bar)}`);
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
                        const left = bar.x + bar.width / 2;
                        const omitData = omit(bar, 'bar');
                        showTooltip({
                          tooltipData: {
                            ...omitData,
                            value: bar.bar.data[bar.key],
                            tick: getX(props.data[bar.index]),
                          },
                          tooltipTop: eventSvgCoords?.y,
                          tooltipLeft: left,
                        });
                      }}
                    />
                  )),
                )
              }
            </BarStack>
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
            >
              {(barGroups) =>
                barGroups.map((barGroup) =>
                  barGroup.bars.map((bar) => (
                    <rect
                      key={`bar-stack-${barGroup.index}-${bar.index}`}
                      x={barGroup.x0 + bar.x}
                      y={bar.y}
                      height={bar.height}
                      width={bar.width}
                      fill={bar.color}
                      onClick={() => {
                        if (props.events)
                          alert(`clicked: ${JSON.stringify(bar)}`);
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
                        const left = barGroup.x0 + bar.x + bar.width / 2;
                        showTooltip({
                          tooltipData: {
                            ...bar,
                            tick: getX(props.data[barGroup.index]),
                          },
                          tooltipTop: eventSvgCoords?.y,
                          tooltipLeft: left,
                        });
                      }}
                    />
                  )),
                )
              }
            </BarGroup>
          )}
        </Group>
        <Group>
          <AxisBottom x={margin.left} y2={yMax + margin.top} scale={xScale} />
        </Group>
      </svg>
      {<Legend top={margin.top} colorScale={colorScale} />}

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
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
