'use client';

import CardButton from '@/components/button/card-button';
import { GridContainer } from '@/components/grid/grid-container';
import { GridContainerDivider } from '@/components/grid/grid-container-divider';
import LoadingWithTitle from '@/components/loading/loading-with-title';
import AutoCompleteSelect from '@/components/select/auto-complete-select';
import MultiSelect from '@/components/select/multi-select';
import { useProjectStore } from '@/hooks/store/use-project-store';
import { api } from '@/server/trpc/trpc.client';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import { StepperContext } from '../../_components/stepper';
import AddConceptDialog from './concept-hierarchy-dialog';
import PathAnalysisResult from './path-analysis-result';

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
  const setPaths = useProjectStore((state) => state.setPaths);

  const [conceptHierarchyDialogOpen, setConceptHierarchyDialogOpen] = useState(false);

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

      Object.keys(data).forEach((target) =>
        data[target].sort((a, b) => {
          return (
            b.samples[b.labels.findIndex((label) => label === target)] -
            a.samples[a.labels.findIndex((label) => label === target)]
          );
        })
      );

      console.log(data);
      setPaths(data);
    }
  };

  const options = useMemo(() => {
    return dataInfo && Object.keys(dataInfo.columns).filter((col) => dataInfo.columns[col].type === 'string');
  }, [dataInfo]);

  useEffect(() => {
    stepperContext.setIsLoading(analysis.isLoading);
  }, [stepperContext, analysis.isLoading, target]);

  return (
    <>
      <Grid container gap={4}>
        <Grid container>
          <Typography variant="h4">路徑分析設定</Typography>
        </Grid>

        <Grid container>
          <Typography variant="h5">分析目標 (必要)</Typography>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <AutoCompleteSelect
              required
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
          <Typography variant="h5">忽略值 (可選)</Typography>
        </Grid>

        <Grid container>
          <Typography color={theme.palette.info.main} variant="body1">
            選擇欄位中的值排除在分析之外。
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
                      <MultiSelect
                        label="忽略哪些值?"
                        onChange={(values) => setSkipValues({ ...skipValues, [col]: values })}
                      >
                        {dataInfo.columns[col].values as string[]}
                      </MultiSelect>
                    </Grid>
                  </Grid>
                );
              })}
        </Grid>

        <Grid container>
          <Typography variant="h5">層次概念 (可選)</Typography>
        </Grid>

        <Grid container>
          <Typography variant="body1" color={theme.palette.info.main}>
            為欄位中的值設定層次概念，歸類值到指定的層次概念中。
          </Typography>
        </Grid>

        {Object.keys(conceptHierarchy).length > 0 && (
          <Grid container>
            <Card>
              <CardContent>
                {Object.keys(conceptHierarchy).map((col, i) => {
                  return (
                    <Grid container key={`${col}-${i}`} gap={2}>
                      <Grid container gap={2}>
                        <Typography color={theme.palette.info.main}>{col}</Typography>
                        <Grid container>
                          {conceptHierarchy[col].order.map((tag, j) => {
                            return (
                              <Grid item xs={12} key={`${col}-${i}-${tag}-${j}`}>
                                <GridContainer>
                                  <Typography color={theme.palette.secondary.main}>{tag}</Typography>
                                </GridContainer>
                                <GridContainer>
                                  <Typography>{conceptHierarchy[col].hierarchy[tag].join(' ')}</Typography>
                                </GridContainer>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid container>
          <CardButton
            title="新增層次概念"
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
          <Button disabled={analysis.isLoading || !target} color="info" variant="contained" onClick={startAnalysis}>
            開始分析
          </Button>
        </Grid>

        {analysis.isLoading && <LoadingWithTitle>正在進行資料路徑分析...</LoadingWithTitle>}

        <PathAnalysisResult />

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
