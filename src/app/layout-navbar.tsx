'use client';

import OpenCMDKButton, { CtrlK } from '@/components/modal/command-modal/open-cmdk-button';
import { ConfirmModal } from '@/components/modal/confirm-modal';
import Navbar from '@/components/navbar';
import AccountMenu from '@/components/navbar/account-menu';
import Avatar from '@/components/navbar/avatar';
import { useSplitLineStyle } from '@/hooks/use-styles';
import style from '@/styles/navbar.module.scss';
import { ColorModeContext } from '@/utils/theme';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Button, IconButton, useTheme } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MouseEvent, useContext, useState } from 'react';

const dropDownMenuItemList = ['Data', 'Project', 'Settings'];
const dropDownMenuItemHref = ['/management/data', '/management/project', '/management/settings'];

const navbarMenuItemList = ['Data', 'Project', 'Settings'];
const navbarMenuItemHref = ['/management/data', '/management/project', '/management/settings'];

export default function LayoutNavbar() {
  const theme = useTheme();
  const router = useRouter();
  const { data, status } = useSession();
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const avatarClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLoginOut = () => {
    if (status === 'authenticated') setSignOutModalOpen(true);
  };

  return (
    <>
      <Navbar
        dropDownMenuItemList={dropDownMenuItemList}
        dropDownMenuItemHref={dropDownMenuItemHref}
        navbarMenuItemList={navbarMenuItemList}
        navbarMenuItemHref={navbarMenuItemHref}
        rightSideSubMenu={
          <>
            <Button
              sx={{
                border: useSplitLineStyle(),
                textTransform: 'none',
              }}
              color="primary"
            >
              Feedback
            </Button>
            {status === 'unauthenticated' && (
              <Button
                sx={{
                  textTransform: 'none',
                }}
                color="primary"
                variant="contained"
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
            )}
            <OpenCMDKButton />
          </>
        }
      >
        <CtrlK className={style['CMDK']} />

        <IconButton onClick={() => colorMode.toggleColorMode()}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon fontSize={'medium'}></DarkModeOutlinedIcon>
          ) : (
            <LightModeOutlinedIcon fontSize={'medium'}></LightModeOutlinedIcon>
          )}
        </IconButton>

        <IconButton
          sx={{
            width: 36,
            height: 36,
          }}
          onClick={avatarClick}
        >
          <Avatar src={data?.user.image ?? undefined} />
        </IconButton>

        <AccountMenu
          anchorEl={anchorEl}
          open={anchorEl ? true : false}
          handleClose={() => {
            setAnchorEl(null);
          }}
          avatar={<Avatar src={data?.user.image ?? undefined} />}
          userName={data?.user.name}
          authenticated={status === 'authenticated' ? true : false}
          handleLoginOut={handleLoginOut}
        ></AccountMenu>
      </Navbar>

      <ConfirmModal
        open={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={async () => {
          signOut({ callbackUrl: '/' });
        }}
        title="Logout"
      >
        Are you sure to logout?
      </ConfirmModal>
    </>
  );
}
