'use client';

import LoadingWithTitle from '@/components/loading/loading-with-title';
import { api } from '@/server/trpc/trpc.client';
import { useContext, useEffect } from 'react';
import { CustomStepperContext } from '../../_components/stepper';

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
  const stepperContext = useContext(CustomStepperContext);
  const paths = api.analysis.getPathAnalysis.useQuery(reqData);

  console.log(paths.data);

  useEffect(() => {
    if (paths.isLoading) {
      stepperContext.changeBackButtonDisabled(true);
      stepperContext.changeNextButtonDisabled(true);
    } else {
      stepperContext.changeBackButtonDisabled(false);
      stepperContext.changeNextButtonDisabled(false);
    }
  }, [stepperContext, paths.isLoading]);

  return (
    <>
      <LoadingWithTitle>正在進行資料路徑分析...</LoadingWithTitle>
    </>
  );
}

export default PathAnalysis;
