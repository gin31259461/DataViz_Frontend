'use client';

import style from '@/styles/dashboard.module.scss';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
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

function LeftBoard() {
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
        <ListItemButton href="/management/data">
          <ListItemIcon>
            <DatasetRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Data" />
        </ListItemButton>
        <ListItemButton href="/management/project">
          <ListItemIcon>
            <ShowChartRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Project" sx={{ whiteSpace: 'nowrap' }} />
        </ListItemButton>
      </List>
      <Divider />
      <List>
        <ListItemButton href="/management/profile">
          <ListItemIcon>
            <AccountBoxRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton href="/management/account">
          <ListItemIcon>
            <ManageAccountsRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItemButton>
        <ListItemButton href="/management/settings">
          <ListItemIcon>
            <SettingsRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Settings"></ListItemText>
        </ListItemButton>
      </List>
      <Divider />
      <List>
        <ListItemButton>
          <ListItemIcon>
            <LogoutRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

export default LeftBoard;
