import { MutableRefObject } from 'react';

export const scrollAllTop = (element: MutableRefObject<unknown>) => {
  (element.current as Element).scrollTop = 0;
};
