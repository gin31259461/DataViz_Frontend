import ChooseData from '../_components/choose-data';
import ExploreData from './_components/explore-data';
import PathAnalysis from './_components/path-analysis';
import ProcessAnalysis from './_components/process-analysis';
import StepperProvider from './provider';

async function LiveAnalysisPage() {
  const steps = ['choose data', 'explore data', 'path analysis', 'process analysis', 'infographic', 'done'];

  return (
    <StepperProvider stepLength={6} steps={steps}>
      <ChooseData />
      <ExploreData />
      <PathAnalysis />
      <ProcessAnalysis />
    </StepperProvider>
  );
}

export default LiveAnalysisPage;
