import { createTRPCRouter } from '@/server/api/trpc';
import { analysisRouter } from './routers/analysis';
import { dataObjectRouter } from './routers/data';
import { userRouter } from './routers/member';

export const appRouter = createTRPCRouter({
  dataObject: dataObjectRouter,
  analysis: analysisRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
