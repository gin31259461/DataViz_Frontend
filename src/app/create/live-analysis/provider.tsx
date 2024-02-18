'use client';

import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import Stepper, { StepperContext, useCustomStepperAction } from '../_components/stepper';
import { revalidateProject } from '../action';

interface StepperProviderProps {
  steps: string[];
  children: ReactNode[];
}

function StepperProvider(props: StepperProviderProps) {
  const router = useRouter();

  const stepperValue = useCustomStepperAction(props.steps.length);

  const createArg = api.project.createArg.useMutation();

  const selectedDataId = useProjectStore((state) => state.selectedDataId);
  const target = useProjectStore((state) => state.target);
  const dataInfo = useProjectStore((state) => state.dataInfo);
  const selectedPath = useProjectStore((state) => state.selectedPath);
  const process = useProjectStore((state) => state.process);
  const clear = useProjectStore((state) => state.clear);

  const backButtonDisabled = () => {
    if (stepperValue.activeStep !== 0) return false;
    return true;
  };

  const nextButtonDisabled = () => {
    if ((stepperValue.activeStep === 0 && !selectedDataId) || (stepperValue.activeStep === 2 && !selectedPath))
      return true;

    return false;
  };

  const onConfirmCallback = async () => {
    if (selectedDataId && target && selectedPath && dataInfo) {
      await createArg
        .mutateAsync({
          args: {
            dataId: selectedDataId,
            chartType: [],
            chartArgs: [],
            dataArgs: { path: selectedPath, process: process },
          },
          type: 'path-analysis',
          title: dataInfo.info.name + ' : 路徑分析',
          des: '以目標為 ( ' + target + ' ) 進行路徑分析',
          dataId: selectedDataId,
        })
        .then((id) => {
          revalidateProject();
          clear();
          router.replace(`/management/project/path-analysis/${id}`);
        });
    }
  };

  return (
    <StepperContext.Provider value={stepperValue}>
      <Stepper
        steps={props.steps}
        backButtonDisabled={backButtonDisabled}
        nextButtonDisabled={nextButtonDisabled}
        callback={onConfirmCallback}
      >
        {props.children}
      </Stepper>
    </StepperContext.Provider>
  );
}

export default StepperProvider;
