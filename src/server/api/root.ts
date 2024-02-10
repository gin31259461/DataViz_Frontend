import { createTRPCRouter } from '@/server/api/trpc';
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
