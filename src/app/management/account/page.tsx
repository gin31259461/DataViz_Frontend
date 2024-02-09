import { authOptions } from '@/server/auth/auth';
import { Box, Button, Divider, Typography } from '@mui/material';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import ManagementDashBoard from '../management-dashboard';
import {
  AccountListItem,
  AccountListItemCenter,
  AccountListItemContainer,
  AccountListItemLeft,
  AccountListItemRight,
} from './account-list';

const AccountPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <ManagementDashBoard>
      <Box
        sx={{
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <div>
          <Typography variant="h4">Account information</Typography>
          {[
            ['Nick name', session?.user.name],
            ['User id', session?.user.username],
            ['Email', session?.user.email],
          ].map((tuple) => {
            return (
              <>
                <AccountListItemContainer>
                  <AccountListItemLeft>
                    <Typography variant="subtitle1">{tuple[0]}</Typography>
                  </AccountListItemLeft>
                  <AccountListItemCenter>
                    <Typography variant="subtitle1">{tuple[1]}</Typography>
                  </AccountListItemCenter>
                  <AccountListItemRight></AccountListItemRight>
                </AccountListItemContainer>
                <Divider />
              </>
            );
          })}
          <AccountListItemContainer>
            <AccountListItemLeft>
              <Button sx={{ textTransform: 'none' }} variant="outlined" color="info">
                Change Password
              </Button>
            </AccountListItemLeft>
          </AccountListItemContainer>
          <Divider />
        </div>
        <div>
          <Typography variant="h5">Connect account</Typography>
          {['google', 'discord', 'facebook', 'github', 'wkesso'].map((provider) => {
            return (
              <>
                <AccountListItem
                  startIcon={
                    <Image src={`/assets/icons/${provider}.ico`} height={30} width={30} alt={provider}></Image>
                  }
                  provider={provider}
                ></AccountListItem>
                <Divider />
              </>
            );
          })}
        </div>
      </Box>
    </ManagementDashBoard>
  );
};

export default AccountPage;
