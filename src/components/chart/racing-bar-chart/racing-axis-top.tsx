import { forwardRef, useImperativeHandle, useRef } from 'react';
import { animated, useSpring, useSpringRef } from 'react-spring';
import AxisTop, { AxisTopProps } from './axis-top';

const AnimatedAxisTop = animated(AxisTop);

const RacingAxisTop = forwardRef(function ForwardRacingAxisTop(
  { domainMax, xMax, height }: AxisTopProps,
  ref,
) {
  const prevDomainMaxRef = useRef(domainMax);
  const prevDomainMax = prevDomainMaxRef.current;
  const api = useSpringRef();

  const springProps = useSpring({
    from: { domainMax: prevDomainMax },
    to: { domainMax },
    ref: api,
  });

  useImperativeHandle(ref, () => ({
    start: () => {
      api.start();
    },
    stop: () => {
      api.stop();
    },
  }));

  return <AnimatedAxisTop xMax={xMax} {...springProps} height={height} />;
});

export default RacingAxisTop;
