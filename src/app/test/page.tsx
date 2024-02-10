'use client';

import { Box, Container, styled } from '@mui/material';

const StyledBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 600,
});

export default function TestPage() {
  return (
    <Container>
      <StyledBox></StyledBox>
    </Container>
  );
}
