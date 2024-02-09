'use client';

import { ReactNode } from 'react';
import { NavbarContext, useNavbarContext } from './navbar.context';

interface NavbarProviderProps {
  children: ReactNode;
}

export const NavbarProvider = (props: NavbarProviderProps) => {
  const { ctx } = useNavbarContext();

  return <NavbarContext.Provider value={ctx}>{props.children}</NavbarContext.Provider>;
};
