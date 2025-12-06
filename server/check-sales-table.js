const Database = require('better-sqlite3');
const db = new Database('./prisma/dev.db');

try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('Sale', 'User', 'Product')").all();
    console.log('Tables found:', JSON.stringify(tables, null, 2));

    if (tables.some(t => t.name === 'Sale')) {
        const info = db.prepare("PRAGMA table_info(Sale)").all();
        console.log('Sale table schema:', JSON.stringify(info, null, 2));
    }
} catch (error) {
    console.error('Error:', error.message);
}
