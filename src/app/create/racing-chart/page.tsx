'use client';

import { useProjectStore } from '@/hooks/store/use-project-store';
import { useUserStore } from '@/hooks/store/use-user-store';
import { trpc } from '@/server/trpc';
import { useRouter } from 'next/navigation';
import ChooseData from '../_components/choose-data';
import Complete from '../_components/complete';
import Stepper, {
  CustomStepperContext,
  useCustomStepperAction,
} from '../_components/stepper';
import Configuration from './configuration';
import PreviewRacingChart from './preview-racing-chart';

function CreateRacingBarChartPage() {
  const createArg = trpc.project.createArg.useMutation();
  const mid = useUserStore((state) => state.mid);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const title = useProjectStore((state) => state.title);
  const des = useProjectStore((state) => state.des);
  const chartType = useProjectStore((state) => state.chartType);
  const chartArgs = useProjectStore((state) => state.chartArgs);
  const dataArgs = useProjectStore((state) => state.dataArgs);
  const lastProjectId = trpc.project.getLastProjectId.useQuery(mid);

  const steps = [
    'Select data',
    'Configuration',
    'Preview racing bar chart',
    'Completed',
  ];
  const stepperValue = useCustomStepperAction(steps.length);
  const components = [
    <ChooseData key={0} />,
    <Configuration key={1} />,
    <PreviewRacingChart key={2} />,
    <Complete key={3} />,
  ];
  const router = useRouter();

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
      await createArg.mutateAsync({
        title: title,
        des: des,
        mid: mid,
        dataId: selectedDataOID,
        args: {
          dataId: selectedDataOID,
          chartType: chartType ?? '',
          chartArgs: chartArgs ?? {},
          dataArgs: dataArgs ?? {},
        },
      });
    }
  };

  return (
    <CustomStepperContext.Provider value={stepperValue}>
      <Stepper
        steps={steps}
        components={components}
        backButtonDisabled={backButtonDisabled}
        nextButtonDisabled={nextButtonDisabled}
        callback={async () => {
          await onConfirm();
          await lastProjectId.refetch();
          router.push(`/management/project/${lastProjectId.data}`);
        }}
      />
    </CustomStepperContext.Provider>
  );
}
export default CreateRacingBarChartPage;
