'use client';

import RacingBarChartEngine, {
  convertToRacingBarChartData,
  RacingBarChartArgs,
  RacingBarChartMapping,
} from '@/components/ChartEngine/RacingBarChartEngine';
import { DataArgsProps } from '@/hooks/store/useProjectStore';
import { ArgSchema } from '@/server/api/routers/project';
import { trpc } from '@/server/trpc';
import { Container } from '@mui/material';
import { useParams } from 'next/navigation';

//! this is a test page for open project
function ProjectPage() {
  const projectId = parseInt(useParams().id as string);
  const observations = trpc.project.getProjectObservations.useQuery(projectId);
  const argObjects = trpc.project.getArgFromObservation.useQuery(
    observations.data && observations.data[0].CID,
  );
  const CDes = argObjects.data && argObjects.data[0].CDes;

  console.log('observations', observations.data);
  console.log('args', argObjects.data);

  const args: ArgSchema = JSON.parse(CDes ?? '{}');

  const dataTable = trpc.dataObject.getAllFromDataTable.useQuery(args.dataId);

  return (
    <Container sx={{ paddingTop: 10 }}>
      {dataTable.data && args.dataArgs && args.chartArgs && (
        <RacingBarChartEngine
          data={convertToRacingBarChartData(
            dataTable.data,
            args.dataArgs as DataArgsProps<RacingBarChartMapping>,
          )}
          args={args.chartArgs as RacingBarChartArgs}
        />
      )}
    </Container>
  );
}

export default ProjectPage;
