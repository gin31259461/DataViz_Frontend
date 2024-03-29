import { ChartCategories } from '@/components/chart';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../../trpc/trpc.procedure';

const ProjectZodSchema = z.object({
  id: z.number(),
  title: z.string(),
  des: z.string(),
  type: z.string(),
  path: z.string(),
  since: z.string(),
  lastModifiedDT: z.string(),
});

export type ArgSchema<T, U> = {
  dataId: number;
  chartType: ChartCategories[];
  dataArgs: T;
  chartArgs: U;
};

const ArgZodSchema = z.custom<ArgSchema<unknown, unknown>>();

const EditProjectRequestZodSchema = z.object({
  id: z.number(),
  name: z.string(),
  des: z.string(),
});

export type ProjectCategories = 'racing-chart' | 'path-analysis';
export type ProjectSchema = z.infer<typeof ProjectZodSchema>;
export type EditProjectRequestSchema = z.infer<typeof EditProjectRequestZodSchema>;

export const projectRouter = createTRPCRouter({
  createArg: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        des: z.string(),
        dataId: z.number(),
        type: z.custom<ProjectCategories>(),
        args: ArgZodSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prismaWriter
        .$executeRaw`exec xp_insertProjectClass ${ctx.session.user.id}, ${input.title}, ${input.des}, ${input.type}`;
      const result: { last: number }[] = await ctx.prismaWriter.$queryRaw`select IDENT_CURRENT('Class') as last`;
      const currentCID = result[0].last;

      const count = await ctx.prismaWriter.cO.count({
        where: { CID: currentCID },
      });

      await ctx.prismaWriter.object.create({
        data: {
          CDes: JSON.stringify(input.args),
          EName: input.title,
          EDes: input.des,
          OwnerMID: parseInt(ctx.session.user.id),
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

      const member = await ctx.prismaReader.member.findFirst({
        select: {
          Account: true,
        },
        where: {
          MID: parseInt(ctx.session.user.id),
        },
      });

      if (member) {
        const sqlStr = `select top 1 id from vd_project_${member.Account} order by id desc`;
        const data: ProjectSchema[] = await ctx.prismaReader.$queryRaw`exec sp_executesql ${sqlStr}`;
        return data.length > 0 ? data[0].id : undefined;
      }

      return undefined;
    }),
  getLastProjectId: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (!input) return null;

    const member = await ctx.prismaReader.member.findFirst({
      select: {
        Account: true,
      },
      where: {
        MID: input,
      },
    });

    if (member) {
      const sqlStr = `select top 1 id from vd_project_${member.Account} order by id desc`;
      const data: ProjectSchema[] = await ctx.prismaReader.$queryRaw`exec sp_executesql ${sqlStr}`;
      return data.length > 0 ? data[0].id : null;
    }

    return null;
  }),
  getAllProject: protectedProcedure.query(async ({ ctx }) => {
    let data: ProjectSchema[] = [];

    const member = await ctx.prismaReader.member.findFirst({
      select: {
        Account: true,
      },
      where: {
        MID: parseInt(ctx.session.user.id),
      },
    });

    if (member) {
      const sqlStr = `select * from vd_project_${member.Account} order by id desc`;
      data = await ctx.prismaReader.$queryRaw`exec sp_executesql ${sqlStr}`;
    }

    return data;
  }),
  getProjectObservations: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const data = await ctx.prismaReader.inheritance.findMany({
      select: {
        Class_Inheritance_CCIDToClass: true,
      },
      where: {
        PCID: input,
      },
    });

    return data.map((d) => d.Class_Inheritance_CCIDToClass);
  }),
  getArgsFromObservations: publicProcedure.input(z.array(z.number()).optional()).query(async ({ input, ctx }) => {
    if (!input) return null;

    const data = await ctx.prismaReader.cO.findMany({
      select: { Object: true },
      where: { CID: { in: input } },
    });
    return data.map((d) => d.Object);
  }),
  editProject: publicProcedure.input(EditProjectRequestZodSchema).mutation(async ({ input, ctx }) => {
    await ctx.prismaWriter.class.update({
      data: {
        EName: input.name,
        EDes: input.des,
      },
      where: {
        CID: input.id,
      },
    });
  }),
  deleteProject: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const observations = await ctx.prismaReader.inheritance.findMany({
      select: {
        CCID: true,
      },
      where: {
        PCID: input,
      },
    });

    for (let i = 0; i < observations.length; i++) {
      const args = await ctx.prismaReader.cO.findMany({
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
