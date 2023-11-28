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
  dataArgs: z.object({}),
  chartArgs: z.object({}),
});

export type ProjectSchema = z.infer<typeof ProjectZodSchema>;
export type ArgSchema = z.infer<typeof ArgZodSchema>;

export const projectRouter = createTRPCRouter({
  createArg: publicProcedure
    .input(z.object({ mid: z.number(), title: z.string(), des: z.string(), args: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.$executeRaw`exec xp_insertProjectClass ${input.mid}, ${input.title}, ${input.des}`;
      const result: { last: number }[] = await ctx.prisma.$queryRaw`select IDENT_CURRENT('Class') as last`;
      const currentCID = result[0].last;

      const count = await ctx.prisma.cO.count({
        where: { CID: currentCID },
      });

      await ctx.prisma.object.create({
        data: {
          CDes: input.args,
          EName: input.title,
          EDes: input.des,
          Type: 7,
          CO: {
            create: {
              CID: currentCID,
              Rank: count + 1,
            },
          },
        },
      });
    }),
  getLastProjectId: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const member = await ctx.prisma.member.findFirst({
      select: {
        Account: true,
      },
      where: {
        MID: input,
      },
    });

    if (member) {
      const sqlStr = `select top 1 id from vd_project_${member.Account} order by id desc`;
      const data: ProjectSchema[] = await ctx.prisma.$queryRaw`exec sp_executesql ${sqlStr}`;
      return data.length > 0 ? data[0].id : null;
    }

    return null;
  }),
  getAllProjects: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const member = await ctx.prisma.member.findFirst({
      select: {
        Account: true,
      },
      where: {
        MID: input,
      },
    });

    if (member) {
      const sqlStr = `select * from vd_project_${member.Account} order by id desc`;
      const data: ProjectSchema[] = await ctx.prisma.$queryRaw`exec sp_executesql ${sqlStr}`;
      return data;
    }

    return null;
  }),
  getProjectObservations: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const data = await ctx.prisma.inheritance.findMany({
      select: {
        Class_Inheritance_CCIDToClass: true,
      },
      where: {
        PCID: input,
      },
    });

    return data.map((d) => d.Class_Inheritance_CCIDToClass);
  }),
  getArgFromObservation: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (!input) return null;

    const data = await ctx.prisma.cO.findMany({ select: { Object: true }, where: { CID: input } });
    return data.map((d) => d.Object);
  }),
  deleteProject: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const observations = await ctx.prisma.inheritance.findMany({
      select: {
        CCID: true,
      },
      where: {
        PCID: input,
      },
    });

    for (let i = 0; i < observations.length; i++) {
      const args = await ctx.prisma.cO.findMany({ select: { OID: true }, where: { CID: observations[i].CCID } });
      const oidS = args.map((a) => a.OID);
      await ctx.prisma.cO.deleteMany({ where: { OID: { in: oidS } } });
      await ctx.prisma.object.deleteMany({ where: { OID: { in: oidS } } });
    }

    const cidS = observations.map((o) => o.CCID);

    await ctx.prisma.inheritance.deleteMany({ where: { CCID: { in: cidS } } });
    await ctx.prisma.class.deleteMany({ where: { CID: { in: cidS } } });

    await ctx.prisma.inheritance.deleteMany({
      where: {
        CCID: input,
      },
    });
    await ctx.prisma.class.delete({
      where: {
        CID: input,
      },
    });
  }),
});
