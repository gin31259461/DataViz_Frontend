import { LegendOrdinal } from '@visx/legend';

interface LegendProps {
  top: number;
  colorScale: any;
}

export const Legend = (props: LegendProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: props.top / 2 - 10,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        fontSize: '14px',
      }}
    >
      <LegendOrdinal scale={props.colorScale} direction="row" labelMargin="0 15px 0 0" />
    </div>
  );
};
