'use server';

import { env } from '@/env.mjs';

export const getDataInfo = async (dataId: string) => {
  'use server';

  const res = await fetch(`${env.FLASK_URL}/api/get_data_info?dataId=${dataId}`);

  const data = await res.json();

  return data;
};

export interface PathAnalysisRequestParams {
  dataId: string;
  target: string;
  skip_features?: object;
  skip_values?: object;
  concept_hierarchy?: object;
}

export const getPathAnalysis = async (reqData: PathAnalysisRequestParams) => {
  'use server';

  const res = await fetch(`${env.FLASK_URL}/api/path_analysis`, {
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(reqData),
    method: 'POST',
  });

  const data = await res.json();

  return data;
};

export interface ProcessAnalysisRequestParams {
  dataId: string;
  target: string;
  process: (string | string[])[][];
}

export const getProcessAnalysis = async (reqData: ProcessAnalysisRequestParams) => {
  'use server';

  const res = await fetch(`${env.FLASK_URL}/api/process_pivot_analysis`, {
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(reqData),
    method: 'POST',
  });

  const data = await res.json();

  return data;
};
