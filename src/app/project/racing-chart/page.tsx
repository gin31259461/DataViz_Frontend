'use client';

import { useRouter } from 'next/navigation';
import AllCompleted from '../components/AllCompleted';
import CustomStepper, { CustomStepperContext, useCustomStepperAction } from '../components/CustomStepper';
import SelectData from '../components/SelectData';
import Configuration from './components/Configuration';
import PreviewRacingChart from './components/PreviewRacingChart';

function RaceChartPage() {
  const steps = ['Select data', 'Configuration', 'Preview racing bar chart', 'Completed'];
  const stepperValue = useCustomStepperAction(steps.length);
  const components = [
    <SelectData key={0} />,
    <Configuration key={1} />,
    <PreviewRacingChart key={2} />,
    <AllCompleted key={3} />,
  ];
  const router = useRouter();

  const backButtonDisabled = () => {
    if (stepperValue.activeStep !== 0) return false;
    return true;
  };

  const nextButtonDisabled = () => {
    return false;
  };

  return (
    <CustomStepperContext.Provider value={stepperValue}>
      <CustomStepper
        steps={steps}
        components={components}
        backButtonDisabled={backButtonDisabled}
        nextButtonDisabled={nextButtonDisabled}
        callback={() => router.push('/management/infographic')}
      />
    </CustomStepperContext.Provider>
  );
}
export default RaceChartPage;