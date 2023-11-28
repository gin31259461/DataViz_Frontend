import Dashboard from '@/components/Dashboard';
import { Container, Grid, Typography } from '@mui/material';

export default function SettingsPage() {
  return (
    <Dashboard>
      <Container>
        <Grid container sx={{ paddingTop: 5 }}>
          <Grid container>
            <Typography variant="h4">Preference setting</Typography>
          </Grid>
        </Grid>
      </Container>
    </Dashboard>
  );
}
