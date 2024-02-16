'use client';

import BarGraph from '@/components/chart/bar-graph';
import CircleGraph from '@/components/chart/circle-graph';
import { GridContainer } from '@/components/grid/grid-container';
import { GridContainerDivider } from '@/components/grid/grid-container-divider';
import LoadingWithTitle from '@/components/loading/loading-with-title';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import { Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';

function ProcessAnalysis() {
  const tabSliderContentHeight = 300;

  const theme = useTheme();

  const selectedDataId = useProjectStore((state) => state.selectedDataId);
  const target = useProjectStore((state) => state.target);
  const selectedPath = useProjectStore((state) => state.selectedPath);

  const [tabSliderContentWidth, setTabSliderContentWidth] = useState(400);
  const sliderContentRef = useRef<HTMLDivElement | null>(null);

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
    function resizeEvent() {
      const element = sliderContentRef.current as HTMLDivElement;
      if (element && 'offsetWidth' in element) {
        setTabSliderContentWidth(element.offsetWidth);
      }
    }

    if (sliderContentRef.current) {
      const element = sliderContentRef.current as HTMLDivElement;
      setTabSliderContentWidth(element.offsetWidth);
    }

    window.addEventListener('resize', resizeEvent);
  }, []);

  return (
    <>
      {process.isLoading ? (
        <LoadingWithTitle>正在進行路徑樞紐分析...</LoadingWithTitle>
      ) : (
        <GridContainer gap={2}>
          <GridContainer>
            <Typography variant="h4">路徑回朔樞紐分析結果</Typography>
          </GridContainer>
          <GridContainer>
            <Typography variant="h5">您選擇的路徑資訊</Typography>
          </GridContainer>
          {selectedPath && (
            <GridContainer gap={1}>
              <GridContainer gap={2}>
                <Typography variant="h6">目標 :</Typography>
                <Typography variant="h6">{selectedPath.target}</Typography>
              </GridContainer>
              <GridContainer gap={2}>
                <Typography variant="h6">路徑分類 :</Typography>
                <Typography variant="h6">{selectedPath.class}</Typography>
              </GridContainer>
              <GridContainer gap={2}>
                <Typography variant="h6">樣本數量</Typography>
                <Typography variant="h6" color={theme.palette.info.main}>
                  {selectedPath.samples[selectedPath.labels.findIndex((value) => value === selectedPath.class)]}
                </Typography>
              </GridContainer>
            </GridContainer>
          )}

          <GridContainerDivider />

          {process.data && (
            <GridContainer gap={2}>
              {process.data.map((p, i) => {
                return (
                  <Fragment key={`${p.split_feature}-${i}`}>
                    <GridContainer>
                      <Typography variant="h6">{p.split_feature}</Typography>
                    </GridContainer>
                    <GridContainer>
                      <Typography variant="body1" color={theme.palette.info.main}>
                        根據樣本數量平均計算
                      </Typography>
                    </GridContainer>
                    <GridContainer spacing={4}>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <div style={{ width: '100%' }} ref={sliderContentRef}>
                              <BarGraph
                                data={p.chart_data.before_split_count}
                                width={tabSliderContentWidth}
                                height={tabSliderContentHeight}
                              ></BarGraph>
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <BarGraph
                              data={p.chart_data.after_split_count}
                              width={tabSliderContentWidth}
                              height={tabSliderContentHeight}
                            ></BarGraph>
                          </CardContent>
                        </Card>
                      </Grid>
                    </GridContainer>
                    <GridContainer>
                      <Typography variant="body1" color={theme.palette.info.main}>
                        根據樣本數量平均計算
                      </Typography>
                    </GridContainer>
                    <GridContainer spacing={4}>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <CircleGraph
                              data={p.chart_data.before_split_rate}
                              width={tabSliderContentWidth}
                              height={tabSliderContentHeight}
                            ></CircleGraph>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <CircleGraph
                              data={p.chart_data.before_split_rate}
                              width={tabSliderContentWidth}
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
