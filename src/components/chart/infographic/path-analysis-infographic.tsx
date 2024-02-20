'use client';

import { GridContainer } from '@/components/grid/grid-container';
import { GridContainerDivider } from '@/components/grid/grid-container-divider';
import { PathInstanceScheme, ProcessPivotAnalysisResultInstanceSchema } from '@/server/api/routers/analysis';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { Fragment } from 'react';
import BarGraph from '../bar-graph';
import CircleGraph from '../circle-graph';

interface ProcessAnalysisInfographicProps {
  path: PathInstanceScheme;
  process: ProcessPivotAnalysisResultInstanceSchema[];
}

export const PathAnalysisInfographic = (props: ProcessAnalysisInfographicProps) => {
  const chartHeight = 300;

  const theme = useTheme();

  return (
    <GridContainer gap={2} sx={{ paddingTop: 10, paddingBottom: 10 }}>
      <GridContainer>
        <Typography variant="h4">分析結果</Typography>
      </GridContainer>
      {props.path && (
        <GridContainer gap={2}>
          <GridContainer gap={2}>
            <Typography variant="h6">目標 :</Typography>
            <Typography variant="h6">{props.path.target}</Typography>
          </GridContainer>
          <GridContainer gap={2}>
            <Typography variant="h6">路徑分類 :</Typography>
            <Typography variant="h6" color={theme.palette.warning.main}>
              {props.path.target} ( {props.path.class} )
            </Typography>
          </GridContainer>
          <GridContainer gap={2}>
            <Typography variant="h6">樣本數量</Typography>
            <Typography variant="h6" color={theme.palette.info.main}>
              {props.path.samples[props.path.labels.findIndex((value) => value === props.path.class)]}
            </Typography>
          </GridContainer>

          <GridContainer />

          <GridContainer>
            <Typography variant="h4">特徵分割過程</Typography>
          </GridContainer>

          <GridContainer gap={2}>
            {props.path.process.map((p, i) => {
              return (
                <GridContainer key={`${p[0]}-${i}`} gap={1}>
                  <GridContainer>
                    <Typography color={theme.palette.secondary.main}>
                      {i + 1}. {p[0]} :
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

      {props.process && (
        <GridContainer gap={2}>
          <Typography variant="h4">資訊圖表</Typography>
          {props.process.map((p, i) => {
            return (
              <Fragment key={`${p.split_feature}-${i}`}>
                <GridContainer>
                  <Typography variant="h6" color={theme.palette.secondary.main}>
                    {i + 1}. {p.split_feature}
                  </Typography>
                </GridContainer>
                <GridContainer gap={1}>
                  <Typography variant="body1">關注</Typography>
                  <Typography variant="body1" color={theme.palette.info.main}>
                    <q>{props.path?.process[i][1].join(' ')}</q>
                  </Typography>
                  <Typography variant="body1">(分割前)</Typography>
                </GridContainer>
                <GridContainer spacing={4}>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <GridContainer gap={2}>
                          <GridContainer>
                            <Typography>
                              {p.split_feature} 加總 {props.path?.target}
                            </Typography>
                          </GridContainer>
                          <GridContainer>
                            <BarGraph data={p.chart_data.before_split_count} height={chartHeight}></BarGraph>
                          </GridContainer>
                        </GridContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <GridContainer gap={2}>
                          <GridContainer>
                            <Typography>{p.split_feature} 樣本數比例</Typography>
                          </GridContainer>
                          <GridContainer>
                            <CircleGraph data={p.chart_data.before_split_rate} height={chartHeight}></CircleGraph>
                          </GridContainer>
                        </GridContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </GridContainer>
                <GridContainer gap={1}>
                  <Typography variant="body1">關注</Typography>
                  <Typography variant="body1" color={theme.palette.info.main}>
                    <q>{props.path?.process[i][1].join(' ')}</q>
                  </Typography>
                  <Typography variant="body1">(分割後)</Typography>
                </GridContainer>
                <GridContainer spacing={4}>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <GridContainer gap={2}>
                          <GridContainer>
                            <Typography>
                              {p.split_feature} 加總 {props.path?.target}
                            </Typography>
                          </GridContainer>
                          <GridContainer>
                            <BarGraph data={p.chart_data.after_split_count} height={chartHeight}></BarGraph>
                          </GridContainer>
                        </GridContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <GridContainer gap={2}>
                          <GridContainer>
                            <Typography>{p.split_feature} 樣本數比例</Typography>
                          </GridContainer>
                          <GridContainer>
                            <CircleGraph data={p.chart_data.after_split_rate} height={chartHeight}></CircleGraph>
                          </GridContainer>
                        </GridContainer>
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

        {props.path && (
          <GridContainer>
            <Grid item xs={4}>
              <GridContainer gap={2}>
                {Object.keys(props.path.features).map((feature, i) => {
                  return (
                    <GridContainer key={`${feature}-${i}`}>
                      <GridContainer>
                        <Typography color={theme.palette.secondary.main}>{feature}</Typography>
                      </GridContainer>
                      <GridContainer>
                        <Typography>{props.path.features[feature].join(' ')}</Typography>
                      </GridContainer>
                    </GridContainer>
                  );
                })}
              </GridContainer>
            </Grid>
            <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <GridContainer>
                <ArrowForwardOutlinedIcon sx={{ fontSize: 80 }} />
              </GridContainer>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <GridContainer>
                <Typography variant="h4">
                  <q style={{ color: theme.palette.info.main }}>{props.path.target}</q> 有
                  <span style={{ color: theme.palette.warning.main }}>{props.path.class}</span>的趨勢
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
  );
};
