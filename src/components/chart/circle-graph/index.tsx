'use client';

import { localPoint } from '@visx/event';
import { EventType } from '@visx/event/lib/types';
import { Group } from '@visx/group';
import { scaleOrdinal } from '@visx/scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { Legend } from '../utils/legend';
import { useTooltip } from '../utils/tooltip';
import { AnimatedPie } from './animated-pie';
import { Pie } from './pie';

export type CircleGraphMode = 'pie' | 'donut';

type CircleGraphTooltipData = {
  label: string;
  value: number;
};

export type CircleGraphDataInstance = {
  name?: string;
  label: string;
  value: number;
};

interface CircleGraphProps {
  data: CircleGraphDataInstance[];
  mode?: CircleGraphMode;
  width: number | undefined;
  height: number | undefined;
  events?: boolean;
  animate?: boolean;
  margin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

let tooltipTimeout: number;
const defaultMargin = { top: 40, right: 20, bottom: 20, left: 20 };
const getLabel = (d: CircleGraphDataInstance) => d.label;
const getValue = (d: CircleGraphDataInstance) => d.value;

export default function CircleGraph({
  data,
  mode = 'pie',
  animate = true,
  width,
  height,
  margin = defaultMargin,
}: CircleGraphProps) {
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
  } = useTooltip<CircleGraphTooltipData>();

  if (width === undefined || height === undefined) return null;

  if (!margin.left) margin.left = defaultMargin.left;
  if (!margin.right) margin.right = defaultMargin.right;
  if (!margin.top) margin.top = defaultMargin.top;
  if (!margin.bottom) margin.bottom = defaultMargin.bottom;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;

  const labels = data.map(getLabel);

  const colorScale = scaleOrdinal({
    domain: labels,
    range: [...schemeTableau10],
  });

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={containerRef} width={width} height={height}>
        <Group top={centerY + margin.top} left={centerX + margin.left}>
          <Pie
            data={data}
            pieValue={getValue}
            outerRadius={radius}
            innerRadius={mode === 'pie' ? undefined : radius / 2}
          >
            {(pie) => (
              <AnimatedPie<CircleGraphDataInstance>
                {...pie}
                fontSize={radius / 10}
                animate={animate}
                getKey={({ data: { label } }) => label}
                onClickDatum={() => {}}
                onMouseLeave={() => {
                  tooltipTimeout = window.setTimeout(() => {
                    hideTooltip();
                  }, 300);
                }}
                onMouseMove={(event, { data: { label, value } }) => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                  const eventSvgCoords = localPoint(event as unknown as EventType);

                  showTooltip({
                    tooltipData: {
                      label: label,
                      value: value,
                    },
                    tooltipTop: eventSvgCoords?.y,
                    tooltipLeft: eventSvgCoords?.x,
                  });
                }}
                getColor={({ data: { label } }) => colorScale(label)}
              />
            )}
          </Pie>
        </Group>
      </svg>

      <Legend top={margin.top / 2} colorScale={colorScale} />

      <div>
        {tooltipOpen && tooltipData && (
          <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
            <div style={{ color: colorScale(tooltipData.label) }}>
              <strong>{tooltipData.label}</strong>
            </div>
            <div>{tooltipData.value}</div>
          </TooltipInPortal>
        )}
      </div>
    </div>
  );
}
