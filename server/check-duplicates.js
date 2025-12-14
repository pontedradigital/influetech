const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
const db = new Database(dbPath);

console.log('--- LAST 5 SHIPMENTS ---');
const shipments = db.prepare(`
  SELECT id, saleId, contentDescription, trackingCode, createdAt 
  FROM Shipment 
  ORDER BY createdAt DESC 
  LIMIT 5
`).all();
console.log(JSON.stringify(shipments, null, 2));

console.log('\n--- LAST 5 SALES ---');
const sales = db.prepare(`
  SELECT id, customerName, productId, createdAt 
  FROM Sale 
  ORDER BY createdAt DESC 
  LIMIT 5
`).all();
console.log(JSON.stringify(sales, null, 2));
