'use client';

import LoadingWithTitle from '@/components/loading/loading-with-title';
import { api } from '@/server/trpc/trpc.client';

const reqData = {
  dataId: 769,
  target: '信用卡交易金額[新台幣]',
  process: [
    ['信用卡交易筆數', ['middle', 'high']],
    ['信用卡交易筆數', ['high']],
    ['地區', ['臺北市']],
    ['教育程度類別', ['研究所']],
    ['產業別', ['食', '衣', '住', '行']],
    ['產業別', ['食', '衣']],
  ],
};

function ProcessAnalysis() {
  const process = api.analysis.getProcessPivotAnalysis.useQuery(reqData);

  console.log(process.data);

  return (
    <>
      <LoadingWithTitle>正在進行路徑樞紐分析...</LoadingWithTitle>
    </>
  );
}

export default ProcessAnalysis;
