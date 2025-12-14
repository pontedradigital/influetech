const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
console.log('Opening database at:', dbPath);

try {
    const db = new Database(dbPath);

    const columns = ['weight', 'height', 'width', 'length'];

    columns.forEach(col => {
        try {
            console.log(`Adding column ${col}...`);
            db.prepare(`ALTER TABLE Product ADD COLUMN ${col} REAL`).run();
            console.log(`Added ${col} column.`);
        } catch (e) {
            console.log(`${col} column likely exists or error:`, e.message);
        }
    });

    console.log('Product schema update completed!');

} catch (error) {
    console.error('Database Error:', error.message);
}
