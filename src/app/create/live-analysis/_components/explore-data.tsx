'use client';

import LoadingWithTitle from '@/components/loading/loading-with-title';
import AutoCompleteSelect from '@/components/select/auto-complete-select';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import { Divider, Grid, styled, Typography, useTheme } from '@mui/material';

function ExploreData() {
  const theme = useTheme();

  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const setTarget = useProjectStore((state) => state.setTarget);
  const dataInfo = api.analysis.getDataInfo.useQuery(selectedDataOID);

  console.log(dataInfo.data);

  return (
    <>
      {dataInfo.isLoading ? (
        <LoadingWithTitle>分析欄位資訊中...</LoadingWithTitle>
      ) : (
        <Grid container gap={3}>
          {dataInfo.data && (
            <>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item xs={6}>
                  <Typography variant="h4">Id</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5">{dataInfo.data.info.id}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item xs={6}>
                  <Typography variant="h4">Size (rows)</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5">{dataInfo.data.info.rows}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item xs={6}>
                  <Typography variant="h4">Name</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5">{dataInfo.data.info.name}</Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Typography variant="h4">Description</Typography>
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

          <Grid container>
            <CustomDivider></CustomDivider>
          </Grid>

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

          <Grid container>
            <CustomDivider>For next step</CustomDivider>
          </Grid>

          <Grid container>
            <Typography variant="h4">Path analysis configuration</Typography>
          </Grid>

          <Grid container>
            <Typography variant="h5">Target</Typography>
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              <AutoCompleteSelect
                loading={false}
                options={
                  dataInfo.data
                    ? Object.keys(dataInfo.data.columns).filter((col) => {
                        const info = dataInfo.data.columns[col];
                        return info.type === 'number' || info.type === 'float';
                      })
                    : []
                }
                onChange={(value) => {
                  setTarget(value);
                }}
              >
                選擇分析目標 (數值型欄位)
              </AutoCompleteSelect>
            </Grid>
          </Grid>

          <Grid container>
            <Typography variant="h5">Concept hierarchy</Typography>G
          </Grid>

          <Grid container>
            <Typography variant="h4" color={theme.palette.info.main}>
              到底了!
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
}

const CustomDivider = styled(Divider)({
  textAlign: 'center',
  width: '100%',
});

export default ExploreData;
