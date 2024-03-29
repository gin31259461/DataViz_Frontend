import RacingBarChartEngine, {
  convertToRacingBarChartData,
  RacingBarChartArgs,
  RacingBarChartMapping,
} from '@/components/chart-engine/racing-bar-chart-engine';
import { DataArgsProps, useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import { useEffect } from 'react';

function PreviewRacingChart() {
  const selectedDataOID = useProjectStore((state) => state.selectedDataId);
  const selectedData = api.data.getContentFromDataTable.useQuery(selectedDataOID);
  const dataArgs = useProjectStore<DataArgsProps<RacingBarChartMapping>>(
    (state) => state.dataArgs as DataArgsProps<RacingBarChartMapping>
  );
  const chartArgs = useProjectStore((state) => state.chartArgs);
  const setChartArgs = useProjectStore((state) => state.setChartArgs);

  useEffect(() => {
    setChartArgs({
      numOfBars: 8,
      numOfSlice: 10,
      chartMargin: {
        top: 30,
        right: 220,
        bottom: 130,
        left: 220,
      },
      chartHeight: 500,
    });
  }, [setChartArgs]);

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 60px - 80px - 60px)', display: 'flex', alignItems: 'center' }}>
      {chartArgs && selectedData.data && (
        <RacingBarChartEngine
          data={convertToRacingBarChartData(selectedData.data, dataArgs)}
          args={chartArgs as RacingBarChartArgs}
        ></RacingBarChartEngine>
      )}
    </div>
  );
}
export default PreviewRacingChart;
