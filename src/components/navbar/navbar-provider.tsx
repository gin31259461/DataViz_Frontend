'use client';

import { NavbarContext, useNavbarContext } from './navbar.context';

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const { ctx } = useNavbarContext();

  return (
    <NavbarContext.Provider value={ctx}>
      {props.children}
    </NavbarContext.Provider>
  );
};
