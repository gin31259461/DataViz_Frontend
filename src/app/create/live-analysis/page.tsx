import ChooseData from '../_components/choose-data';
import ExploreData from '../_components/explore-data';
import PathAnalysis from './_components/path-analysis';
import ProcessAnalysis from './_components/process-analysis';
import { getDataInfo, getPathAnalysis, getProcessAnalysis } from './action';
import StepperProvider from './provider';

async function LiveAnalysisPage() {
  const steps = [
    'choose data',
    'explore data',
    'path analysis',
    'process analysis',
    'infographic',
    'done',
  ];
  const components = [
    <ChooseData key={0} />,
    <ExploreData key={1} getDataInfo={getDataInfo} />,
    <PathAnalysis key={2} getPathAnalysis={getPathAnalysis} />,
    <ProcessAnalysis key={3} getProcessAnalysis={getProcessAnalysis} />,
  ];

  return (
    <StepperProvider
      stepLength={6}
      steps={steps}
      components={components}
    ></StepperProvider>
  );
}

export default LiveAnalysisPage;
