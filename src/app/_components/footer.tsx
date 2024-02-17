import { Container, Grid, Typography } from '@mui/material';

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
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              關於我們
            </Typography>
            <Typography variant="body2" component="p">
              WKE ( Web Knowledge Extraction ) 實驗室專注於為不同領域需求開發 Web 信息系統 (WIS)。通過整合 WKE
              開發的有關網頁/文本探勘方法的系統和模塊，可以升級 WIS 為先進的智能信息系統。
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" color="textSecondary" align="center" marginTop="2vh">
          {'© '}
          {new Date().getFullYear()}
          {' WKE. All rights reserved.'}
        </Typography>
      </Container>
    </footer>
  );
}
