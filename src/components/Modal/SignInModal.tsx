'use client';

import CloseIcon from '@mui/icons-material/Close';
import { DialogActions, IconButton, styled, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const buttonVariant = theme.palette.mode === 'dark' ? 'contained' : 'outlined';

  const handleClose = () => {
    onClose();
  };

  const handleSignIn = (provider: string, action: () => void = () => {}) => {
    signIn(provider);
    action();
    handleClose();
  };

  const LoginButton = styled(Button)({
    height: 50,
    width: 250,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  });

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {['Google', 'Discord', 'Facebook', 'Github', 'WKESSO'].map((provider, i) => {
          return (
            <LoginButton
              variant={buttonVariant}
              color="primary"
              startIcon={
                <Image
                  src={`/assets/icons/${provider.toLowerCase()}.ico`}
                  height={30}
                  width={30}
                  alt={provider}
                ></Image>
              }
              onClick={() => handleSignIn(provider.toLowerCase())}
              key={i}
            >
              <div>Sign in with {provider}</div>
            </LoginButton>
          );
        })}
      </DialogContent>

      <DialogActions>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default SignInModal;
