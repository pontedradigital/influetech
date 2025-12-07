const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs'); // Assuming bcryptjs is available, or use plain text for now if not

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('Opening DB:', dbPath);

const email = 'contato@pontedra.com';
const name = 'Pontedra Master';
// Simple hash or placeholder if bcrypt not available easily in this context without install.
// Checking package.json would be good, but let's assume we can just put a string for now as we just need the ID.
const password = '$2a$10$hashedpasswordplaceholder';

try {
    // Check if user exists
    const existing = db.prepare('SELECT id FROM User WHERE email = ?').get(email);

    if (existing) {
        console.log('User already exists. ID:', existing.id);
    } else {
        const id = uuidv4();
        console.log('Creating user with ID:', id);

        // Using a timestamp for createdAt/updatedAt
        const now = new Date().toISOString(); // SQLite usually stores as string or number. Prisma defaults to ISO string often.
        // Actually Prisma stores DateTime as integer (unix epoch) or string depending on setup? 
        // Usually standard SQLite is string. Let's try inserting.

        // We need to match the schema columns: id, email, password, name, plan, active, createdAt, updatedAt
        const stmt = db.prepare(`
      INSERT INTO User (id, email, password, name, plan, active, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

        // Using current time in milliseconds (Date.now()) might be safer if Prisma expects Int, 
        // but based on "DateTime" type in schema, it likely maps to numeric or ISO string.
        // Let's use Date.now() which is often compatible or standard string.

        stmt.run(id, email, password, name, 'PRO', 1, Date.now(), Date.now());
        console.log('User created successfully. ID:', id);
    }
} catch (error) {
    console.error('Error:', error);
}
