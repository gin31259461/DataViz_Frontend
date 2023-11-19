import Footer from '@/components/Footer';
import { Container, Typography } from '@mui/material';
import { lazy } from 'react';
import HomeIntro from './components/HomeIntro';

const Gallery = lazy(() => import('@/app/components/Gallery'));

export default function Home() {
  return (
    <div>
      <Container>
        <HomeIntro />
        <div style={{ paddingBottom: '24px' }}>
          <Typography variant="h3" sx={{ marginTop: 3, marginBottom: 3, textAlign: 'center' }}>
            Chart Library
          </Typography>
          <Gallery />
        </div>
      </Container>
      <Footer />
    </div>
  );
}
