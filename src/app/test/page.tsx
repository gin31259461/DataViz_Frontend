'use client';

import BarGraph, {
  BarGraphDataInstance,
  BarGraphMode,
} from '@/components/chart/bar-graph';
import { Button, Container } from '@mui/material';
import { useState } from 'react';

const data: BarGraphDataInstance[] = [
  { x: 'test1', group: { '1': 10, '2': 20, '3': 30 } },
  { x: 'test2', group: { '1': 90, '2': 80, '3': 70 } },
  { x: 'test3', group: { '1': 40, '2': 50, '3': 60 } },
];

export default function TestPage() {
  const [mode, setMode] = useState<BarGraphMode>('stack');

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 600,
      }}
    >
      <div>
        <BarGraph width={500} height={300} data={data} mode={mode} />
      </div>
      <div>
        <Button
          color="info"
          onClick={() =>
            setMode((prev) => (prev == 'group' ? 'stack' : 'group'))
          }
        >
          {mode}
        </Button>
      </div>
    </Container>
  );
}
