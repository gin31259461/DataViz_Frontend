'use client';

import BarGraph from '@/components/chart/bar-graph';
import CircleGraph from '@/components/chart/circle-graph';
import { GridContainer } from '@/components/grid/grid-container';
import { GridContainerDivider } from '@/components/grid/grid-container-divider';
import LoadingWithTitle from '@/components/loading/loading-with-title';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import { Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { Fragment } from 'react';

function ProcessAnalysis() {
  const tabSliderContentHeight = 300;

  const theme = useTheme();

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

  const process = api.analysis.getProcessPivotAnalysis.useQuery(reqData);

  return (
    <>
      {process.isLoading ? (
        <LoadingWithTitle>正在進行路徑樞紐分析...</LoadingWithTitle>
      ) : (
        <GridContainer gap={2}>
          <GridContainer>
            <Typography variant="h4">路徑回朔樞紐分析結果</Typography>
          </GridContainer>
          {selectedPath && (
            <GridContainer gap={2}>
              <GridContainer gap={2}>
                <Typography variant="h6">目標 :</Typography>
                <Typography variant="h6">{selectedPath.target}</Typography>
              </GridContainer>
              <GridContainer gap={2}>
                <Typography variant="h6">路徑分類 :</Typography>
                <Typography variant="h6" color={theme.palette.warning.main}>
                  {selectedPath.target} ( {selectedPath.class} )
                </Typography>
              </GridContainer>
              <GridContainer gap={2}>
                <Typography variant="h6">樣本數量</Typography>
                <Typography variant="h6" color={theme.palette.info.main}>
                  {selectedPath.samples[selectedPath.labels.findIndex((value) => value === selectedPath.class)]}
                </Typography>
              </GridContainer>

              <GridContainerDivider />

              <GridContainer>
                <Typography variant="h4">特徵分割過程</Typography>
              </GridContainer>

              <GridContainer gap={1}>
                {selectedPath.process.map((p, i) => {
                  return (
                    <GridContainer key={`${p[0]}-${i}`} gap={1}>
                      <GridContainer>
                        <Typography color={theme.palette.secondary.main}>
                          <strong>
                            {i + 1}. {p[0]} :
                          </strong>
                        </Typography>
                      </GridContainer>
                      <GridContainer>
                        <Typography>{p[1].join(' ')}</Typography>
                      </GridContainer>
                    </GridContainer>
                  );
                })}
              </GridContainer>
            </GridContainer>
          )}

          <GridContainerDivider />

          {process.data && (
            <GridContainer gap={2}>
              <Typography variant="h4">資訊圖表</Typography>
              {process.data.map((p, i) => {
                return (
                  <Fragment key={`${p.split_feature}-${i}`}>
                    <GridContainer>
                      <Typography variant="h6">
                        {i + 1}. {p.split_feature}
                      </Typography>
                    </GridContainer>
                    <GridContainer gap={1}>
                      <Typography variant="body1">關注</Typography>
                      <Typography variant="body1" color={theme.palette.info.main}>
                        <q>{selectedPath?.process[i][1].join(' ')}</q>
                      </Typography>
                      <Typography variant="body1">(分割前)</Typography>
                    </GridContainer>
                    <GridContainer spacing={4}>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <BarGraph data={p.chart_data.before_split_count} height={tabSliderContentHeight}></BarGraph>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <CircleGraph
                              data={p.chart_data.before_split_rate}
                              height={tabSliderContentHeight}
                            ></CircleGraph>
                          </CardContent>
                        </Card>
                      </Grid>
                    </GridContainer>
                    <GridContainer gap={1}>
                      <Typography variant="body1">關注</Typography>
                      <Typography variant="body1" color={theme.palette.info.main}>
                        <q>{selectedPath?.process[i][1].join(' ')}</q>
                      </Typography>
                      <Typography variant="body1">(分割後)</Typography>
                    </GridContainer>
                    <GridContainer spacing={4}>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <BarGraph data={p.chart_data.after_split_count} height={tabSliderContentHeight}></BarGraph>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <CircleGraph
                              data={p.chart_data.after_split_rate}
                              height={tabSliderContentHeight}
                            ></CircleGraph>
                          </CardContent>
                        </Card>
                      </Grid>
                    </GridContainer>
                  </Fragment>
                );
              })}
            </GridContainer>
          )}

          <GridContainerDivider />

          <GridContainer gap={2}>
            <GridContainer>
              <Typography variant="h4">最終特徵</Typography>
            </GridContainer>

            {selectedPath && (
              <GridContainer>
                <Grid item xs={4}>
                  <GridContainer gap={2}>
                    {Object.keys(selectedPath.features).map((feature, i) => {
                      return (
                        <GridContainer key={`${feature}-${i}`}>
                          <GridContainer>
                            <Typography color={theme.palette.secondary.main}>
                              <strong>{feature}</strong>
                            </Typography>
                          </GridContainer>
                          <GridContainer>
                            <Typography>{selectedPath.features[feature].join(' ')}</Typography>
                          </GridContainer>
                        </GridContainer>
                      );
                    })}
                  </GridContainer>
                </Grid>
                <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                  <GridContainer>
                    <Typography variant="h4">
                      目標 <q>{selectedPath.target}</q> 有 {selectedPath.class} 的趨勢
                    </Typography>
                  </GridContainer>
                </Grid>
              </GridContainer>
            )}
          </GridContainer>

          <GridContainerDivider />

          <GridContainer justifyContent={'center'}>
            <Typography variant="h5" color={theme.palette.info.main}>
              到底了!
            </Typography>
          </GridContainer>
        </GridContainer>
      )}
    </>
  );
}

export default ProcessAnalysis;
