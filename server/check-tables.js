const db = require('better-sqlite3')('prisma/dev.db');

console.log('--- Tables in Database ---');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(table => console.log(table.name));

console.log('--- Checking AffiliatePlatform Columns ---');
try {
    const columns = db.prepare("PRAGMA table_info(AffiliatePlatform)").all();
    console.log(columns);
} catch (e) {
    console.log("Table AffiliatePlatform does not exist (or error accessing it).");
}
