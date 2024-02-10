'use client';

import LinearProgressPending from '@/components/loading/linear-progress-pending';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { trpc } from '@/server/trpc';

function ExploreData() {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const dataInfo = trpc.analysis.getDataInfo.useQuery(selectedDataOID);

  console.log(dataInfo.data);

  return (
    <>
      <LinearProgressPending isPending={dataInfo.isLoading} />
    </>
  );
}

export default ExploreData;
