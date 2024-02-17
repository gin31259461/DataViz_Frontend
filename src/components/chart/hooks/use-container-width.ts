import { MutableRefObject, useEffect, useState } from 'react';

export const useContainerWidth = (containerRef: MutableRefObject<HTMLDivElement | null>) => {
  const [width, setWidth] = useState(400);

  useEffect(() => {
    function resizeEvent() {
      const element = containerRef.current as HTMLDivElement;
      if (element && 'offsetWidth' in element) {
        setWidth(element.offsetWidth);
      }
    }

    if (containerRef.current) {
      const element = containerRef.current as HTMLDivElement;
      setWidth(element.offsetWidth);
    }

    window.addEventListener('resize', resizeEvent);
    return () => window.removeEventListener('resize', resizeEvent);
  }, [containerRef]);

  return width;
};
