const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('--- Applying User Address Schema Migration ---');

try {
    const columnsToAdd = [
        { name: 'cep', type: 'TEXT' },
        { name: 'street', type: 'TEXT' },
        { name: 'number', type: 'TEXT' },
        { name: 'complement', type: 'TEXT' },
        { name: 'neighborhood', type: 'TEXT' },
        { name: 'city', type: 'TEXT' },
        { name: 'state', type: 'TEXT' },
        { name: 'cpfCnpj', type: 'TEXT' }
    ];

    const currentColumns = db.prepare("PRAGMA table_info(User)").all().map(c => c.name);

    db.transaction(() => {
        for (const col of columnsToAdd) {
            if (!currentColumns.includes(col.name)) {
                console.log(`Adding column: ${col.name}`);
                db.prepare(`ALTER TABLE User ADD COLUMN ${col.name} ${col.type}`).run();
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        }
    })();

    console.log('Migration completed successfully.');

} catch (error) {
    console.error('Migration failed:', error);
}
