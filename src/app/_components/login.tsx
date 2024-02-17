'use client';

import { Button, useTheme } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const providers = ['Google', 'Discord', 'Facebook', 'Github', 'WKESSO'];

export default function Login() {
  const theme = useTheme();
  const session = useSession();

  const buttonVariant = theme.palette.mode === 'dark' ? 'contained' : 'outlined';

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/management/data' });
  };

  useEffect(() => {
    if (session.status === 'authenticated') {
      redirect('/management/data');
    }
  }, [session.status]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {providers.map((provider, i) => {
        return (
          <Button
            sx={{ minWidth: 300 }}
            variant={buttonVariant}
            color="primary"
            startIcon={
              <Image src={`/assets/icons/${provider.toLowerCase()}.ico`} height={30} width={30} alt={provider} />
            }
            onClick={() => handleSignIn(provider.toLowerCase())}
            key={i}
          >
            {`使用 ${provider} 登入`}
          </Button>
        );
      })}
    </div>
  );
}
