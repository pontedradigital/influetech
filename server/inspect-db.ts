
import { PrismaClient } from '@prisma/client';
import path from 'path';

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: `file:${dbPath}`
        }
    }
} as any);

async function inspectData() {
    console.log('--- Products ---');
    const products = await (prisma as any).product.findMany({
        select: { id: true, name: true, status: true, userId: true }
    });
    console.log(JSON.stringify(products, null, 2));

    console.log('\n--- Shipments ---');
    const shipments = await (prisma as any).shipment.findMany({
        select: { id: true, status: true, userId: true }
    });
    console.log(JSON.stringify(shipments, null, 2));
}

inspectData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
