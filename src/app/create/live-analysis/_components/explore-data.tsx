'use client';

import LoadingWithTitle from '@/components/loading/loading-with-title';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/client';
import { Grid } from '@mui/material';

function ExploreData() {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const dataInfo = api.analysis.getDataInfo.useQuery(selectedDataOID);

  console.log(dataInfo.data);

  return (
    <>
      <LoadingWithTitle title="分析欄位資訊中..." />
      <Grid container>
        {dataInfo.data &&
          Object.keys(dataInfo.data.columns).map((col, i) => {
            return (
              <Grid key={i} container>
                <Grid>{col}</Grid>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}

export default ExploreData;
