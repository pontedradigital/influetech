const Database = require('better-sqlite3');
const path = require('path');

// Adjust path to your dev.db
const dbPath = path.resolve(__dirname, 'server/prisma/dev.db');
console.log('Opening database at:', dbPath);

try {
    const db = new Database(dbPath, { readonly: true });

    console.log('\n--- Tables ---');
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log(tables.map(t => t.name).join(', '));

    const checkTable = (tableName) => {
        console.log(`\n--- Schema for ${tableName} ---`);
        try {
            const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
            console.table(columns);
        } catch (e) {
            console.log(`Table ${tableName} does not exist or error:`, e.message);
        }
    };

    checkTable('FinancialGoal');
    checkTable('RecurringExpense');
    checkTable('FinancialTransaction');

} catch (error) {
    console.error('Database Error:', error.message);
}
