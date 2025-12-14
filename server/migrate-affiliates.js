const db = require('better-sqlite3')('prisma/dev.db');

const createPlatformTable = `
CREATE TABLE IF NOT EXISTS "AffiliatePlatform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "paymentTermDays" INTEGER NOT NULL DEFAULT 30,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
`;

const createEarningTable = `
CREATE TABLE IF NOT EXISTS "AffiliateEarning" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "requestDate" DATETIME NOT NULL,
    "receiptDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AffiliateEarning_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "AffiliatePlatform" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
`;

try {
    db.prepare(createPlatformTable).run();
    console.log('Created AffiliatePlatform table.');

    db.prepare(createEarningTable).run();
    console.log('Created AffiliateEarning table.');
} catch (error) {
    console.error('Migration failed:', error);
}
