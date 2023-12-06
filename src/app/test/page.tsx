import { prismaReader } from '@/server/db';
import { Container, Typography } from '@mui/material';

const getData = async () => {
  const data = await prismaReader.account.findMany({
    select: { AID: true, MID: true, provider: true, expires_at: true },
    where: {
      provider: 'google',
    },
  });

  return data;
};

async function TestPage() {
  const data = await getData();

  return (
    <Container sx={{ marginTop: 10 }}>
      <Typography>This is test data</Typography>
      {JSON.stringify(data)}
    </Container>
  );
}

export default TestPage;
