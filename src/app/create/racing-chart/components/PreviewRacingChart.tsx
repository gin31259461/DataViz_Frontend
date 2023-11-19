import LoadingWithTitle from '@/components/Loading/LoadingWithTitle';
import { useProjectStore } from '@/hooks/store/useProjectStore';
import { trpc } from '@/server/trpc';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import { Container, IconButton } from '@mui/material';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import RacingBarChart, { RacingBarChartController } from '../../../../components/Chart/RacingBarChart/RacingBarChart';
import { makeKeyframes } from '../../../../components/Chart/RacingBarChart/useKeyframes';

const numOfBars = 8;
const numOfSlice = 10;
const chartMargin = {
  top: 30,
  right: 220,
  bottom: 150,
  left: 200,
};

const chartHeight = 500;

function PreviewRacingChart() {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const selectedData = trpc.dataObject.getAllFromDataTable.useQuery<{ [index: string]: any }[]>(selectedDataOID);
  const racingBarChartDataColumnMapping = useProjectStore((state) => state.racingBarChartDataColumnMapping);

  const convertToRacingBarChartData = useCallback(() => {
    if (racingBarChartDataColumnMapping && selectedData.data && selectedData.data?.length > 0) {
      const newData = selectedData.data.map((tuple) => {
        return {
          date: tuple[racingBarChartDataColumnMapping['date']],
          name: tuple[racingBarChartDataColumnMapping['name']],
          value: parseInt(tuple[racingBarChartDataColumnMapping['value']]),
          category: tuple[racingBarChartDataColumnMapping['category']],
        };
      });
      return newData;
    }
    return [];
  }, [racingBarChartDataColumnMapping, selectedData]);

  const keyframes = makeKeyframes(convertToRacingBarChartData(), numOfSlice);
  const chartRef = useRef<RacingBarChartController>();
  const ChartContainerRef = useRef(null);
  const [chartContainerOffset, setChartContainerOffset] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (ChartContainerRef.current) {
      const element = ChartContainerRef.current as HTMLDivElement;
      setChartContainerOffset({ width: element.offsetWidth, height: element.offsetHeight });
    }
  }, [ChartContainerRef]);

  const handleReplay = () => {
    if (chartRef.current) chartRef.current.replay();
  };
  const handleStart = () => {
    if (chartRef.current) chartRef.current.start();
  };
  const handleStop = () => {
    if (chartRef.current) chartRef.current.stop();
  };

  const playing = chartRef.current ? chartRef.current.playing : false;
  const [_, forceUpdate] = useState<boolean>();

  return (
    <Container>
      <div ref={ChartContainerRef} style={{ display: 'flex' }}>
        {keyframes.length > 0 && chartContainerOffset && (
          <Suspense fallback={<LoadingWithTitle title="Generating racing bar chart" />}>
            <RacingBarChart
              keyframes={keyframes}
              numOfBars={numOfBars}
              width={chartContainerOffset.width}
              height={chartHeight}
              margin={chartMargin}
              onStart={() => forceUpdate(true)}
              onStop={() => forceUpdate(false)}
              barGap={10}
              ref={chartRef}
            />
            <div>
              <IconButton onClick={handleReplay}>
                <ReplayIcon />
              </IconButton>
            </div>
            <div>
              {playing ? (
                <IconButton onClick={handleStop}>
                  <PauseIcon />
                </IconButton>
              ) : (
                <IconButton onClick={handleStart}>
                  <PlayArrowIcon />
                </IconButton>
              )}
            </div>
          </Suspense>
        )}
      </div>
    </Container>
  );
}
export default PreviewRacingChart;
