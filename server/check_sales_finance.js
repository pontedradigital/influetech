const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('Checking Sales and Transactions...');

try {
    const sales = db.prepare('SELECT id, customerName, salePrice, createdAt FROM Sale').all();
    console.log('Sales:', sales);

    const transactions = db.prepare('SELECT id, description, amount, type, category FROM FinancialTransaction').all();
    console.log('Transactions:', transactions);
} catch (error) {
    console.error('Error:', error);
}
