'use client';

import BarGraph, {
  BarGraphDataInstance,
  BarGraphMode,
} from '@/components/chart/bar-graph';
import CircleGraph, {
  CircleGraphDataInstance,
  CircleGraphMode,
} from '@/components/chart/circle-graph';
import { Box, Button, Container, styled } from '@mui/material';
import { useState } from 'react';

const data: BarGraphDataInstance[] = [
  { x: 'test1', group: { '1': 10, '2': 20, '3': 30 } },
  { x: 'test2', group: { '1': 90, '2': 80, '3': 70 } },
  { x: 'test3', group: { '1': 40, '2': 50, '3': 60 } },
];

const data2: CircleGraphDataInstance[] = [
  { label: 'test1', value: 10, name: 'test' },
  { label: 'test2', value: 20, name: 'test' },
  { label: 'test3', value: 30, name: 'test' },
];

const StyledBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 600,
});

export default function TestPage() {
  const [barMode, setBarMode] = useState<BarGraphMode>('stack');
  const [circleMode, setCircleMode] = useState<CircleGraphMode>('pie');

  return (
    <Container>
      <StyledBox>
        <div>
          <BarGraph width={500} height={300} data={data} mode={barMode} />
        </div>
        <div>
          <Button
            color="info"
            onClick={() =>
              setBarMode((prev) => (prev == 'group' ? 'stack' : 'group'))
            }
          >
            {barMode}
          </Button>
        </div>
      </StyledBox>
      <StyledBox>
        <div>
          <CircleGraph
            width={500}
            height={500}
            data={data2}
            mode={circleMode}
          />
        </div>
        <div>
          <Button
            color="info"
            onClick={() =>
              setCircleMode((prev) => (prev == 'pie' ? 'donut' : 'pie'))
            }
          >
            {circleMode}
          </Button>
        </div>
      </StyledBox>
    </Container>
  );
}
