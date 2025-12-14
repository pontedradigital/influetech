const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
const db = new Database(dbPath);

const sales = db.prepare('SELECT id, customerName, userId, createdAt FROM Sale ORDER BY createdAt DESC LIMIT 3').all();
console.log('Sales:', JSON.stringify(sales, null, 2));

console.log('\n--- RECENT SHIPMENTS ---');
const shipments = db.prepare('SELECT id, recipientName, userId, saleId, createdAt FROM Shipment ORDER BY createdAt DESC LIMIT 3').all();
console.log('Shipments:', JSON.stringify(shipments, null, 2));

console.log('\n--- SHIPMENT COUNT BY USER ---');
const counts = db.prepare('SELECT userId, count(*) as count FROM Shipment GROUP BY userId').all();
console.log('Counts:', JSON.stringify(counts, null, 2));
