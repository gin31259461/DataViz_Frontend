import { useTheme } from '@mui/material';
import { defaultStyles, useTooltipInPortal, useTooltip as useVisxTooltip } from '@visx/tooltip';

export const useTooltip = <T,>() => {
  const theme = useTheme();

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useVisxTooltip<T>();

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

  return {
    tooltipOpen,
    tooltipTop,
    tooltipLeft,
    tooltipStyles,
    tooltipData,
    hideTooltip,
    showTooltip,
    containerRef,
    TooltipInPortal,
  };
};
