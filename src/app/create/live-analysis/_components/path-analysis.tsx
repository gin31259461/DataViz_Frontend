'use client';

import LinearProgressPending from '@/components/loading/linear-progress-pending';
import { api } from '@/server/trpc/client';
import { Container } from '@mui/material';

const reqData = {
  dataId: 769,
  target: '信用卡交易金額[新台幣]',
  concept_hierarchy: {
    教育程度類別: {
      hierarchy: {
        高中以下: ['高中高職', '其他'],
        大專: ['專科', '大學'],
        研究所: ['碩士', '博士'],
      },
      order: ['高中以下', '大專', '研究所'],
    },
  },
};

function PathAnalysis() {
  const paths = api.analysis.getPathAnalysis.useQuery(reqData);

  console.log(paths.data);

  return (
    <Container>
      <LinearProgressPending isPending={paths.isLoading || paths.isFetching} />
    </Container>
  );
}

export default PathAnalysis;
