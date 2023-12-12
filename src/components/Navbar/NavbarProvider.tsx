'use client';

import { NavbarContext, useNavbar } from './Navbar.context';

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const { ctx } = useNavbar();

  return (
    <NavbarContext.Provider value={ctx}>
      {props.children}
    </NavbarContext.Provider>
  );
};
