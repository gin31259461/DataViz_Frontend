import { env } from '@/env.mjs';
import ManagementDashBoard from '../management-dashboard';
import { DataPanel } from './data-panel';

export default function DataPage() {
  return (
    <ManagementDashBoard>
      <DataPanel flaskServer={env.FLASK_URL}></DataPanel>
    </ManagementDashBoard>
  );
}
