'use client';

import { createContext, useMemo, useState } from 'react';

interface NavbarContextProps {
  open: boolean;
  toggleOpen: () => void;
}

export const NavbarContext = createContext<NavbarContextProps>({
  open: true,
  toggleOpen: () => {},
});

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const [open, setOpen] = useState(true);

  const ctx = useMemo(() => {
    return {
      toggleOpen: () => setOpen((prev) => !prev),
    };
  }, []);

  console.log(ctx);

  return (
    <NavbarContext.Provider value={{ open: open, ...ctx }}>
      {props.children}
    </NavbarContext.Provider>
  );
};
