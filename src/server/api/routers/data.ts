import { bigIntToString } from '@/utils/string';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

const DataZodSchema = z.object({
  id: z.number(),
  ownerID: z.nullable(z.number()),
  name: z.nullable(z.string()),
  description: z.nullable(z.string()),
  since: z.nullable(z.string()),
  lastModified: z.nullable(z.string()),
  frequency: z.number(),
});

export type DataSchema = z.infer<typeof DataZodSchema>;

export const dataRouter = createTRPCRouter({
  getMemberDataCount: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (!input) return 0;

    const count = await ctx.prismaReader.object.count({
      where: {
        OwnerMID: input,
        Type: 6,
      },
    });
    return count;
  }),
  getManyMemberData: publicProcedure
    .input(
      z.object({
        order: z.string(),
        start: z.number(),
        counts: z.number(),
        mid: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!input) return [];

      const data: DataSchema[] = await ctx.prismaReader.vd_Data.findMany({
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
  getFirstMemberData: publicProcedure.input(z.number().nullish()).query(async ({ input, ctx }) => {
    if (!input) return null;

    const data = await ctx.prismaReader.vd_Data.findFirst({
      where: {
        id: input,
      },
    });
    return data;
  }),
  getAllMemberData: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (!input) return [];

    const result = await ctx.prismaReader.vd_Data.findMany({
      where: {
        ownerID: { equals: input },
      },
    });
    return result;
  }),
  getTop100ContentFromDataTable: publicProcedure.input(z.number().nullish()).query(async ({ input, ctx }) => {
    if (!input) return [];

    const sqlStr = `SELECT TOP 100 * FROM [RawDB].[dbo].[D${input}]`;
    const data: object[] = await ctx.prismaReader.$queryRaw`exec sp_executesql ${sqlStr}`;
    const convertedData = data.map((obj) => bigIntToString(obj));
    return convertedData;
  }),
  getContentFromDataTable: publicProcedure.input(z.number().nullish()).query(async ({ input, ctx }) => {
    if (!input) return [];

    const sqlStr = `SELECT * FROM [RawDB].[dbo].[D${input}]`;
    const data: object[] = await ctx.prismaReader.$queryRaw`exec sp_executesql ${sqlStr}`;
    const convertedData: { [index: string]: any }[] = data.map<object>((obj) => bigIntToString(obj));
    return convertedData;
  }),
  getCountFromDataTable: publicProcedure.input(z.number().nullish()).query(async ({ input, ctx }) => {
    if (!input) return 0;

    const sqlStr = `SELECT count(*) AS count FROM [RawDB].[dbo].[D${input}]`;
    const result: { count: number }[] = await ctx.prismaReader.$queryRaw`exec sp_executesql ${sqlStr}`;
    return result[0].count;
  }),
  getCurrentObjectId: publicProcedure.query(async ({ ctx }) => {
    const result: { last: number }[] = await ctx.prismaReader.$queryRaw`select IDENT_CURRENT('Object') as last`;
    return result[0].last;
  }),
  postData: publicProcedure
    .input(
      z.object({
        mid: z.number().optional(),
        name: z.string(),
        des: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!input.mid) return;

      await ctx.prismaWriter.object.create({
        data: {
          Type: 6,
          CName: input.name,
          CDes: input.des,
          nClick: 1,
          OwnerMID: input.mid,
          Data: { create: {} },
        },
        select: {
          OID: true,
        },
      });
    }),
  deleteData: publicProcedure
    .input(
      z.object({
        mid: z.number().optional(),
        oidS: z.array(z.number()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!input.mid) return;

      const dataUsedCount = await ctx.prismaReader.oRel.count({
        where: {
          OID2: {
            in: input.oidS,
          },
        },
      });

      if (dataUsedCount === 0) {
        await ctx.prismaWriter.data.deleteMany({
          where: {
            DID: {
              in: input.oidS,
            },
          },
        });
        await ctx.prismaWriter.object.deleteMany({
          where: {
            OID: {
              in: input.oidS,
            },
            OwnerMID: input.mid,
            Type: 6,
          },
        });

        for (const oid of input.oidS) {
          const sqlStr = `drop table [RawDB].[dbo].[D${oid}]`;
          await ctx.prismaWriter.$executeRaw`exec sp_executesql ${sqlStr}`;
        }
      } else {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'There has some data are used in the project',
        });
      }
    }),
});
