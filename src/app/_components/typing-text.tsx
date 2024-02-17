'use client';

import effect from '@/styles/effect.module.scss';
import { colorTokens } from '@/utils/color-tokens';
import { useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

type TypingTextProps = {
  children: string[];
};

export const TypingText = (props: TypingTextProps) => {
  const limit = props.children.length;
  const theme = useTheme();

  const [typingAnimation, setTypingAnimation] = useState(true);
  const [stopTypingFlag, setStopTypingFlag] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const color = colorTokens(theme.palette.mode);

  useEffect(() => {
    let intervalID: ReturnType<typeof setInterval>;
    let timeoutID: ReturnType<typeof setInterval>;
    if (typingAnimation) {
      setCurrentTextIndex((prev) => (prev + 1 < limit ? prev + 1 : 0));
      intervalID = setInterval(() => {
        setTypingAnimation(() => false);
      }, 5000);
      timeoutID = setTimeout(() => {
        setStopTypingFlag(true);
      }, 500);
    } else {
      setStopTypingFlag(false);
      intervalID = setInterval(() => {
        setTypingAnimation(() => true);
      }, 500);
    }
    return () => {
      clearInterval(intervalID);
      clearInterval(timeoutID);
    };
  }, [typingAnimation, limit]);

  useEffect(() => {
    if (document.getElementById('typing-text') !== null) {
      document.getElementById('typing-text')?.style.setProperty('--cursor-color', color.greenAccent[500]);
      document.getElementById('typing-text')?.style.setProperty('--background-color', theme.palette.background.default);
    }
  }, [theme.palette.mode, theme.palette.background, color.greenAccent]);

  return (
    <div
      id={'typing-text'}
      className={
        effect['typing-effect'] +
        ' ' +
        (typingAnimation ? effect['typing'] : effect['deleting']) +
        ' ' +
        (stopTypingFlag ? effect['flash-border'] : '')
      }
    >
      {props.children.length > 0 && props.children[currentTextIndex]}
    </div>
  );
};

export default TypingText;
