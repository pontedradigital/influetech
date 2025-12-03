const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');
console.log('Opening DB at:', dbPath);

try {
    const db = new Database(dbPath);

    // Check User
    const users = db.prepare('SELECT * FROM User').all();
    console.log('Users found:', users.length);
    const mockUser = users.find(u => u.id === 'mock-id');
    if (mockUser) {
        console.log('mock-id user exists.');
    } else {
        console.log('mock-id user MISSING!');
    }

    // Check Company Columns
    const columns = db.prepare("PRAGMA table_info(Company)").all();
    console.log('Company Columns:', columns.map(c => c.name));

} catch (err) {
    console.error('Error:', err);
}
