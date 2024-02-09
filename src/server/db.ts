import { env } from '@/env.mjs';
import { Prisma, PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaWriter: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaReader: PrismaClient | undefined;
}

export const prismaMethod = {
  sql: Prisma.sql,
};

export const prismaWriter =
  global.prismaWriter ||
  new PrismaClient({
    datasources: {
      db: {
        url: 'sqlserver://10.21.24.190;database=DV;user=apiw;password=.apiw.;encrypt=true;trustServerCertificate=true;',
      },
    },
    log: ['query'],
  });

export const prismaReader =
  global.prismaReader ||
  new PrismaClient({
    datasources: {
      db: {
        url: 'sqlserver://10.21.24.190;database=DV;user=apir;password=.apir.;encrypt=true;trustServerCertificate=true;',
      },
    },
    log: ['query'],
  });

if (env.NODE_ENV !== 'production') {
  global.prismaWriter = prismaWriter;
  global.prismaReader = prismaReader;
}
