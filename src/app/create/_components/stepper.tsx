'use client';

import { useSplitLineStyle } from '@/hooks/use-styles';
import style from '@/styles/stepper.module.scss';
import utilStyle from '@/styles/util.module.scss';
import { colorTokens } from '@/utils/color-tokens';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import {
  Box,
  Button,
  IconButton,
  Stepper as MuiStepper,
  Step,
  stepIconClasses,
  StepLabel,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

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
  const isFloatLeftPanel = useMediaQuery('(max-width:700px)');

  const stepperContext = useContext(StepperContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isFloatLeftPanel) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isFloatLeftPanel]);

  const stepStyle = {
    [`& .${stepIconClasses.active}`]: {
      [`& .${stepIconClasses.root}`]: {
        color: theme.palette.info.main,
      },
    },
    [`& .${stepIconClasses.completed}`]: {
      [`& .${stepIconClasses.root}`]: {
        color: colors.greenAccent[500],
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
        {isFloatLeftPanel &&
          (open ? <CloseOutlinedIcon sx={{ fontSize: 20 }} /> : <WidgetsOutlinedIcon sx={{ fontSize: 20 }} />)}
      </IconButton>
      <Button
        disabled={backButtonDisabled() || stepperContext.backButtonDisabled || stepperContext.isLoading}
        color="secondary"
        sx={{
          position: 'fixed',
          left: 20,
          bottom: 20,
          zIndex: 50,
          fontSize: 15,
        }}
        onClick={() => stepperContext.changeActiveStep('prev')}
        variant="outlined"
      >
        Back
      </Button>
      <Button
        disabled={nextButtonDisabled() || stepperContext.nextButtonDisabled || stepperContext.isLoading}
        color="info"
        sx={{
          position: 'fixed',
          zIndex: 50,
          right: 20,
          bottom: 20,
          fontSize: 15,
        }}
        onClick={async () => {
          if (stepperContext.activeStep === steps.length - 1) await callback();
          stepperContext.changeActiveStep('next');
        }}
        variant={'contained'}
      >
        {stepperContext.activeStep !== steps.length - 1 ? 'Next' : 'Confirm'}
      </Button>
      {isFloatLeftPanel && open && <div className={utilStyle['backdrop']} onClick={() => setOpen(false)}></div>}
      <Box
        className={style['stepper-left-panel']}
        sx={{
          transform: open ? '' : isFloatLeftPanel ? 'translate(-100vw, 0)' : '',
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
          <MuiStepper
            activeStep={stepperContext.activeStep}
            orientation="vertical"
            sx={{ ...stepStyle, width: '100%' }}
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel sx={{ whiteSpace: 'nowrap' }}>{label}</StepLabel>
              </Step>
            ))}
          </MuiStepper>
        </Box>
      </Box>
      <Box
        sx={{
          height: 'calc(100vh - 60px - 80px)',
          flexGrow: 1,
          paddingLeft: isFloatLeftPanel ? '' : '250px',
          overflowY: 'auto',
        }}
      >
        <StepperContainer>{children[stepperContext.activeStep]}</StepperContainer>
      </Box>
    </Box>
  );
};

type StepAction = 'next' | 'prev';

type StepperContextProps = {
  activeStep: number;
  backButtonDisabled: boolean;
  nextButtonDisabled: boolean;
  isLoading: boolean;
  setIsLoading(status: boolean): void;
  changeActiveStep: (action: StepAction) => void;
  changeBackButtonDisabled: (status: boolean) => void;
  changeNextButtonDisabled: (status: boolean) => void;
};

export const StepperContext = createContext<StepperContextProps>({
  activeStep: 0,
  backButtonDisabled: false,
  nextButtonDisabled: false,
  isLoading: false,
  setIsLoading: () => {},
  changeActiveStep: () => {},
  changeBackButtonDisabled: () => {},
  changeNextButtonDisabled: () => {},
});

export const useCustomStepperAction = (stepLength: number) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [backButtonDisabled, setBackButtonDisabled] = useState(false);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);

  const value = useMemo<StepperContextProps>(() => {
    return {
      activeStep,
      backButtonDisabled,
      nextButtonDisabled,
      isLoading,
      setIsLoading(status) {
        setIsLoading(status);
      },
      changeActiveStep(action) {
        if (action === 'next') setActiveStep((prev) => (prev < stepLength - 1 ? prev + 1 : prev));
        else if (action === 'prev') setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
      },
      changeBackButtonDisabled(status) {
        setBackButtonDisabled(status);
      },
      changeNextButtonDisabled(status) {
        setNextButtonDisabled(status);
      },
    };
  }, [activeStep, stepLength, backButtonDisabled, nextButtonDisabled, isLoading]);

  return value;
};

export const StepperContainer = styled(Box)({
  padding: 15,
  position: 'relative',
});

export default Stepper;
