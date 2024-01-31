import { forwardRef, useImperativeHandle } from 'react';
import { animated, useSpringRef, useTransition } from 'react-spring';
import Bar from './bar';
import { FrameDataProps } from './use-keyframes';

interface RacingBarGroupProps {
  frameData: FrameDataProps[];
  xScale: any;
  yScale: any;
  colorScale: any;
  barGap: number;
}

const AnimatedBar = animated(Bar);

const RacingBarGroup = forwardRef(function ForwardRacingBarGroup(
  { frameData, xScale, yScale, colorScale, barGap }: RacingBarGroupProps,
  ref,
) {
  const transitionData = frameData.map(({ name, value }, i) => ({
    y: yScale(i) + i * barGap,
    width: xScale(value),
    value,
    name,
  }));

  const api = useSpringRef();

  const transitions = useTransition(transitionData, {
    initial: (d) => d,
    from: {
      y: yScale.range()[1] + barGap * (transitionData.length - 1),
      width: 0,
      value: 0,
    },
    enter: (d) => d,
    update: (d) => d,
    leave: {
      y: yScale.range()[1] + barGap * (transitionData.length - 1),
      width: 0,
      // value: 0,
    },
    keys: (d) => d.name,
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

  return transitions((style, item, transitionState, i) => {
    return (
      <AnimatedBar
        x={xScale(0)}
        y={style.y}
        width={style.width}
        height={yScale.bandwidth()}
        color={colorScale(item.name)}
        value={style.value.to((t) => t.toFixed())}
        name={item.name}
        key={item.name}
      />
    );
  });
});

export default RacingBarGroup;
