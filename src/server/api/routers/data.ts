import { bigIntToString } from '@/lib/toString';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const dataObjectRouter = createTRPCRouter({
  getMemberDataCount: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const count = await ctx.prisma.object.count({
      where: {
        OwnerMID: { equals: input },
        Type: 6,
      },
    });
    return count;
  }),
  getSomeMemberData: publicProcedure
    .input(z.object({ order: z.string(), start: z.number(), counts: z.number(), mid: z.number() }))
    .query(async ({ input, ctx }) => {
      const data = await ctx.prisma.vd_Data.findMany({
        orderBy: {
          id: input.order as 'asc' | 'desc',
        },
        skip: Number(input.start) - 1,
        take: Number(input.counts),
        where: {
          ownerID: input.mid,
        },
      });
      return data;
    }),
  getAllMemberData: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const result = await ctx.prisma.vd_Data.findMany({
      where: {
        ownerID: { equals: input },
      },
    });
    return result;
  }),
  getTop100FromDataTable: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (input === undefined) return [];

    const sqlStr = `SELECT TOP 100 * FROM [RawDB].[dbo].[D${input}]`;
    const data: Object[] = await ctx.prisma.$queryRaw`exec sp_executesql ${sqlStr}`;
    const convertedData = data.map((obj) => bigIntToString(obj));
    return convertedData;
  }),
  getAllFromDataTable: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (input === undefined) return [];

    const sqlStr = `SELECT * FROM [RawDB].[dbo].[D${input}]`;
    const data: Object[] = await ctx.prisma.$queryRaw`exec sp_executesql ${sqlStr}`;
    const convertedData: { [index: string]: any }[] = data.map<object>((obj) => bigIntToString(obj));
    return convertedData;
  }),
  getRowsCountFromDataTable: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (input === undefined) return 0;

    const sqlStr = `SELECT count(*) AS count FROM [RawDB].[dbo].[D${input}]`;
    const result: { count: number }[] = await ctx.prisma.$queryRaw`exec sp_executesql ${sqlStr}`;
    return result[0].count;
  }),
  getObjectLastID: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const result: { last: number }[] = await ctx.prisma.$queryRaw`select IDENT_CURRENT('Object') as last`;
    return result[0].last;
  }),
  postData: publicProcedure
    .input(z.object({ mid: z.number(), name: z.string(), des: z.string() }))
    .mutation(async ({ input, ctx }) => {
      let lastID = null;
      await ctx.prisma.$executeRaw`exec dbo.xp_postData ${input.mid}, ${input.name}, ${input.des}, ${lastID} output`;
    }),
  deleteData: publicProcedure.input(z.object({ mid: z.number(), oid: z.number() })).mutation(async ({ input, ctx }) => {
    await ctx.prisma.$executeRaw`exec [dbo].[xp_deleteData] ${input.mid}, ${input.oid}`;
  }),
});
