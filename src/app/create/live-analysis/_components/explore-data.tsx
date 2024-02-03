'use client';

import LinearProgressPending from '@/components/loading/linear-progress-pending';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { Container } from '@mui/material';
import { useEffect, useState, useTransition } from 'react';

interface ExploreDataProps {
  getDataInfo: (dataId: string) => Promise<void>;
}

function ExploreData(props: ExploreDataProps) {
  const [dataInfo, setDataInfo] = useState<any>(null);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const [isPending, startFetchDataInfo] = useTransition();
  const getDataInfo = props.getDataInfo;

  useEffect(() => {
    if (selectedDataOID) {
      startFetchDataInfo(async () => {
        const dataInfo = await getDataInfo(selectedDataOID.toString());
        setDataInfo(dataInfo);
      });
    }
  }, [selectedDataOID, getDataInfo]);

  return (
    <Container>
      <LinearProgressPending isPending={isPending} />
    </Container>
  );
}

export default ExploreData;
