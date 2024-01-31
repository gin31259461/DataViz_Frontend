'use client';

import { useEffect, useState } from 'react';
import { PathAnalysisRequestParams } from '../action';

interface PathAnalysisProps {
  getPathAnalysis: (reqData: PathAnalysisRequestParams) => Promise<void>;
}

function PathAnalysis(props: PathAnalysisProps) {
  const [paths, setPaths] = useState<any>(null);
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

  useEffect(() => {
    const getPathAnalysis = async (reqData: PathAnalysisRequestParams) => {
      const paths = await props.getPathAnalysis(reqData);
      console.log(paths);
    };

    getPathAnalysis(reqData);
  }, [props]);
  return <div>PathAnalysis</div>;
}

export default PathAnalysis;
