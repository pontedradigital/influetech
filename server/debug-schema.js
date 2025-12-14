const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
console.log('Opening database at:', dbPath);

try {
    const db = new Database(dbPath, { readonly: true });

    console.log('\n--- Checking Tables ---');
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = tables.map(t => t.name);
    console.log('Tables found:', tableNames.join(', '));

    const checkTable = (tableName) => {
        if (!tableNames.includes(tableName)) {
            console.log(`\n!!! MISSING TABLE: ${tableName} !!!`);
            return;
        }
        console.log(`\n--- Columns for ${tableName} ---`);
        const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
        columns.forEach(c => console.log(`${c.cid}: ${c.name} (${c.type})`));
    };

    checkTable('FinancialGoal');
    checkTable('RecurringExpense');
    checkTable('FinancialTransaction');

} catch (error) {
    console.error('Database Error:', error.message);
}
