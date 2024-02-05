import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Container, Grid, Link, Typography } from '@mui/material';

export default function Footer() {
  return (
    <footer>
      <Container
        maxWidth="lg"
        sx={{
          paddingTop: '2vh',
          padding: 6,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" component="p">
              WKE (Web Knowledge Extraction) Lab. WKE focuses on developing Web
              information systems (WIS) for various domain requirements. By
              integrating systems and modules about web/text mining methods
              developed in WKE, WIS can be enhanced to advanced intelligent
              information systems.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <ul>
              <li>
                <Link color="textSecondary" href="#">
                  Documentation
                </Link>
              </li>
              <li>
                <Link color="textSecondary" href="#">
                  Support
                </Link>
              </li>
              <li>
                <Link color="textSecondary" href="#">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Link
              href="https://github.com/gin31259461"
              color="inherit"
              target="_blank"
            >
              <GitHubIcon sx={{ marginRight: 1 }} />
              GitHub
            </Link>
            <br />
            <Link href="/" color="inherit" target="_blank">
              <FacebookIcon sx={{ marginRight: 1 }} />
              Facebook
            </Link>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          marginTop="2vh"
        >
          {'© '}
          {new Date().getFullYear()}
          {' WKE. All rights reserved.'}
        </Typography>
      </Container>
    </footer>
  );
}
