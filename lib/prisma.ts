import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
};

// Buat ulang client lama jika server development masih memakai schema sebelumnya.
const cachedPrisma = globalForPrisma.prismaGlobal;
export const prisma =
  cachedPrisma && typeof (cachedPrisma as { wishlist?: unknown }).wishlist !== "undefined"
    ? cachedPrisma
    : prismaClientSingleton();

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prismaGlobal = prisma;
