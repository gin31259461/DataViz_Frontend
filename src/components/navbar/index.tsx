'use client';

import { useSplitLineStyle } from '@/hooks/use-styles';
import style from '@/styles/navbar.module.scss';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useState } from 'react';
import DataVizIcon from './data-viz-icon';
import { NavbarMenu, NavbarMenuButton, NavbarMenuItem } from './navbar-menu';
import { NavbarContext } from './navbar.context';

interface NavbarProps {
  dropDownMenuItemList: string[];
  dropDownMenuItemHref: string[];
  navbarMenuItemList: string[];
  navbarMenuItemHref: string[];
  rightSideSubMenu: React.ReactNode;
  children: React.ReactNode;
}

export default function Navbar(props: NavbarProps) {
  const navbar = useContext(NavbarContext);
  const theme = useTheme();
  const splitPathName = usePathname().split('/');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <div
      className={style['container']}
      style={{
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgb(20, 27, 45, 0.7)'
            : 'rgb(252, 252, 252, 0.8)',
        borderBottom: `${useSplitLineStyle()}`,
        translate: navbar.open ? '0 0' : '0 -80px',
      }}
    >
      <div className={style['navbar-container']}>
        <div>
          <Link
            onClick={handleClose}
            href={'/'}
            className={style['link']}
            title={''}
          >
            <DataVizIcon color={theme.palette.primary.main}></DataVizIcon>
          </Link>
        </div>

        <h2 style={{ marginLeft: '12px' }}>
          <Link
            onClick={handleClose}
            href={'/'}
            className={style['link']}
            title={''}
          >
            Data Viz
          </Link>
        </h2>

        <div className={style['nav-menu']}>
          <div className={style['nav-menu-1']}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {props.navbarMenuItemList.length ==
                props.navbarMenuItemHref.length &&
                props.navbarMenuItemList.map((item, i) => {
                  const pathnames = props.navbarMenuItemHref[i].split('/');
                  return (
                    <NavbarMenuButton
                      key={i}
                      active={
                        splitPathName[splitPathName.length - 1] ==
                        pathnames[pathnames.length - 1]
                      }
                      href={props.navbarMenuItemHref[i]}
                    >
                      {item}
                    </NavbarMenuButton>
                  );
                })}
            </div>
          </div>

          <div className={style['nav-menu-2']}>
            <div className={style['nav-menu-2-1']}>
              {props.rightSideSubMenu}
            </div>
            {props.children}

            <IconButton
              className={style['nav-menu-list-button']}
              onClick={() => {
                setMenuOpen((prev) => !prev);
              }}
            >
              {menuOpen ? (
                <CloseOutlinedIcon fontSize={'medium'}></CloseOutlinedIcon>
              ) : (
                <MenuOutlinedIcon fontSize={'medium'}></MenuOutlinedIcon>
              )}
            </IconButton>
          </div>
        </div>
      </div>

      <NavbarMenu
        className={menuOpen ? style['nav-menu-open'] : style['nav-menu-close']}
        onClose={handleClose}
      >
        {props.dropDownMenuItemList.length ==
          props.dropDownMenuItemHref.length &&
          props.dropDownMenuItemList.map((item, i) => {
            return (
              <NavbarMenuItem href={props.dropDownMenuItemHref[i]} key={i}>
                {item}
              </NavbarMenuItem>
            );
          })}
      </NavbarMenu>

      {menuOpen && (
        <div
          className={style['backdrop']}
          onClick={() => {
            setMenuOpen(false);
          }}
        ></div>
      )}
    </div>
  );
}
