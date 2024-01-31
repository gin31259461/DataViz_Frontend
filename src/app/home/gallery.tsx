'use client';

import { useSplitLineStyle } from '@/hooks/use-styles';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import imagePath from './image-path.json';

interface GalleryCardProps {
  title: string;
  src: string;
  href: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ title, src, href }) => {
  return (
    <Card
      sx={{
        border: useSplitLineStyle(),
      }}
    >
      <CardActionArea href={href}>
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
          component="img"
          height="340"
          image={src}
          alt={title}
          sx={{ padding: 2 }}
        />
      </CardActionArea>
    </Card>
  );
};

export default function Gallery() {
  return (
    <Grid container spacing={2} mt={2}>
      {imagePath.map((o, i) => {
        return (
          <Grid key={i} item xs={12} sm={6} md={4}>
            <GalleryCard
              key={i}
              title={o.title}
              src={o.light_src}
              href={o.href}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
