import { initTRPC, TRPCError } from '@trpc/server';
import { Session } from 'next-auth';
import { ZodError } from 'zod';
import { prismaReader, prismaWriter } from '../db';
import { transformer } from './shared';

export const createTRPCContext = async (opt: { headers: Headers; session?: Session | null }) => {
  return {
    ...opt,
    prismaReader,
    prismaWriter,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
