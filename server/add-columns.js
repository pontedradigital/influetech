const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
console.log('Opening database at:', dbPath);

try {
    const db = new Database(dbPath);

    console.log('Adding relatedId and relatedType columns...');

    try {
        db.prepare('ALTER TABLE FinancialTransaction ADD COLUMN relatedId TEXT').run();
        console.log('Added relatedId column.');
    } catch (e) {
        console.log('relatedId column likely exists or error:', e.message);
    }

    try {
        db.prepare('ALTER TABLE FinancialTransaction ADD COLUMN relatedType TEXT').run();
        console.log('Added relatedType column.');
    } catch (e) {
        console.log('relatedType column likely exists or error:', e.message);
    }

    console.log('Schema update completed!');

} catch (error) {
    console.error('Database Error:', error.message);
}
