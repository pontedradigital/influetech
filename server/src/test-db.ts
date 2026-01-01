
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing connection...');
        const count = await prisma.insight.count();
        console.log(`Successfully connected! Insight count: ${count}`);
        // Also check User table just in case
        const userCount = await prisma.user.count();
        console.log(`User count: ${userCount}`);
    } catch (e) {
        console.error('Connection failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
