import { createTRPCRouter } from '@/server/api/trpc';
import { dataObjectRouter } from './routers/data';
import { userRouter } from './routers/member';
import { projectRouter } from './routers/project';

export const appRouter = createTRPCRouter({
  dataObject: dataObjectRouter,
  user: userRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
