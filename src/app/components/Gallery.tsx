import { Grid } from '@mui/material';
import GalleryCard from './GalleryCard';
import imagePath from './imagePath.json';

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
