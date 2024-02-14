'use client';

import { useProjectStore } from '@/hooks/store/use-project-store';
import { ReactNode } from 'react';
import Stepper, { StepperContext, useCustomStepperAction } from '../_components/stepper';

interface StepperProviderProps {
  steps: string[];
  children: ReactNode[];
}

function StepperProvider(props: StepperProviderProps) {
  const selectedDataOID = useProjectStore((state) => state.selectedDataId);
  const stepperValue = useCustomStepperAction(props.steps.length);

  const backButtonDisabled = () => {
    if (stepperValue.activeStep !== 0) return false;
    return true;
  };

  const nextButtonDisabled = () => {
    if (!selectedDataOID) return true;
    return false;
  };

  return (
    <StepperContext.Provider value={stepperValue}>
      <Stepper
        steps={props.steps}
        backButtonDisabled={backButtonDisabled}
        nextButtonDisabled={nextButtonDisabled}
        callback={async () => {}}
      >
        {props.children}
      </Stepper>
    </StepperContext.Provider>
  );
}

export default StepperProvider;
