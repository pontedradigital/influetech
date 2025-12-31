const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath, { readonly: true });

try {
    console.log('Checking Shipment table schema...');
    const info = db.prepare("PRAGMA table_info(Shipment)").all();
    console.table(info);

    console.log('\nChecking Sale table schema...');
    const saleInfo = db.prepare("PRAGMA table_info(Sale)").all();
    console.table(saleInfo);

} catch (error) {
    console.error('Error:', error);
}
