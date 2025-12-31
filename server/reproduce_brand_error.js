const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
console.log('Opening DB at:', dbPath);
const db = new Database(dbPath);

const userId = '327aa8c1-7c26-41c2-95d7-b375c25eb896';

console.log('Checking if user exists:', userId);
try {
    const user = db.prepare('SELECT id, name FROM User WHERE id = ?').get(userId);
    console.log('User found:', user);

    if (!user) {
        console.error('ERROR: User not found! Foreign key constraint will fail.');
        // List all users to see valid IDs
        const users = db.prepare('SELECT id, name, email FROM User').all();
        console.log('Valid users:', users);
        process.exit(1);
    }

    // Manually create the table if it doesn't exist (Bypassing Prisma lock issues)
    console.log('Ensuring MediaKitBrand table exists...');
    db.exec(`
        CREATE TABLE IF NOT EXISTS "MediaKitBrand" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "logo" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            CONSTRAINT "MediaKitBrand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
        );
    `);

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables in DB:', tables.map(t => t.name));

    console.log('Attempting to create brand...');
    const id = uuidv4();
    const name = 'Test Brand';
    const logo = null;

    const stmt = db.prepare(`
        INSERT INTO MediaKitBrand (id, userId, name, logo, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    stmt.run(id, userId, name, logo);
    console.log('SUCCESS: Brand created!');

} catch (error) {
    console.error('CRITICAL ERROR MESSAGE:', error.message);
    console.error('CRITICAL ERROR CODE:', error.code);
}
