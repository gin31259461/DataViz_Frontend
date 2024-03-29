'use client';

import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import { useRouter } from 'next/navigation';
import ChooseData from '../_components/choose-data';
import Complete from '../_components/complete';
import Stepper, { StepperContext, useCustomStepperAction } from '../_components/stepper';
import { revalidateProject } from '../action';
import Configuration from './configuration';
import PreviewRacingChart from './preview-racing-chart';

function CreateRacingBarChartPage() {
  const router = useRouter();
  const createArg = api.project.createArg.useMutation();
  const selectedDataOID = useProjectStore((state) => state.selectedDataId);
  const title = useProjectStore((state) => state.title);
  const des = useProjectStore((state) => state.des);
  const chartArgs = useProjectStore((state) => state.chartArgs);
  const dataArgs = useProjectStore((state) => state.dataArgs);
  const clear = useProjectStore((state) => state.clear);

  const steps = ['選擇資料', '設定', '預覽 racing chart', '完成!'];
  const stepperValue = useCustomStepperAction(steps.length);

  const backButtonDisabled = () => {
    if (stepperValue.activeStep !== 0) return false;
    return true;
  };

  const nextButtonDisabled = () => {
    if (!selectedDataOID) return true;
    return false;
  };

  const onConfirm = async () => {
    if (selectedDataOID) {
      await createArg
        .mutateAsync({
          title: title,
          des: des,
          type: 'racing-chart',
          dataId: selectedDataOID,
          args: {
            dataId: selectedDataOID,
            chartType: ['racing-bar-chart'],
            chartArgs: chartArgs ?? {},
            dataArgs: dataArgs ?? {},
          },
        })
        .then((lastId) => {
          clear();
          revalidateProject();
          router.replace(`/management/project/racing-chart/${lastId}`);
        });
    }
  };

  return (
    <StepperContext.Provider value={stepperValue}>
      <Stepper
        steps={steps}
        backButtonDisabled={backButtonDisabled}
        nextButtonDisabled={nextButtonDisabled}
        callback={onConfirm}
      >
        <ChooseData />
        <Configuration />
        <PreviewRacingChart />
        <Complete />
      </Stepper>
    </StepperContext.Provider>
  );
}
export default CreateRacingBarChartPage;
