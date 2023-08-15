'use client';

import LoadingWithTitle from '@/components/Loading/LoadingWithTitle';
import { useProjectStore } from '@/hooks/store/useProjectStore';
import { roundNumberToDecimalPlaces } from '@/lib/math';
import { DecisionTreeGraph, parsePath } from '@/utils/parsePath';
import { FormControlLabel, Radio } from '@mui/material';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import PathTable from './PathTable';

interface PathAnalysisProps {
  server: string;
}

export default function PathAnalysis({ server }: PathAnalysisProps) {
  const [graph, setGraph] = useState<DecisionTreeGraph | null>(null);
  const paths = parsePath(graph).sort((a, b) => a.path.length - b.path.length);
  const setPathID = useProjectStore((state) => state.setPathID);
  const setPath = useProjectStore((state) => state.setPath);
  const selectedPathID = useProjectStore((state) => state.selectedPathID);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const target = useProjectStore((state) => state.target);
  const features = useProjectStore((state) => state.features);

  const [ratioChecked, setRatioChecked] = useState<string | undefined>(selectedPathID);

  useEffect(() => {
    if (selectedDataOID && target && features)
      axios
        .get(server, {
          params: {
            oid: selectedDataOID,
            target: target,
            features: features.join(','),
          },
        })
        .then((result) => {
          setGraph(result.data);
        });
  }, [selectedDataOID, target, features]);

  const handleRatioChange = (value: string, event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setRatioChecked(value);
      setPathID(value);
      setPath(paths[Number(value)]);
    }
  };

  const columns = ['ID', '路徑長度', '目標分布 (低)', '目標分布 (中間)', '目標分布 (高)', '選擇路徑'];

  const rows = paths.map((o, i) => {
    return [
      i,
      o.path.length,
      roundNumberToDecimalPlaces(o.targetValueDistribution.low, 2) * 100,
      roundNumberToDecimalPlaces(o.targetValueDistribution.medium, 2) * 100,
      roundNumberToDecimalPlaces(o.targetValueDistribution.high, 2) * 100,
      <FormControlLabel
        key={i}
        control={
          <Radio
            onChange={(event, checked) => handleRatioChange(i.toString(), event, checked)}
            checked={ratioChecked == i.toString()}
            color="info"
          />
        }
        label=""
      ></FormControlLabel>,
    ];
  });

  return !graph ? (
    <LoadingWithTitle title="Analyzing path" />
  ) : (
    <PathTable columns={columns} rows={rows} paths={paths}></PathTable>
  );
}
