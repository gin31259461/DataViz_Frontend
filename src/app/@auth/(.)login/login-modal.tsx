'use client';

import CloseIcon from '@mui/icons-material/Close';
import { DialogActions, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useRouter } from 'next/navigation';
import Login from '../../login';

const LoginModal = () => {
  const router = useRouter();

  return (
    <Dialog open={true} onClose={() => router.back()} fullScreen>
      <DialogContent>
        <Login />
      </DialogContent>

      <DialogActions>
        <IconButton onClick={() => router.back()}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
