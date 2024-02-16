'use client';

import LoadingWithTitle from '@/components/loading/loading-with-title';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import { Grid } from '@mui/material';

function ProcessAnalysis() {
  const selectedDataId = useProjectStore((state) => state.selectedDataId);
  const target = useProjectStore((state) => state.target);
  const selectedPath = useProjectStore((state) => state.selectedPath);

  const reqData =
    selectedDataId && target && selectedPath
      ? {
          dataId: selectedDataId,
          target,
          process: selectedPath.process,
        }
      : undefined;

  console.log(reqData);

  const process = api.analysis.getProcessPivotAnalysis.useQuery(reqData);

  console.log(process.data);

  return <>{process.isLoading ? <LoadingWithTitle>正在進行路徑樞紐分析...</LoadingWithTitle> : <Grid></Grid>}</>;
}

export default ProcessAnalysis;
