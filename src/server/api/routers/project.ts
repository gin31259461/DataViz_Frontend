import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

const ProjectZodSchema = z.object({
  id: z.number(),
  title: z.string(),
  des: z.string(),
  path: z.string(),
  since: z.date(),
  lastModifiedDT: z.date(),
});

const ArgZodSchema = z.object({
  dataId: z.number(),
  chartType: z.string(),
  dataArgs: z.any(),
  chartArgs: z.any(),
});

export type ProjectSchema = z.infer<typeof ProjectZodSchema>;
export type ArgSchema = z.infer<typeof ArgZodSchema>;

export const projectRouter = createTRPCRouter({
  createArg: publicProcedure
    .input(
      z.object({
        mid: z.number(),
        title: z.string(),
        des: z.string(),
        dataId: z.number(),
        args: ArgZodSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prismaWriter
        .$executeRaw`exec xp_insertProjectClass ${input.mid}, ${input.title}, ${input.des}`;
      const result: { last: number }[] = await ctx.prismaWriter
        .$queryRaw`select IDENT_CURRENT('Class') as last`;
      const currentCID = result[0].last;

      const count = await ctx.prismaWriter.cO.count({
        where: { CID: currentCID },
      });

      await ctx.prismaWriter.object.create({
        data: {
          CDes: JSON.stringify(input.args),
          EName: input.title,
          EDes: input.des,
          OwnerMID: input.mid,
          Type: 7,
          ORel_ORel_OID1ToObject: {
            create: { OID2: input.dataId },
          },
          CO: {
            create: {
              CID: currentCID,
              Rank: count + 1,
            },
          },
        },
      });
    }),
  getLastProjectId: publicProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const member = await ctx.prismaWriter.member.findFirst({
        select: {
          Account: true,
        },
        where: {
          MID: input,
        },
      });

      if (member) {
        const sqlStr = `select top 1 id from vd_project_${member.Account} order by id desc`;
        const data: ProjectSchema[] = await ctx.prismaWriter
          .$queryRaw`exec sp_executesql ${sqlStr}`;
        return data.length > 0 ? data[0].id : null;
      }

      return null;
    }),
  getAllProjects: publicProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const member = await ctx.prismaWriter.member.findFirst({
        select: {
          Account: true,
        },
        where: {
          MID: input,
        },
      });

      if (member) {
        const sqlStr = `select * from vd_project_${member.Account} order by id desc`;
        const data: ProjectSchema[] = await ctx.prismaWriter
          .$queryRaw`exec sp_executesql ${sqlStr}`;
        return data;
      }

      return null;
    }),
  getProjectObservations: publicProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const data = await ctx.prismaWriter.inheritance.findMany({
        select: {
          Class_Inheritance_CCIDToClass: true,
        },
        where: {
          PCID: input,
        },
      });

      return data.map((d) => d.Class_Inheritance_CCIDToClass);
    }),
  getArgFromObservation: publicProcedure
    .input(z.number().optional())
    .query(async ({ input, ctx }) => {
      if (!input) return null;

      const data = await ctx.prismaWriter.cO.findMany({
        select: { Object: true },
        where: { CID: input },
      });
      return data.map((d) => d.Object);
    }),
  deleteProject: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const observations = await ctx.prismaWriter.inheritance.findMany({
        select: {
          CCID: true,
        },
        where: {
          PCID: input,
        },
      });

      for (let i = 0; i < observations.length; i++) {
        const args = await ctx.prismaWriter.cO.findMany({
          select: { OID: true },
          where: { CID: observations[i].CCID },
        });
        const oidS = args.map((a) => a.OID);
        await ctx.prismaWriter.cO.deleteMany({
          where: { OID: { in: oidS } },
        });
        await ctx.prismaWriter.oRel.deleteMany({
          where: { OID1: { in: oidS } },
        });
        await ctx.prismaWriter.object.deleteMany({
          where: { OID: { in: oidS } },
        });
      }

      const cidS = observations.map((o) => o.CCID);

      await ctx.prismaWriter.inheritance.deleteMany({
        where: { CCID: { in: cidS } },
      });
      await ctx.prismaWriter.class.deleteMany({
        where: { CID: { in: cidS } },
      });

      await ctx.prismaWriter.inheritance.deleteMany({
        where: {
          CCID: input,
        },
      });
      await ctx.prismaWriter.class.delete({
        where: {
          CID: input,
        },
      });
    }),
});
