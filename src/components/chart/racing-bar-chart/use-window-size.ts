import { useEffect, useState } from 'react';

export default function useWindowSize() {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [windowSize, setWindowSize] = useState(getSize);
  useEffect(() => {
    const onResize = () => {
      setWindowSize(getSize);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return windowSize;
}
