'use client';

import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Box, Typography } from '@mui/material';

const Complete = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: 'calc(100vh - 60px - 80px - 60px)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h4">All completed</Typography>
      <DoneAllIcon color="info" sx={{ fontSize: 50 }} />
    </Box>
  );
};

export default Complete;
