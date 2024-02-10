'use client';

import style from '@/styles/dashboard.module.scss';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';

interface LeftBoardProps {
  items: string[];
  icons: ReactNode[];
  href: string[];
}

const closeWidth = 40;
const openWidth = 150;

function LeftBoard(props: LeftBoardProps) {
  const theme = useTheme();
  const [drawerWidth, setDrawerWidth] = useState(openWidth);
  const [open, setOpen] = useState(true);

  return (
    <Drawer
      className={style['drawer']}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
      }}
      variant="persistent"
      anchor="left"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.default,
          width: drawerWidth,
          transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          height: 'calc(100vh - 60px)',
          top: '60px',
          zIndex: 10,
          overflow: 'hidden',
        },
      }}
      open
    >
      <List>
        <ListItemButton
          onClick={() => {
            if (open) {
              setDrawerWidth(closeWidth);
              setOpen(false);
            } else {
              setDrawerWidth(openWidth);
              setOpen(true);
            }
          }}
          sx={{ padding: 1 }}
        >
          <ListItemIcon sx={{ width: 24 }}>{open ? <CloseOutlinedIcon /> : <MenuOutlinedIcon />}</ListItemIcon>
        </ListItemButton>
        <Divider />
        {props.items.map((item, i) => {
          return (
            <ListItemButton sx={{ padding: 1 }} key={i} href={props.href.at(i) ?? '/'}>
              <ListItemIcon sx={{ width: 24 }}>{props.icons.at(i) ?? <></>}</ListItemIcon>
              <ListItemText primary={item} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}

export default LeftBoard;
