import Dashboard from '@/components/Dashboard';
import { env } from '@/env.mjs';
import { Container } from '@mui/material';
import { DataPanel } from './DataPanel';

export default function DataPage() {
  return (
    <Dashboard>
      <Container>
        <DataPanel flaskServer={env.FLASK_URL}></DataPanel>
      </Container>
    </Dashboard>
  );
}
