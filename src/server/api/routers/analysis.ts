import { BarGraphDataInstance } from '@/components/chart/bar-graph';
import { CircleGraphDataInstance } from '@/components/chart/circle-graph';
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

export type ColumnInfo =
  | {
      type: 'number' | 'float';
      values: number;
    }
  | {
      type: 'string';
      values: string[];
    };

export type DataInfoSchema = {
  info: {
    id: string;
    rows: number;
    name: string;
    des: string;
  };
  columns: Record<string, ColumnInfo>;
};

export type ProcessInstance = [string, string[]];

export type PathInstanceScheme = {
  class: string;
  entropy: number;
  features: { [k: string]: string[] };
  labels: string[];
  process: ProcessInstance[];
  samples: number[];
  target: string;
};

export type PathAnalysisResultSchema = Record<string, PathInstanceScheme[]>;
export type PathAnalysisDataArgs = { path: PathInstanceScheme; process: ProcessPivotAnalysisResultInstanceSchema[] };

export type ProcessPivotAnalysisResultInstanceSchema = {
  split_feature: string;
  chart_data: {
    before_split_count: BarGraphDataInstance[];
    before_split_rate: CircleGraphDataInstance[];
    after_split_count: BarGraphDataInstance[];
    after_split_rate: CircleGraphDataInstance[];
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
  getPathAnalysis: publicProcedure.input(PathAnalysisRequestZodSchema).mutation(async ({ input }) => {
    const res = await fetch(`${env.FLASK_URL}/api/path_analysis`, {
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(input),
      method: 'POST',
    });

    const data: PathAnalysisResultSchema = await res.json();

    return data;
  }),
  getProcessPivotAnalysis: publicProcedure
    .input(ProcessPivotAnalysisRequestZodSchema.optional())
    .query(async ({ input }) => {
      if (!input) return [];

      const res = await fetch(`${env.FLASK_URL}/api/process_pivot_analysis`, {
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(input),
        method: 'POST',
      });

      const data: ProcessPivotAnalysisResultInstanceSchema[] = await res.json();

      return data;
    }),
});
