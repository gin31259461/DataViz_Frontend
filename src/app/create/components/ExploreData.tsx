'use client';

import { useProjectStore } from '@/hooks/store/useProjectStore';
import { useEffect, useState } from 'react';

interface ExploreDataProps {
  getDataInfo: (dataId: string) => Promise<void>;
}

function ExploreData(props: ExploreDataProps) {
  const [dataInfo, setDataInfo] = useState<any>(null);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);

  console.log(dataInfo);

  useEffect(() => {
    const getDataInfo = async (dataId: string) => {
      const dataInfo = await props.getDataInfo(dataId);
      setDataInfo(dataInfo);
    };
    if (selectedDataOID) {
      getDataInfo(selectedDataOID.toString());
    }
  }, [selectedDataOID, props]);

  return <div>ExploreData</div>;
}

export default ExploreData;
