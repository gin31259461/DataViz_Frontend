import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const projectRouter = createTRPCRouter({
  getProject: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const member = await ctx.prisma.member.findFirst({
      select: {
        Account: true,
      },
      where: {
        MID: input,
      },
    });

    if (member) {
      const sqlStr = `select * from vd_project_${member.Account}`;
      const data = await ctx.prisma.$queryRaw`exec sp_executesql ${sqlStr}`;
      return data;
    }

    return [];
  }),
});
