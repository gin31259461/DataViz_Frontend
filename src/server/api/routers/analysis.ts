import { env } from '@/env.mjs';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc/trpc.procedure';

const PathAnalysisRequestZodSchema = z.object({
  dataId: z.number(),
  target: z.string(),
  skip_features: z.unknown().optional(),
  skip_values: z.unknown().optional(),
  concept_hierarchy: z.unknown().optional(),
});

const ProcessPivotAnalysisRequestZodSchema = z.object({
  dataId: z.number(),
  target: z.string(),
  process: z.custom<(string | string[])[][]>(),
});

type ColumnType = 'number' | 'float' | 'string';

export type ColumnInfo = {
  type: ColumnType;
  values: number | string[];
};

export type DataInfoSchema = {
  info: {
    id: string;
    rows: number;
    name: string;
    des: string;
  };
  columns: {
    [key: string]: ColumnInfo;
  };
};

export const analysisRouter = createTRPCRouter({
  getDataInfo: publicProcedure.input(z.number().optional()).query(async ({ input }) => {
    let data: DataInfoSchema = { columns: {}, info: { id: '', rows: 0, name: '', des: '' } };

    if (!input) return data;

    const res = await fetch(`${env.FLASK_URL}/api/get_data_info?dataId=${input}`);
    data = await res.json();

    return data;
  }),
  getPathAnalysis: publicProcedure.input(PathAnalysisRequestZodSchema).query(async ({ input }) => {
    const res = await fetch(`${env.FLASK_URL}/api/path_analysis`, {
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(input),
      method: 'POST',
    });

    const data = await res.json();

    return data;
  }),
  getProcessPivotAnalysis: publicProcedure.input(ProcessPivotAnalysisRequestZodSchema).query(async ({ input }) => {
    const res = await fetch(`${env.FLASK_URL}/api/process_pivot_analysis`, {
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(input),
      method: 'POST',
    });

    const data = await res.json();

    return data;
  }),
});
