'use client';

import LinearProgressPending from '@/components/loading/linear-progress-pending';
import { Container } from '@mui/material';
import { useEffect, useState, useTransition } from 'react';

// const reqData = {
//   dataId: '769',
//   target: '信用卡交易金額[新台幣]',
//   process: [
//     ['信用卡交易筆數', ['middle', 'high']],
//     ['信用卡交易筆數', ['high']],
//     ['地區', ['臺北市']],
//     ['教育程度類別', ['研究所']],
//     ['產業別', ['食', '衣', '住', '行']],
//     ['產業別', ['食', '衣']],
//   ],
// };

function ProcessAnalysis() {
  // const [process, setProcess] = useState<any>(null);
  const [isPending, startProcessAnalysis] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startProcessAnalysis(async () => {
      // const process = await getProcessAnalysis(reqData);
      setIsLoading(false);
      // setProcess(process);
    });
  }, []);

  return (
    <Container>
      <LinearProgressPending isPending={isPending || isLoading} />
    </Container>
  );
}

export default ProcessAnalysis;
