import { env } from '@/env.mjs';
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaWriter: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaReader: PrismaClient | undefined;
}

export const prismaWriter =
  global.prismaWriter ||
  new PrismaClient({
    datasources: {
      db: {
        url: env.WRITER_URL,
      },
    },
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

export const prismaReader =
  global.prismaReader ||
  new PrismaClient({
    datasources: {
      db: {
        url: env.READER_URL,
      },
    },
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  global.prismaWriter = prismaWriter;
  global.prismaReader = prismaReader;
}
