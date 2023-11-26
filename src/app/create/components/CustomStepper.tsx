'use client';

import { useSplitLineStyle } from '@/hooks/useStyles';
import { tokens } from '@/utils/theme';
import { Box, Button, Grid, Step, StepLabel, Stepper, useTheme } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';

interface CustomStepperProps {
  steps: string[];
  components: React.ReactNode[];
  backButtonDisabled: () => boolean;
  nextButtonDisabled: () => boolean;
  callback: () => Promise<void>;
}

const CustomStepper: React.FC<CustomStepperProps> = ({
  steps,
  components,
  backButtonDisabled,
  nextButtonDisabled,
  callback,
}) => {
  const stepContext = useContext(CustomStepperContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const borderStyle = useSplitLineStyle();

  const stepStyle = {
    '& .Mui-active': {
      '& .MuiStepIcon-root': {
        color: theme.palette.info.main,
      },
    },
    '& .Mui-completed': {
      '& .MuiStepIcon-root': {
        color: colors.greenAccent[500],
      },
    },
    '& .Mui-disabled': {
      '& .MuiStepIcon-root': {
        color: theme.palette.action.disabled,
      },
    },
  };

  return (
    <Grid container>
      <Grid
        container
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: 2,
          height: 140,
          borderBottom: borderStyle,
        }}
      >
        <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
          <Stepper activeStep={stepContext.activeStep} orientation="horizontal" sx={{ ...stepStyle, width: '100%' }}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid container>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              disabled={backButtonDisabled()}
              color="info"
              sx={{ position: 'absolute', fontSize: 15, left: 20 }}
              onClick={() => stepContext.changeActiveStep('prev')}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              disabled={nextButtonDisabled()}
              color="info"
              sx={{ position: 'absolute', fontSize: 15, right: 20 }}
              onClick={async () => {
                if (stepContext.activeStep === steps.length - 1) await callback();
                stepContext.changeActiveStep('next');
              }}
              variant={stepContext.activeStep !== steps.length - 1 ? 'outlined' : 'contained'}
            >
              {stepContext.activeStep !== steps.length - 1 ? 'Next' : 'Confirm'}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          display: 'flex',
          padding: 2,
          height: 'calc(100vh - 140px - 80px)',
          overflowX: 'auto',
        }}
      >
        {components[stepContext.activeStep]}
      </Grid>
    </Grid>
  );
};

type StepAction = 'next' | 'prev';

type CustomStepperContextProps = {
  activeStep: number;
  changeActiveStep: (action: StepAction) => void;
};

export const CustomStepperContext = createContext<CustomStepperContextProps>({
  activeStep: 0,
  changeActiveStep: () => {},
});

export const useCustomStepperAction = (stepLength: number) => {
  const [activeStep, setActiveStep] = useState(0);
  const value = useMemo<CustomStepperContextProps>(() => {
    return {
      activeStep: activeStep,
      changeActiveStep: (action) => {
        if (action == 'next') setActiveStep((prev) => (prev < stepLength - 1 ? prev + 1 : prev));
        else if (action == 'prev') setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
      },
    };
  }, [activeStep, stepLength]);
  return value;
};

export default CustomStepper;
