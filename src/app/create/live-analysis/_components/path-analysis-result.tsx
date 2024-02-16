import { GridContainerDivider } from '@/components/divider/grid-container-divider';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { useSplitLineStyle } from '@/hooks/use-styles';
import { Card, CardActionArea, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

export default function PathAnalysisResult() {
  const recommendThreshold = 2;

  const border = useSplitLineStyle();
  const theme = useTheme();

  const paths = useProjectStore((state) => state.paths);
  const target = useProjectStore((state) => state.target);
  const setSelectedPath = useProjectStore((state) => state.setSelectedPath);

  const [activePathKey, setActivePathKey] = useState('');

  return (
    <>
      {paths && (
        <Grid container gap={2}>
          <Grid container>
            <Typography variant="h4">分析結果</Typography>
          </Grid>
          <Grid container>
            <Typography color={theme.palette.info.main}>請選擇其中一個特徵做下一步的回朔分析</Typography>
          </Grid>
          <Grid container>
            <Typography variant="body1">
              依照目標為
              <q>
                <strong>{target}</strong>
              </q>
              ，路徑分類為{' '}
              {Object.keys(paths).map((path, i) => {
                return <strong key={`${path}-${i}`}>{path} </strong>;
              })}
              三種，其中您可能有興趣的路徑...
            </Typography>
          </Grid>
          <Grid container gap={2}>
            {Object.keys(paths).map((path, i) => {
              return (
                <Grid container key={`${path}-${i}`} gap={1}>
                  <Typography color={theme.palette.warning.main} variant="h5">
                    {path}
                  </Typography>
                  <Grid container spacing={2}>
                    {paths[path].slice(0, recommendThreshold).map((data, j) => {
                      const key = `${path}-${i}-${data.class}-${data.samples.reduce((sum, v) => sum + v)}-${j}`;
                      return (
                        <Grid item xs={6} key={key}>
                          <Card
                            sx={{ border: key === activePathKey ? `2px solid ${theme.palette.warning.main}` : border }}
                          >
                            <CardActionArea
                              onClick={() => {
                                setSelectedPath(paths[path][j]);
                                setActivePathKey(key);
                              }}
                            >
                              <CardContent sx={{ minWidth: 300 }}>
                                <Grid container gap={2}>
                                  <Grid container>
                                    <Typography variant="h6">特徵 {j + 1}</Typography>
                                  </Grid>
                                  {Object.keys(data.features).map((feature) => {
                                    return (
                                      <Grid container key={`${path}-${i}-${feature}`} gap={1}>
                                        <Typography>{feature} :</Typography>
                                        <Typography>{data.features[feature].join(', ')}</Typography>
                                      </Grid>
                                    );
                                  })}
                                  <GridContainerDivider />
                                  <Grid container gap={2}>
                                    <Typography variant="h6">目標分類樣本數</Typography>
                                    <Typography color={theme.palette.info.main} variant="h6">
                                      {data.samples[data.labels.findIndex((label) => label === data.class)]}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}
    </>
  );
}
