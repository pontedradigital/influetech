const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath, { readonly: true });

try {
    const row = db.prepare("SELECT sql FROM sqlite_master WHERE name='Shipment'").get();
    console.log('--- Shipment Table SQL ---');
    console.log(row.sql);
} catch (error) {
    console.error('Error:', error);
}
