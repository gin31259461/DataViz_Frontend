import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface ShowDataModalProps {
  open: boolean;
  onClose: () => void;
  title: string | null | undefined;
  description: string | null | undefined;
  dataInfo: string | null | undefined;
  children: ReactNode;
}

export default function ShowDataDialog({ open, onClose, title, description, dataInfo, children }: ShowDataModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>
        <Typography>{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            paddingTop: 3,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {description}
        </Typography>
        <Typography>{dataInfo}</Typography>
        <Box>{children}</Box>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
