'use client';

import CardButton from '@/components/button/card-button';
import { GridContainerDivider } from '@/components/divider/grid-container-divider';
import LoadingWithTitle from '@/components/loading/loading-with-title';
import AutoCompleteSelect from '@/components/select/auto-complete-select';
import MultiSelect from '@/components/select/multi-select';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, Grid, Typography, useTheme } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import { StepperContext } from '../../_components/stepper';
import AddConceptDialog from './concept-hierarchy-dialog';

// 高中以下,大專,研究所
function PathAnalysis() {
  const theme = useTheme();

  const stepperContext = useContext(StepperContext);

  const dataInfo = useProjectStore((state) => state.dataInfo);
  const target = useProjectStore((state) => state.target);
  const setTarget = useProjectStore((state) => state.setTarget);
  const skipValues = useProjectStore((state) => state.skipValues);
  const setSkipValues = useProjectStore((state) => state.setSkipValues);
  const selectedDataId = useProjectStore((state) => state.selectedDataId);
  const conceptHierarchy = useProjectStore((state) => state.conceptHierarchy);
  const setConceptHierarchy = useProjectStore((state) => state.setConceptHierarchy);

  const [conceptHierarchyDialogOpen, setConceptHierarchyDialogOpen] = useState(false);
  const [readyToAnalyze, setReadyToAnalyze] = useState(false);

  const analysis = api.analysis.getPathAnalysis.useMutation();

  const startAnalysis = async () => {
    if (selectedDataId && target) {
      const reqData = {
        dataId: selectedDataId,
        target,
        skip_values: skipValues,
        concept_hierarchy: conceptHierarchy,
      };

      const data = await analysis.mutateAsync(reqData);
      console.log(data);
    }
  };

  const options = useMemo(() => {
    return dataInfo && Object.keys(dataInfo.columns).filter((col) => dataInfo.columns[col].type === 'string');
  }, [dataInfo]);

  useEffect(() => {
    stepperContext.setIsLoading(analysis.isLoading);
  }, [stepperContext, analysis.isLoading, target]);

  useEffect(() => {
    if (!target) {
      setReadyToAnalyze(false);
    } else {
      setReadyToAnalyze(true);
    }
  }, [stepperContext, target]);

  return (
    <>
      <Grid container gap={4}>
        <Grid container>
          <Typography variant="h4">Path analysis configuration</Typography>
        </Grid>

        <Grid container>
          <Typography variant="h5">Target</Typography>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <AutoCompleteSelect
              initialValue={target}
              loading={false}
              onChange={(value) => {
                setTarget(value);
              }}
              onClear={() => setTarget(undefined)}
              label="選擇分析目標 (數值型欄位)"
            >
              {dataInfo
                ? Object.keys(dataInfo.columns).filter((col) => {
                    const info = dataInfo.columns[col];
                    return info.type === 'number' || info.type === 'float';
                  })
                : []}
            </AutoCompleteSelect>
          </Grid>
        </Grid>

        <Grid container>
          <Typography variant="h5">Skip values</Typography>
        </Grid>

        <Grid container>
          <Typography color={theme.palette.info.main} variant="body1">
            choose some value that you don't want it to be analyzed
          </Typography>
        </Grid>

        <Grid container gap={2}>
          {dataInfo &&
            Object.keys(dataInfo.columns)
              .filter((col) => dataInfo.columns[col].type === 'string')
              .map((col, i) => {
                return (
                  <Grid container key={i}>
                    <Grid item xs={6}>
                      {col}
                    </Grid>
                    <Grid item xs={6}>
                      <MultiSelect onChange={(values) => setSkipValues({ ...skipValues, [col]: values })}>
                        {dataInfo.columns[col].values as string[]}
                      </MultiSelect>
                    </Grid>
                  </Grid>
                );
              })}
        </Grid>

        <Grid container>
          <Typography variant="h5">Concept hierarchy</Typography>
        </Grid>

        <Grid container gap={3}>
          {conceptHierarchy &&
            Object.keys(conceptHierarchy).map((col, i) => {
              return (
                <Grid container key={`${col}-${i}`} gap={2}>
                  <Grid container gap={2}>
                    <Typography color={theme.palette.info.main}>{col}</Typography>
                    <Grid container>
                      {conceptHierarchy[col].order.map((tag, j) => {
                        return (
                          <Grid item xs={4} key={`${col}-${i}-${tag}-${j}`}>
                            <Typography color={theme.palette.secondary.main}>{tag}</Typography>
                            <Typography>{conceptHierarchy[col].hierarchy[tag].join(', ')}</Typography>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  <GridContainerDivider />
                </Grid>
              );
            })}
        </Grid>

        <Grid container>
          <CardButton
            title="Add new concept hierarchy"
            icon={<AddOutlinedIcon />}
            onClick={() => setConceptHierarchyDialogOpen(true)}
          />
          <AddConceptDialog
            open={conceptHierarchyDialogOpen}
            onClose={() => setConceptHierarchyDialogOpen(false)}
            onCancel={() => setConceptHierarchyDialogOpen(false)}
            onConfirm={(selectedConcept, tags, mapping) => {
              const hierarchy: Record<string, string[]> = {};

              tags.forEach((tag) => (hierarchy[tag] = []));

              Object.keys(mapping).forEach((key) => hierarchy[mapping[key]].push(key));

              setConceptHierarchy({
                ...conceptHierarchy,
                [selectedConcept]: {
                  hierarchy: hierarchy,
                  order: tags,
                },
              });
            }}
            conceptOptions={options}
          ></AddConceptDialog>
        </Grid>

        <GridContainerDivider />

        <Grid container justifyContent={'center'}>
          <Button
            disabled={analysis.isLoading || !readyToAnalyze}
            color="info"
            variant="contained"
            onClick={startAnalysis}
          >
            Start analyze
          </Button>
        </Grid>

        {analysis.isLoading && <LoadingWithTitle>正在進行資料路徑分析...</LoadingWithTitle>}

        <GridContainerDivider />

        <Grid container justifyContent={'center'}>
          <Typography variant="h5" color={theme.palette.info.main}>
            到底了!
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default PathAnalysis;
