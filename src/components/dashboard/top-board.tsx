'use client';

import style from '@/styles/dashboard.module.scss';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
} from '@mui/material';

const ListItemIconStyled = styled(ListItemIcon)({
  // minWidth: 2,
});

interface TopBoardProps {
  items: string[];
  icons: React.ReactNode[];
  href: string[];
}

function TopBoard(props: TopBoardProps) {
  const theme = useTheme();
  return (
    <div
      className={style['top-board']}
      style={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <div
        style={{
          display: 'flex',
          padding: 3,
        }}
      >
        {props.items.map((item, i) => {
          return (
            <ListItemButton key={i} href={props.href.at(i) ?? '/'}>
              <ListItemIconStyled>
                {props.icons.at(i) ?? <></>}
              </ListItemIconStyled>
              <ListItemText primary={item} />
            </ListItemButton>
          );
        })}
      </div>
    </div>
  );
}

export default TopBoard;
