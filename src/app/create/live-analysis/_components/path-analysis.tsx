'use client';

import LinearProgressPending from '@/components/loading/linear-progress-pending';
import { Container } from '@mui/material';
import { useEffect, useState, useTransition } from 'react';
import { PathAnalysisRequestParams } from '../action';

const reqData = {
  dataId: '769',
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

interface PathAnalysisProps {
  getPathAnalysis: (reqData: PathAnalysisRequestParams) => Promise<void>;
}

function PathAnalysis(props: PathAnalysisProps) {
  const [paths, setPaths] = useState<any>(null);
  const [isPending, startAnalysis] = useTransition();
  const getPathAnalysis = props.getPathAnalysis;

  useEffect(() => {
    startAnalysis(async () => {
      const paths = await getPathAnalysis(reqData);
      setPaths(paths);
      console.log(paths);
    });
  }, [getPathAnalysis]);
  return (
    <Container>
      <LinearProgressPending isPending={isPending} />
    </Container>
  );
}

export default PathAnalysis;
