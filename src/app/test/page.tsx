import { api } from '@/server/trpc/trpc.server';
import { Container } from '@mui/material';

export default async function TestPage() {
  const data = await api.data.getAllMemberData.query();

  return <Container>{data.length > 0 ? JSON.stringify(data[0]) : ''}</Container>;
}
