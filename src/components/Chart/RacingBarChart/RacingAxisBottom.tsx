import { forwardRef, useImperativeHandle, useRef } from 'react';
import { animated, useSpring, useSpringRef } from 'react-spring';
import AxisBottom, { AxisBottomProps } from './AxisBottom';

const AnimatedAxisBottom = animated(AxisBottom);

const RacingAxisBottom = forwardRef(function ForwardRacingAxisBottom(
  props: Omit<
    AxisBottomProps & { dates: Date[]; frameIdx: number },
    'x' | 'currentDate' | 'currentFrameIndex'
  >,
  ref,
) {
  const prevFrameIdxRef = useRef(props.frameIdx);
  const prevFrameIdx = prevFrameIdxRef.current;
  const api = useSpringRef();
  const currentDate = props.dates[props.frameIdx].toDateString();

  const springProps = useSpring({
    from: {
      x:
        props.scale(prevFrameIdx) +
        props.scale.bandwidth() / 2 -
        props.cursorWidth / 2,
    },
    to: {
      x:
        props.scale(props.frameIdx) +
        props.scale.bandwidth() / 2 -
        props.cursorWidth / 2,
    },
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

  return (
    <AnimatedAxisBottom
      currentFrameIndex={props.frameIdx}
      onAnimationChange={props.onAnimationChange}
      currentDate={currentDate}
      cursorHeight={props.cursorHeight}
      cursorWidth={props.cursorWidth}
      scale={props.scale}
      y2={props.y2}
      maxFrameLength={props.maxFrameLength}
      {...springProps}
    />
  );
});

export default RacingAxisBottom;
