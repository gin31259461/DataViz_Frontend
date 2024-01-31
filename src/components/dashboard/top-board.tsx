'use client';

import style from '@/styles/dashboard.module.scss';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
} from '@mui/material';

const ListItemIconStyled = styled(ListItemIcon)({
  minWidth: 2,
});

function TopBoard() {
  const theme = useTheme();
  return (
    <div
      className={style['top-board']}
      style={{ backgroundColor: theme.palette.background.paper }}
    >
      <div style={{ display: 'flex', padding: 3 }}>
        <ListItemButton href="/management/data">
          <ListItemIconStyled>
            <DatasetRoundedIcon />
          </ListItemIconStyled>
          <ListItemText primary="Data" />
        </ListItemButton>
        <ListItemButton href="/management/project">
          <ListItemIconStyled>
            <ShowChartRoundedIcon />
          </ListItemIconStyled>
          <ListItemText primary="Project" sx={{ whiteSpace: 'nowrap' }} />
        </ListItemButton>
        <ListItemButton href="/management/profile">
          <ListItemIconStyled>
            <AccountBoxRoundedIcon />
          </ListItemIconStyled>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton href="/management/account">
          <ListItemIconStyled>
            <ManageAccountsRoundedIcon />
          </ListItemIconStyled>
          <ListItemText primary="Account" />
        </ListItemButton>
        <ListItemButton href="/management/settings">
          <ListItemIconStyled>
            <SettingsRoundedIcon />
          </ListItemIconStyled>
          <ListItemText primary="Settings"></ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIconStyled>
            <LogoutRoundedIcon />
          </ListItemIconStyled>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </div>
    </div>
  );
}

export default TopBoard;
