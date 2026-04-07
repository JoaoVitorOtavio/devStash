import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma/client';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Neon adapter is only for neon:// or postgres:// urls
  // If we are using Prisma Postgres (prisma+postgres://), we don't need the adapter
  // But the spec says "Use Neon PostgreSQL (serverless)" and "Neon Adapter" is recommended in the research
  
  const isPrismaPostgres = connectionString.startsWith('prisma+postgres://');

  if (isPrismaPostgres) {
    return new PrismaClient({ accelerateUrl: connectionString });
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
