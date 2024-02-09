'use client';

import LinearProgressPending from '@/components/loading/linear-progress-pending';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { Container } from '@mui/material';
import { useEffect, useState, useTransition } from 'react';

function ExploreData() {
  // const [dataInfo, setDataInfo] = useState<any>(null);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const [isPending, startFetchDataInfo] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedDataOID) {
      startFetchDataInfo(async () => {
        // const dataInfo = await getDataInfo(selectedDataOID.toString());
        setIsLoading(false);
        // setDataInfo(dataInfo);
      });
    }
  }, [selectedDataOID]);

  return (
    <Container>
      <LinearProgressPending isPending={isPending || isLoading} />
    </Container>
  );
}

export default ExploreData;
