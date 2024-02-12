'use client';

import { useProjectStore } from '@/hooks/store/use-project-store';
import { useUserStore } from '@/hooks/store/use-user-store';
import { api } from '@/server/trpc/client';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChooseData from '../_components/choose-data';
import Complete from '../_components/complete';
import Stepper, { CustomStepperContext, useCustomStepperAction } from '../_components/stepper';
import { revalidateProject } from '../action';
import Configuration from './configuration';
import PreviewRacingChart from './preview-racing-chart';

function CreateRacingBarChartPage() {
  const router = useRouter();
  const createArg = api.project.createArg.useMutation();
  const mid = useUserStore((state) => state.mid);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const title = useProjectStore((state) => state.title);
  const des = useProjectStore((state) => state.des);
  const chartType = useProjectStore((state) => state.chartType);
  const chartArgs = useProjectStore((state) => state.chartArgs);
  const dataArgs = useProjectStore((state) => state.dataArgs);
  const clear = useProjectStore((state) => state.clear);
  const lastProjectId = api.project.getLastProjectId.useQuery(mid);
  const [done, setDone] = useState(false);

  const steps = ['Select data', 'Configuration', 'Preview racing bar chart', 'Completed'];
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
    if (selectedDataOID && mid) {
      await createArg.mutateAsync({
        title: title,
        des: des,
        mid: mid,
        type: 'racing-chart',
        dataId: selectedDataOID,
        args: {
          dataId: selectedDataOID,
          chartType: chartType ?? '',
          chartArgs: chartArgs ?? {},
          dataArgs: dataArgs ?? {},
        },
      });

      await lastProjectId.refetch();
      clear();
    }
  };

  useEffect(() => {
    if (done) {
      setDone(false);
      revalidateProject();
      redirect(`/management/project/racing-chart/${lastProjectId.data}`);
    }
  }, [done, lastProjectId, router]);

  return (
    <CustomStepperContext.Provider value={stepperValue}>
      <Stepper
        steps={steps}
        backButtonDisabled={backButtonDisabled}
        nextButtonDisabled={nextButtonDisabled}
        callback={async () => {
          await onConfirm();
          setDone(true);
        }}
      >
        <ChooseData />
        <Configuration />
        <PreviewRacingChart />
        <Complete />
      </Stepper>
    </CustomStepperContext.Provider>
  );
}
export default CreateRacingBarChartPage;
