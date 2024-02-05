import { PieArcDatum, ProvidedProps } from '@visx/shape/lib/shapes/Pie';
import { animated, to, useTransition } from 'react-spring';

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  fontSize?: number;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  onMouseMove: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    d: PieArcDatum<Datum>,
    cx: number,
    cy: number,
  ) => void;
  onMouseLeave: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    d: PieArcDatum<Datum>,
    cx: number,
    cy: number,
  ) => void;
  delay?: number;
};

export function AnimatedPie<Datum>({
  animate,
  arcs,
  fontSize = 12,
  path,
  getKey,
  getColor,
  onClickDatum,
  onMouseLeave,
  onMouseMove,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={to([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            }),
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onMouseMove={(event) => onMouseMove(event, arc, centroidX, centroidY)}
          onMouseLeave={(event) =>
            onMouseLeave(event, arc, centroidX, centroidY)
          }
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill={'white'}
              x={centroidX.toFixed(4)}
              y={centroidY.toFixed(4)}
              dy=".33em"
              fontSize={fontSize}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}
