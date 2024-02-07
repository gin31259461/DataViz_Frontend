import { env } from '@/env.mjs';
import ManagementDashBoard from '../management-dashboard';
import { DataContainer } from './data-container';

export default function DataPage() {
  return (
    <ManagementDashBoard>
      <DataContainer flaskServer={env.FLASK_URL}></DataContainer>
    </ManagementDashBoard>
  );
}
