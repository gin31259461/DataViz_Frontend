import RacingBarChartEngine, {
  convertToRacingBarChartData,
  RacingBarChartArgs,
  RacingBarChartMapping,
} from '@/components/ChartEngine/RacingBarChartEngine';
import { DataArgsProps, useProjectStore } from '@/hooks/store/useProjectStore';
import { trpc } from '@/server/trpc';
import { Container } from '@mui/material';
import { useEffect } from 'react';

function PreviewRacingChart() {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const selectedData =
    trpc.dataObject.getContentFromDataTable.useQuery<
      { [index: string]: any }[]
    >(selectedDataOID);
  const dataArgs = useProjectStore<DataArgsProps<RacingBarChartMapping>>(
    (state) => state.dataArgs as DataArgsProps<RacingBarChartMapping>,
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
        bottom: 150,
        left: 200,
      },
      chartHeight: 500,
    });
  }, [setChartArgs]);

  return (
    <Container sx={{ paddingTop: 10 }}>
      {chartArgs && selectedData.data && (
        <RacingBarChartEngine
          data={convertToRacingBarChartData(selectedData.data, dataArgs)}
          args={chartArgs as RacingBarChartArgs}
        ></RacingBarChartEngine>
      )}
    </Container>
  );
}
export default PreviewRacingChart;
