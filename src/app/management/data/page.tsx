import Dashboard from '@/components/dashboard';
import { env } from '@/env.mjs';
import { DataPanel } from './data-panel';

export default function DataPage() {
  return (
    <Dashboard>
      <DataPanel flaskServer={env.FLASK_URL}></DataPanel>
    </Dashboard>
  );
}
