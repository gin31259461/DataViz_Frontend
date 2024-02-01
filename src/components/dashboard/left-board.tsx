'use client';

import style from '@/styles/dashboard.module.scss';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

interface LeftBoardProps {
  items: string[];
  icons: React.ReactNode[];
  href: string[];
}

function LeftBoard(props: LeftBoardProps) {
  const closeWidth = 50;
  const openWidth = 150;

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
      <Divider />
      <div style={{ padding: 3 }}>
        {open ? (
          <IconButton
            onClick={() => {
              setDrawerWidth(closeWidth);
              setOpen(false);
            }}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              setDrawerWidth(openWidth);
              setOpen(true);
            }}
          >
            <ArrowForwardIosRoundedIcon />
          </IconButton>
        )}
      </div>
      <Divider />
      <List>
        {props.items.map((item, i) => {
          return (
            <ListItemButton key={i} href={props.href.at(i) ?? '/'}>
              <ListItemIcon>{props.icons.at(i) ?? <></>}</ListItemIcon>
              <ListItemText primary={item} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}

export default LeftBoard;
