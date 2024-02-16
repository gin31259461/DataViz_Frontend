'use client';

import { GridContainerDivider } from '@/components/grid/grid-container-divider';
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
                <Typography variant="h4">資料內容</Typography>
              </Grid>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1">展示資料的一些基本的資訊</Typography>
              </Grid>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">ID</Typography>
              </Grid>
              <Grid container>
                <Typography variant="body1">{dataInfo.data.info.id}</Typography>
              </Grid>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">大小</Typography>
              </Grid>
              <Grid container>
                <Typography variant="body1">{dataInfo.data.info.rows}</Typography>
              </Grid>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">名稱</Typography>
              </Grid>
              <Grid container>
                <Typography variant="body1">{dataInfo.data.info.name}</Typography>
              </Grid>
              <Grid container>
                <Typography variant="h5">描述</Typography>
              </Grid>
              <Grid container>
                {dataInfo.data.info.des === '' ? (
                  <Typography variant="body1" color={theme.palette.info.main}>
                    沒有描述
                  </Typography>
                ) : (
                  <Typography variant="body1">{dataInfo.data.info.des}</Typography>
                )}
              </Grid>
            </>
          )}

          <GridContainerDivider />

          <Grid container>
            <Typography variant="h4">欄位資訊</Typography>
          </Grid>
          <Grid container>
            <Typography variant="body1" color={theme.palette.info.main}>
              如果這個欄位是時間的字串，系統在分析的時候會自動轉換
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
