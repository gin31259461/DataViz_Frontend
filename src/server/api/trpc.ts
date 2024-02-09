import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prismaReader, prismaWriter } from '../db';

export const createContext = async (opts?: trpcNext.CreateNextContextOptions) => {
  const req = opts?.req;
  const res = opts?.res;

  return {
    req,
    res,
    prismaWriter: prismaWriter,
    prismaReader: prismaReader,
  };
};

type Context = inferAsyncReturnType<typeof createContext>;

export const createTRPCContext = async (/*opts: FetchCreateContextFnOptions*/) => {
  return createContext();
};

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
