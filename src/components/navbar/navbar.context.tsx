import { createContext, useMemo, useState } from 'react';

interface NavbarContextProps {
  open: boolean;
  toggleOpen: () => void;
}

export const NavbarContext = createContext<NavbarContextProps>({
  open: true,
  toggleOpen: () => {},
});

/**
 * @summary
 * this hook create a context value for navbar provider
 * @description
 * this hook can't be used directly from other component,
 * it can only create context and pass into navbar provider.
 * If you want to set state or use state,
 * please get context from useContext(NavbarContext)
 * @example
    // in provider component
    const { ctx } = useNavbar();

    <NavbarContext.Provider value={ctx}>
      {props.children}
    </NavbarContext.Provider>

    // other component

    const ctx = useContext(NavbarContext)
 * @returns navbar context
 */
export const useNavbar = () => {
  const [open, setOpen] = useState(true);

  const value = useMemo(() => {
    return {
      toggleOpen: () => setOpen((prev) => !prev),
    };
  }, []);

  const ctx = { open: open, ...value };

  return { ctx };
};
