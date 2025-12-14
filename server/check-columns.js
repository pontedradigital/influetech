const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
console.log('Opening database at:', dbPath);

try {
    const db = new Database(dbPath);
    const columns = db.prepare('PRAGMA table_info(Product)').all();
    console.log('Columns in Product table:');
    columns.forEach(col => console.log(col.name, col.type));
} catch (error) {
    console.error('Error:', error.message);
}
