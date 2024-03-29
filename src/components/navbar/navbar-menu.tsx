import { useSplitLineStyle } from '@/hooks/use-styles';
import styleStore from '@/styles/store.module.scss';
import { colorTokens } from '@/utils/color-tokens';
import { Button, styled, useTheme } from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';

interface NavbarMenuProps {
  children: ReactNode;
  className: string;
  onClose: () => void;
}

export const NavbarMenu = ({ className, onClose, children }: NavbarMenuProps) => {
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);

  return (
    <NavbarMenuContainer
      className={className}
      style={{
        backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : '#fcfcfc',
        borderBottom: useSplitLineStyle(),
      }}
      onClick={() => {
        onClose();
      }}
    >
      <NavbarMenuList>
        <ul>{children}</ul>
      </NavbarMenuList>
    </NavbarMenuContainer>
  );
};

interface MenuItemProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}

export const NavbarMenuItem = ({ href, onClick, children }: MenuItemProps) => {
  return (
    <li>
      <Link
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
        href={href ?? '/'}
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );
};

const NavbarMenuContainer = styled('div')({
  position: 'absolute',
  width: '100%',
  opacity: 0,
  zIndex: 5,
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
  transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
});

const NavbarMenuList = styled('div')({
  display: 'block',
  margin: 0,
  listStyleType: 'none',
  paddingTop: '10px',

  ul: {
    padding: 0,
  },

  'li a': {
    height: '50px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  '& li:hover': {
    opacity: 0.5,
  },
});

interface NavbarMenuShortcutItemProps {
  children: ReactNode;
  href: string;
}

export const NavbarMenuShortcutItem = ({ children, href }: NavbarMenuShortcutItemProps) => {
  return (
    <Link
      className={styleStore['link']}
      href={href}
      style={{
        marginLeft: 20,
        fontSize: 14,
        textShadow: '0 0 .5px',
        transition: 'color .15s ease',
      }}
    >
      {children}
    </Link>
  );
};

interface NavbarMenuButtonProps {
  children: ReactNode;
  href: string | undefined;
  active?: boolean;
}

export const NavbarMenuButton = ({ children, href, active }: NavbarMenuButtonProps) => {
  const theme = useTheme();

  const StyledNavMenuButton = styled(Button)({
    borderRadius: 64,
    backgroundColor: active ? theme.palette.grey[300] : 'inherit',
    color: active ? theme.palette.getContrastText(theme.palette.grey[300]) : 'inherit',
    textTransform: 'none',
    padding: '4px 8px',
  });

  return (
    <StyledNavMenuButton variant="text" href={href}>
      {children}
    </StyledNavMenuButton>
  );
};
