import { createTRPCRouter } from '@/server/trpc/trpc.procedure';
import { analysisRouter } from './routers/analysis';
import { dataRouter } from './routers/data';
import { userRouter } from './routers/member';
import { projectRouter } from './routers/project';

export const appRouter = createTRPCRouter({
  data: dataRouter,
  user: userRouter,
  project: projectRouter,
  analysis: analysisRouter,
});

export type AppRouter = typeof appRouter;
