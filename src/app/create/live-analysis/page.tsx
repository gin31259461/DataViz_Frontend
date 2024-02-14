import ChooseData from '../_components/choose-data';
import Complete from '../_components/complete';
import ExploreData from './_components/explore-data';
import PathAnalysis from './_components/path-analysis';
import ProcessAnalysis from './_components/process-analysis';
import StepperProvider from './provider';

async function LiveAnalysisPage() {
  const steps = ['選擇資料', '展示資料', '路徑分析', '路徑回朔樞紐分析', '資訊圖表', '完成!'];

  return (
    <StepperProvider steps={steps}>
      <ChooseData />
      <ExploreData />
      <PathAnalysis />
      <ProcessAnalysis />
      <Complete />
      <Complete />
    </StepperProvider>
  );
}

export default LiveAnalysisPage;
