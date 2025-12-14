const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
console.log('Opening database at:', dbPath);

try {
    const db = new Database(dbPath);

    console.log('Creating FinancialGoal table...');
    db.prepare(`
        CREATE TABLE IF NOT EXISTS "FinancialGoal" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "targetAmount" DECIMAL NOT NULL,
            "currentAmount" DECIMAL NOT NULL DEFAULT 0,
            "deadline" DATETIME,
            "status" TEXT NOT NULL DEFAULT 'ACTIVE',
            "color" TEXT,
            "icon" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
        )
    `).run();

    console.log('Creating RecurringExpense table...');
    db.prepare(`
        CREATE TABLE IF NOT EXISTS "RecurringExpense" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "amount" DECIMAL NOT NULL,
            "currency" TEXT NOT NULL DEFAULT 'BRL',
            "frequency" TEXT NOT NULL DEFAULT 'MONTHLY',
            "category" TEXT NOT NULL,
            "active" INTEGER NOT NULL DEFAULT 1,
            "nextDueDate" DATETIME,
            "autoRenew" INTEGER NOT NULL DEFAULT 1,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
        )
    `).run();

    console.log('Tables created successfully!');

} catch (error) {
    console.error('Database Error:', error.message);
}
