'use client';

import { AreaGraphMode } from '@/components/chart/area-graph';
import WordCloud from '@/components/chart/word-cloud';
import { Box, Container, styled } from '@mui/material';
import { useState } from 'react';

const data = 'this is a test data';

const StyledBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 600,
});

export default function TestPage() {
  const [mode, setMode] = useState<AreaGraphMode>('area');

  return (
    <Container>
      <StyledBox>
        <div>
          <WordCloud width={500} height={300} data={data} />
        </div>
      </StyledBox>
    </Container>
  );
}
