'use client';

import AreaGraph, { AreaGraphDataInstance } from '@/components/chart/area-graph';
import BarGraph, { BarGraphDataInstance } from '@/components/chart/bar-graph';
import CircleGraph, { CircleGraphDataInstance } from '@/components/chart/circle-graph';
import WordCloud from '@/components/chart/word-cloud';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';

const barGraphData: BarGraphDataInstance[] = [
  { x: '台北市', group: { 食: 10, 衣: 20, 住: 30 } },
  { x: '台中市', group: { 食: 90, 衣: 80, 住: 70 } },
  { x: '新北市', group: { 食: 40, 衣: 50, 住: 60 } },
];

const circleGraphData: CircleGraphDataInstance[] = [
  { label: '台北市', value: 60 },
  { label: '台中市', value: 240 },
  { label: '新北市', value: 150 },
];

const areaGraphData: AreaGraphDataInstance[] = [
  { date: '2023/1/1', value: 10 },
  { date: '2023/1/2', value: 20 },
  { date: '2023/1/3', value: 30 },
  { date: '2023/1/4', value: 60 },
  { date: '2023/1/5', value: 20 },
  { date: '2023/1/6', value: 30 },
  { date: '2023/1/7', value: 40 },
  { date: '2023/1/8', value: 20 },
  { date: '2023/1/9', value: 100 },
  { date: '2023/1/10', value: 50 },
  { date: '2023/1/11', value: 20 },
  { date: '2023/1/12', value: 30 },
];

const wordData =
  'WKE Web Knowledge Extraction Lab. WKE focuses on developing Web information systems (WIS) for various domain requirements. By integrating systems and modules about web/text mining methods developed in WKE, WIS can be enhanced to advanced intelligent information systems';

type GalleryCardProps = {
  title: string;
  childrenMinHeight?: number;
  refObject?: RefObject<HTMLDivElement>;
  children: ReactNode;
};

export const Gallery = () => {
  const height = 300;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cardRef.current) {
      const element = cardRef.current as HTMLDivElement;
      setWidth(element.offsetWidth);
      setLoading(false);

      window.addEventListener('resize', () => {
        const element = cardRef.current as HTMLDivElement;
        setWidth(element.offsetWidth);
      });
    }
  }, []);

  const GalleryCard = ({ title, children, childrenMinHeight, refObject }: GalleryCardProps) => {
    return (
      <Grid component={'div'} item xs={12} sm={6} md={4}>
        <Card>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ height: 5 }}>
                {title}
              </Typography>
            </CardContent>
            <CardMedia component="div" ref={refObject} sx={{ minHeight: childrenMinHeight, margin: 2 }}>
              {loading ? <Skeleton variant="rounded" height={childrenMinHeight} /> : children}
            </CardMedia>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2} mt={2}>
      <GalleryCard refObject={cardRef} title="Bar group" childrenMinHeight={height}>
        <BarGraph width={width} height={height} data={barGraphData} mode="group" />
      </GalleryCard>
      <GalleryCard title="Bar group horizontal" childrenMinHeight={height}>
        <BarGraph
          width={width}
          height={height}
          data={barGraphData}
          mode="group"
          axisLeft
          axisBottom={false}
          margin={{ left: 55, right: 55 }}
          horizontal
        />
      </GalleryCard>
      <GalleryCard title="Bar stack" childrenMinHeight={height}>
        <BarGraph width={width} height={height} data={barGraphData} mode="stack" />
      </GalleryCard>
      <GalleryCard title="Bar stack horizontal" childrenMinHeight={height}>
        <BarGraph
          width={width}
          height={height}
          data={barGraphData}
          mode="stack"
          axisLeft
          axisBottom={false}
          margin={{ left: 55, right: 55 }}
          horizontal
        />
      </GalleryCard>
      <GalleryCard title="Pie chart" childrenMinHeight={height}>
        <CircleGraph width={width} height={height} data={circleGraphData} mode="pie" />
      </GalleryCard>
      <GalleryCard title="Donut chart" childrenMinHeight={height}>
        <CircleGraph width={width} height={height} data={circleGraphData} mode="donut" />
      </GalleryCard>
      <GalleryCard title="Line graph" childrenMinHeight={height}>
        <AreaGraph width={width} height={height} data={areaGraphData} mode="line" />
      </GalleryCard>
      <GalleryCard title="Area graph" childrenMinHeight={height}>
        <AreaGraph width={width} height={height} data={areaGraphData} mode="area" />
      </GalleryCard>
      <GalleryCard title="Word cloud" childrenMinHeight={height}>
        <WordCloud width={width} height={height} data={wordData} />
      </GalleryCard>
    </Grid>
  );
};
