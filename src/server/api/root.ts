import { createTRPCRouter } from '@/server/api/trpc';
import { dataObjectRouter } from './routers/data';
import { userRouter } from './routers/member';

export const appRouter = createTRPCRouter({
  dataObject: dataObjectRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
