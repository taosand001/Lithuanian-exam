import { PrismaClient } from '@prisma/client';

// Singleton Prisma client with connection retry for Supabase/pgBouncer
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Wraps a Prisma query with automatic retry on transient connection errors.
 * Supabase drops idle connections; Prisma's pool may have stale handles.
 * Retrying once with a fresh connection resolves the "transient" error.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 300
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isTransient =
        err instanceof Error &&
        (err.message.includes('P1001') ||   // Can't reach database
          err.message.includes('P1008') ||  // Operations timed out
          err.message.includes('P1017') ||  // Server closed connection
          err.message.includes('P2024') ||  // Timed out fetching connection
          err.message.includes('transient') ||
          err.message.includes('ECONNRESET') ||
          err.message.includes('Connection pool'));

      if (isTransient && attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * attempt));
        // Force a reconnect by disconnecting and letting Prisma re-establish
        await prisma.$disconnect().catch(() => {});
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
}
