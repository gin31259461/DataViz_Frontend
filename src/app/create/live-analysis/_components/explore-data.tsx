'use client';

import { GridContainerDivider } from '@/components/divider/grid-container-divider';
import LoadingWithTitle from '@/components/loading/loading-with-title';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import { Grid, Typography, useTheme } from '@mui/material';
import { useContext, useEffect } from 'react';
import { StepperContext } from '../../_components/stepper';

export default function ExploreData() {
  const theme = useTheme();

  const stepperContext = useContext(StepperContext);

  const selectedDataId = useProjectStore((state) => state.selectedDataId);
  const setDataInfo = useProjectStore((state) => state.setDataInfo);

  const dataInfo = api.analysis.getDataInfo.useQuery(selectedDataId);

  useEffect(() => {
    if (dataInfo.data) setDataInfo(dataInfo.data);
  }, [dataInfo.data, setDataInfo]);

  useEffect(() => {
    stepperContext.setIsLoading(dataInfo.isLoading);
  }, [dataInfo.isLoading, stepperContext]);

  return (
    <>
      {dataInfo.isLoading ? (
        <LoadingWithTitle>分析欄位資訊中...</LoadingWithTitle>
      ) : (
        <Grid container gap={3}>
          {dataInfo.data && (
            <>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4">Data information</Typography>
              </Grid>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">Id</Typography>
              </Grid>
              <Grid container>
                <Typography variant="body1">{dataInfo.data.info.id}</Typography>
              </Grid>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">Size (rows)</Typography>
              </Grid>
              <Grid container>
                <Typography variant="body1">{dataInfo.data.info.rows}</Typography>
              </Grid>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">Name</Typography>
              </Grid>
              <Grid container>
                <Typography variant="body1">{dataInfo.data.info.name}</Typography>
              </Grid>
              <Grid container>
                <Typography variant="h5">Description</Typography>
              </Grid>
              <Grid container>
                {dataInfo.data.info.des === '' ? (
                  <Typography variant="body1" color={theme.palette.info.main}>
                    Description is empty
                  </Typography>
                ) : (
                  <Typography variant="body1">{dataInfo.data.info.des}</Typography>
                )}
              </Grid>
            </>
          )}

          <GridContainerDivider />

          <Grid container>
            <Typography variant="h4">Columns</Typography>
          </Grid>
          <Grid container>
            <Typography variant="body1" color={theme.palette.info.main}>
              If there has datetime format string, system will parse it automatically
            </Typography>
          </Grid>
          {dataInfo.data &&
            Object.keys(dataInfo.data.columns).map((col, i) => {
              const info = dataInfo.data.columns[col];
              return (
                <Grid key={i} container>
                  <Grid item xs={6}>
                    <Typography>{col}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color={theme.palette.secondary.main}>{info.type}</Typography>
                  </Grid>
                </Grid>
              );
            })}

          <GridContainerDivider />

          <Grid container justifyContent={'center'}>
            <Typography variant="h5" color={theme.palette.info.main}>
              到底了!
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
}
