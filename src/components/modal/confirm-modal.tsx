import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState, useTransition } from 'react';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
  children: React.ReactNode;
};

export const ConfirmModal = ({ onConfirm, onCancel, open, title, children, onClose }: ConfirmModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose();
  };
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    handleClose();
    setLoading(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button sx={{ color: 'inherit' }} onClick={handleCancel}>
          Cancel
        </Button>
        <Button sx={{ color: 'inherit' }} onClick={handleConfirm}>
          {loading ? <CircularProgress color="info" size={20} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
