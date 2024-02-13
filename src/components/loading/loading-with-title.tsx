import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

interface LoadingWithTitleProps {
  children: React.ReactNode;
}

const LoadingWithTitle: React.FC<LoadingWithTitleProps> = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h6">{children}</Typography>
      <CircularProgress color="info" />
    </Box>
  );
};

export default LoadingWithTitle;
