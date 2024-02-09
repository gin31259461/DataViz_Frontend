'use client';

import { useProjectStore } from '@/hooks/store/use-project-store';
import Stepper, { CustomStepperContext, useCustomStepperAction } from '../_components/stepper';

interface StepperProviderProps {
  stepLength: number;
  steps: string[];
  components: React.ReactNode[];
}

function StepperProvider(props: StepperProviderProps) {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const stepperValue = useCustomStepperAction(props.stepLength);

  const backButtonDisabled = () => {
    if (stepperValue.activeStep !== 0) return false;
    return true;
  };

  const nextButtonDisabled = () => {
    if (!selectedDataOID) return true;
    return false;
  };

  return (
    <CustomStepperContext.Provider value={stepperValue}>
      <Stepper
        steps={props.steps}
        components={props.components}
        backButtonDisabled={backButtonDisabled}
        nextButtonDisabled={nextButtonDisabled}
        callback={async () => {}}
      />
    </CustomStepperContext.Provider>
  );
}

export default StepperProvider;
