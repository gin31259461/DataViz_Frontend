import ChooseData from '../components/ChooseData';
import ExploreData from '../components/ExploreData';
import {
  getDataInfo,
  getPathAnalysis,
  getProcessAnalysis,
  PathAnalysisRequestParams,
  ProcessAnalysisRequestParams,
} from './action';
import PathAnalysis from './components/PathAnalysis';
import ProcessAnalysis from './components/ProcessAnalysis';
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
    <ExploreData
      key={1}
      getDataInfo={async (dataId: string) => {
        'use server';
        const dataInfo = await getDataInfo(dataId);
        return dataInfo;
      }}
    />,
    <PathAnalysis
      key={2}
      getPathAnalysis={async (reqData: PathAnalysisRequestParams) => {
        'use server';
        const paths = await getPathAnalysis(reqData);
        return paths;
      }}
    />,
    <ProcessAnalysis
      key={3}
      getProcessAnalysis={async (reqData: ProcessAnalysisRequestParams) => {
        'use server';
        const process = await getProcessAnalysis(reqData);
        return process;
      }}
    />,
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
