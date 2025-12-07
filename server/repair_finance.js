const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('Repairing Financial Transactions...');

// Find transactions where description looks like a date (starts with 202)
const transactions = db.prepare('SELECT id, description, date FROM FinancialTransaction').all();

let repairedCount = 0;

transactions.forEach(t => {
    // Check if description matches date pattern ISO (e.g. 2025-12...)
    if (t.description.startsWith('202') && t.description.includes('T')) {
        console.log(`Fixing transaction ${t.id}...`);
        // Swap them
        const realDate = t.description;
        const realDesc = t.date;

        db.prepare('UPDATE FinancialTransaction SET date = ?, description = ? WHERE id = ?')
            .run(realDate, realDesc, t.id);

        repairedCount++;
    }
});

console.log(`Repaired ${repairedCount} transactions.`);
