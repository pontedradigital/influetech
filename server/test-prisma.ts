
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Construct absolute path to dev.db (assuming server/prisma/dev.db)
const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const dbUrl = `file:${dbPath}`;
console.log('Target DB URL:', dbUrl);

try {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: dbUrl
            }
        }
    } as any);
    console.log('Prisma initialized successfully');

    prisma.$connect().then(() => {
        console.log('Prisma connected successfully');
        process.exit(0);
    }).catch((e) => {
        console.error('Prisma connection failed:', e);
        process.exit(1);
    });

} catch (e) {
    console.error('Prisma initialization failed:', e);
    process.exit(1);
}
