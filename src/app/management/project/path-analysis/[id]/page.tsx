import { PathAnalysisInfographic } from '@/components/chart/infographic/path-analysis-infographic';
import { PathAnalysisDataArgs } from '@/server/api/routers/analysis';
import { ArgSchema } from '@/server/api/routers/project';
import { api } from '@/server/trpc/trpc.server';
import { Container } from '@mui/material';

export default async function PathAnalysisPage({ params }: { params: { id: string } }) {
  const currentIndex = 0;
  const observations = await api.project.getProjectObservations.query(parseInt(params.id));
  const args = await api.project.getArgsFromObservations.query(observations && observations.map((d) => d.CID));
  const arg: ArgSchema<PathAnalysisDataArgs, object[]> = JSON.parse((args && args[currentIndex].CDes) ?? '{}');

  return (
    <Container>
      <PathAnalysisInfographic path={arg.dataArgs.path} process={arg.dataArgs.process} />
    </Container>
  );
}
