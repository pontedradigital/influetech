const Database = require('better-sqlite3');
const path = require('path');

console.log('=== Checking server/dev.db ===');
try {
    const db1 = new Database(path.resolve(__dirname, 'dev.db'));
    const tables1 = db1.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables in server/dev.db:', tables1.map(t => t.name));
    db1.close();
} catch (err) {
    console.error('Error with server/dev.db:', err.message);
}

console.log('\n=== Checking root dev.db ===');
try {
    const db2 = new Database(path.resolve(__dirname, '../dev.db'));
    const tables2 = db2.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables in ../dev.db:', tables2.map(t => t.name));
    db2.close();
} catch (err) {
    console.error('Error with ../dev.db:', err.message);
}
