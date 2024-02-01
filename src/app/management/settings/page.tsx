import { Grid, Typography } from '@mui/material';
import ManagementDashBoard from '../management-dashboard';

export default function SettingsPage() {
  return (
    <ManagementDashBoard>
      <Grid container sx={{ paddingTop: 5 }}>
        <Grid container>
          <Typography variant="h4">Preference setting</Typography>
        </Grid>
      </Grid>
    </ManagementDashBoard>
  );
}
