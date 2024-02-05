'use client';

import BarGraph, { BarGraphDataInstance } from '@/components/chart/bar-graph';
import CircleGraph, {
  CircleGraphDataInstance,
} from '@/components/chart/circle-graph';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { RefObject, useEffect, useRef, useState } from 'react';

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

type GalleryCardProps = {
  title: string;
  childrenMinHeight?: number;
  refObject?: RefObject<HTMLDivElement>;
  children: React.ReactNode;
};

const GalleryCard = ({
  title,
  children,
  childrenMinHeight,
  refObject,
}: GalleryCardProps) => {
  return (
    <Grid component={'div'} item xs={12} sm={6} md={4}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ height: 5 }}
            >
              {title}
            </Typography>
          </CardContent>
          <CardMedia
            component="div"
            ref={refObject}
            sx={{ minHeight: childrenMinHeight, margin: 2 }}
          >
            {children}
          </CardMedia>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export const Gallery = () => {
  const height = 300;
  const cardRef = useRef(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (cardRef.current) {
      const element = cardRef.current as HTMLDivElement;
      setWidth(element.offsetWidth);
    }
  }, [cardRef]);

  return (
    <Grid container spacing={2} mt={2}>
      <GalleryCard
        refObject={cardRef}
        title="Bar group"
        childrenMinHeight={height}
      >
        <BarGraph
          width={width}
          height={height}
          data={barGraphData}
          mode="group"
        />
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
        <BarGraph
          width={width}
          height={height}
          data={barGraphData}
          mode="stack"
        />
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
        <CircleGraph
          width={width}
          height={height}
          data={circleGraphData}
          mode="pie"
        />
      </GalleryCard>
      <GalleryCard title="Donut chart" childrenMinHeight={height}>
        <CircleGraph
          width={width}
          height={height}
          data={circleGraphData}
          mode="donut"
        />
      </GalleryCard>
    </Grid>
  );
};
