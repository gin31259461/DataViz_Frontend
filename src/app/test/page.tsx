import { api } from '@/server/trpc/trpc.server';
import { Container } from '@mui/material';

/**
 * @see https://github.com/t3-oss/create-t3-app/pull/1567
 * fix: [TRPCClientError]: Dynamic server usage: Page couldn't be rendered statically because it used `headers`.
 */

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  const data = await api.data.getAllMemberData.query();

  return <Container>{data.length > 0 ? JSON.stringify(data[0]) : ''}</Container>;
}
