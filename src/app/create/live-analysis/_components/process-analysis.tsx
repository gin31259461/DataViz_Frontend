'use client';

import { useEffect, useState } from 'react';
import { ProcessAnalysisRequestParams } from '../action';

interface ProcessAnalysisProps {
  getProcessAnalysis: (reqData: ProcessAnalysisRequestParams) => Promise<void>;
}

function ProcessAnalysis(props: ProcessAnalysisProps) {
  const [process, setProcess] = useState<any>(null);

  const reqData = {
    dataId: '769',
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

  useEffect(() => {
    const getData = async () => {
      const process = await props.getProcessAnalysis(reqData);
      console.log(process);
    };

    getData();
  }, [props]);

  return <div>ProcessAnalysis</div>;
}

export default ProcessAnalysis;
