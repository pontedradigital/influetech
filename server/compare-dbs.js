const Database = require('better-sqlite3');
const path = require('path');

const dbRootPath = path.resolve(__dirname, 'dev.db');
const dbPrismaPath = path.resolve(__dirname, 'prisma/dev.db');

function countProducts(dbPath, label) {
    try {
        const db = new Database(dbPath, { readonly: true });
        // Check if Product table exists
        const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Product'").get();
        if (!tableCheck) {
            console.log(`${label}: Product table does not exist.`);
            return 0;
        }

        const count = db.prepare('SELECT COUNT(*) as count FROM Product').get();
        console.log(`${label}: ${count.count} products found.`);
        return count.count;
    } catch (error) {
        console.log(`${label}: Error - ${error.message}`);
        return 0;
    }
}

console.log('--- Checking Databases ---');
const rootCount = countProducts(dbRootPath, 'Root DB (server/dev.db)');
const prismaCount = countProducts(dbPrismaPath, 'Prisma DB (server/prisma/dev.db)');
