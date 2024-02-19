'use client';

import { PathAnalysisInfographic } from '@/components/chart/infographic/path-analysis-infographic';
import LoadingWithTitle from '@/components/loading/loading-with-title';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import { useEffect } from 'react';

function ProcessAnalysis() {
  const selectedDataId = useProjectStore((state) => state.selectedDataId);
  const target = useProjectStore((state) => state.target);
  const selectedPath = useProjectStore((state) => state.selectedPath);
  const setProcess = useProjectStore((state) => state.setProcess);

  const reqData =
    selectedDataId && target && selectedPath
      ? {
          dataId: selectedDataId,
          target,
          process: selectedPath.process,
        }
      : undefined;

  const process = api.analysis.getProcessPivotAnalysis.useQuery(reqData);

  useEffect(() => {
    if (process.data) {
      setProcess(process.data);
    }
  }, [process.data, setProcess]);

  return (
    <>
      {process.isLoading ? (
        <LoadingWithTitle>正在進行路徑樞紐分析...</LoadingWithTitle>
      ) : (
        process.data && selectedPath && <PathAnalysisInfographic path={selectedPath} process={process.data} />
      )}
    </>
  );
}

export default ProcessAnalysis;
