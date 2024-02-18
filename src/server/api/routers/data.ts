import { bigIntToString } from '@/utils/string';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../../trpc/trpc.procedure';
import { ResponseScheme } from './response';

const DataZodSchema = z.object({
  id: z.number(),
  ownerID: z.nullable(z.number()),
  name: z.nullable(z.string()),
  description: z.nullable(z.string()),
  since: z.nullable(z.string()),
  lastModified: z.nullable(z.string()),
  frequency: z.number(),
});

const UploadDataZodSchema = z.object({
  name: z.string(),
  des: z.string(),
});

export type DataSchema = z.infer<typeof DataZodSchema>;

export const dataRouter = createTRPCRouter({
  getMemberDataCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.prismaReader.object.count({
      where: {
        OwnerMID: parseInt(ctx.session.user.id),
        Type: 6,
      },
    });
    return count;
  }),
  getManyMemberData: protectedProcedure
    .input(
      z.object({
        order: z.string(),
        start: z.number(),
        counts: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const data: DataSchema[] = await ctx.prismaReader.vd_Data.findMany({
        orderBy: {
          id: input.order as 'asc' | 'desc',
        },
        skip: Number(input.start) - 1,
        take: Number(input.counts),
        where: {
          ownerID: parseInt(ctx.session.user.id),
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
  getAllMemberData: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prismaReader.vd_Data.findMany({
      where: {
        ownerID: { equals: parseInt(ctx.session.user.id) },
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
  postData: protectedProcedure.input(UploadDataZodSchema).mutation(async ({ input, ctx }) => {
    const currentObject = await ctx.prismaWriter.object.create({
      data: {
        Type: 6,
        CName: input.name,
        CDes: input.des,
        nClick: 1,
        OwnerMID: parseInt(ctx.session.user.id),
        Data: { create: {} },
      },
      select: {
        OID: true,
      },
    });

    return { dataId: currentObject.OID };
  }),
  deleteData: protectedProcedure
    .input(
      z.object({
        oidS: z.array(z.number()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result: ResponseScheme = { message: '刪除資料成功' };

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
            OwnerMID: parseInt(ctx.session.user.id),
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

      return result;
    }),
});
