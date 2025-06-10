import { PrismaClient } from '@prisma/client';

declare global {
  // Evita la creazione multipla del client durante l'hot reload
  var prisma: PrismaClient | undefined;
}

export const clientPrisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = clientPrisma;


