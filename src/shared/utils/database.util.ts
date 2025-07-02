import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Gracefully disconnect when app terminates
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});