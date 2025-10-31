// apps/web/src/server/db/client.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Avoid multiple PrismaClient instances during hot-reload in development
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
