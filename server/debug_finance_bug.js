const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('--- Checking Financial Transactions ---');
const transactions = db.prepare('SELECT id, description, date, amount FROM FinancialTransaction').all();
console.log(JSON.stringify(transactions, null, 2));

console.log('--- Checking Sale Controller Logic (via DB Reflection) ---');
// If descriptions look like timestamps and dates look like descriptions, bug confirmed.
