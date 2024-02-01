import Footer from '@/app/footer';
import { colorTokens } from '@/utils/color-tokens';
import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import Gallery from './gallery';
import TypingText from './typing-text';

export default function HomePage() {
  const color = colorTokens('dark');

  return (
    <div>
      <Container>
        <Box
          sx={{
            paddingBottom: '5vh',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                sx={{
                  color: color.greenAccent[500],
                  marginTop: 3,
                  paddingTop: '5vh',
                  whiteSpace: 'normal',
                }}
              >
                Introducing
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: color.greenAccent[500],
                  marginBottom: 3,
                  width: 'max-content',
                }}
              >
                <TypingText />
              </Typography>
              <Typography fontSize={20}>
                When users need to create charts, they often have to use complex
                software and spend a lot of time and effort. Now there is a
                simpler way to create information charts. This website allows
                users to easily upload data, and the system will automatically
                analyze the data and recommend the most suitable chart. Users
                only need to choose their preferred chart, adjust the
                parameters, and they can easily create beautiful charts. Whether
                it is for business reports, academic research, or personal
                websites, it can meet user's needs. Let's experience this simple
                yet powerful chart-making tool together!
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <div style={{ paddingBottom: '24px' }}>
          <Typography
            variant="h3"
            sx={{
              marginTop: 3,
              marginBottom: 3,
              textAlign: 'center',
            }}
          >
            Chart Library
          </Typography>
          <Gallery />
        </div>
      </Container>
      <Footer />
    </div>
  );
}
