import Footer from '@/app/_components/footer';
import { colorTokens } from '@/utils/color-tokens';
import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import { Gallery } from './_components/gallery';
import TypingText from './_components/typing-text';

export default function HomePage() {
  const color = colorTokens('dark');

  return (
    <div style={{ paddingTop: 60 }}>
      <Container>
        <Box
          sx={{
            paddingBottom: '5vh',
          }}
        >
          <Grid container spacing={3}>
            <Typography
              variant="h3"
              sx={{
                color: color.greenAccent[500],
                marginBottom: 3,
                width: 'max-content',
              }}
            >
              <TypingText>{['Data visualization', 'Beautiful infographic']}</TypingText>
            </Typography>
            <Typography fontSize={20}>
              本系統致力於解決現今資訊爆炸時代中，龐大的 big data
              處理難題。傳統資料處理需要經驗豐富的專業人士，但本系統讓一般使用者能輕鬆快速進行資料分析。
              透過程式化、資料分析和視覺化工具， 我們讓數百萬筆資料或多表關聯的複雜資料， 變得易於探索。
              這使得人們能夠快速有效地利用 big data 進行深度學習模型訓練與各領域應用，促進資訊科技與人類生活的緊密結合。
            </Typography>
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
            圖表庫
          </Typography>
          <Gallery />
        </div>
      </Container>
      <Footer />
    </div>
  );
}
