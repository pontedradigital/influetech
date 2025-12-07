const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('Checking users in:', dbPath);

try {
    const users = db.prepare('SELECT id, email, name FROM User').all();
    console.log('Users found:', users);
} catch (error) {
    console.error('Error fetching users:', error);
}
