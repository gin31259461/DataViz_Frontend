'use client';

import { useSplitLineStyle } from '@/hooks/use-styles';
import utilStyle from '@/styles/util.module.scss';
import { colorTokens } from '@/utils/color-tokens';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Box, Button, IconButton, Stepper as MuiStepper, Step, StepLabel, styled, useTheme } from '@mui/material';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface StepperProps {
  steps: string[];
  children: ReactNode[];
  backButtonDisabled: () => boolean;
  nextButtonDisabled: () => boolean;
  callback: () => Promise<void>;
}

const Stepper = ({ steps, children, backButtonDisabled, nextButtonDisabled, callback }: StepperProps) => {
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);

  const stepContext = useContext(CustomStepperContext);
  const [open, setOpen] = useState(true);

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
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <IconButton
        sx={{ position: 'fixed', left: 2, top: 10, zIndex: 200 }}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        {open ? <CloseOutlinedIcon sx={{ fontSize: 20 }} /> : <MenuOutlinedIcon sx={{ fontSize: 20 }} />}
      </IconButton>
      {open && <div className={utilStyle['backdrop']} onClick={() => setOpen(false)}></div>}
      <Button
        disabled={backButtonDisabled()}
        color="info"
        sx={{
          position: 'fixed',
          left: 20,
          bottom: 50,
          zIndex: 50,
          fontSize: 15,
        }}
        onClick={() => stepContext.changeActiveStep('prev')}
        variant="outlined"
      >
        Back
      </Button>
      <Button
        disabled={nextButtonDisabled()}
        color="info"
        sx={{
          position: 'fixed',
          zIndex: 50,
          right: 20,
          bottom: 50,
          fontSize: 15,
        }}
        onClick={async () => {
          if (stepContext.activeStep === steps.length - 1) await callback();
          stepContext.changeActiveStep('next');
        }}
        variant={'contained'}
      >
        {stepContext.activeStep !== steps.length - 1 ? 'Next' : 'Confirm'}
      </Button>
      <Box
        sx={{
          display: open ? 'block' : 'none',
          position: 'fixed',
          zIndex: 10,
          borderRight: useSplitLineStyle(),
        }}
      >
        <Box
          sx={{
            height: 'calc(100vh - 60px)',
            padding: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <MuiStepper activeStep={stepContext.activeStep} orientation="vertical" sx={{ ...stepStyle, width: '100%' }}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </MuiStepper>
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <StepperContainer>{children[stepContext.activeStep]}</StepperContainer>
      </Box>
    </Box>
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
        if (action === 'next') setActiveStep((prev) => (prev < stepLength - 1 ? prev + 1 : prev));
        else if (action === 'prev') setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
      },
    };
  }, [activeStep, stepLength]);

  return value;
};

export const StepperContainer = styled(Box)({
  padding: 15,
  position: 'relative',
});

export default Stepper;
