import { env } from '@/env.mjs';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

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

export const analysisRouter = createTRPCRouter({
  getDataInfo: publicProcedure.input(z.number().optional()).query(async ({ input }) => {
    if (!input) return {};

    const res = await fetch(`${env.FLASK_URL}/api/get_data_info?dataId=${input}`);
    const data = await res.json();
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
