const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.resolve(__dirname, 'dev.db');
console.log('Opening DB at:', dbPath);

try {
    const db = new Database(dbPath);

    // 1. Check User again
    const user = db.prepare("SELECT * FROM User WHERE id = 'mock-id'").get();
    console.log('Mock user:', user);

    if (!user) {
        console.error('Mock user missing! This is likely the cause.');
        // Create it again just in case
        db.prepare("INSERT INTO User (id, email, password, name, plan, active, createdAt, updatedAt) VALUES ('mock-id', 'debug@teste.com', 'pass', 'Debug User', 'FREE', 1, datetime('now'), datetime('now'))").run();
        console.log('Created mock user.');
    }

    // 2. Try Insert Company
    const id = uuidv4();
    console.log('Attempting to insert company with ID:', id);

    const stmt = db.prepare(`
    INSERT INTO Company (id, name, contactName, email, phone, status, rating, userId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, 'ACTIVE', 0, ?, datetime('now'), datetime('now'))
  `);

    stmt.run(id, 'Debug Company', 'Debug Contact', 'debug@company.com', '123456789', 'mock-id');
    console.log('Company inserted successfully!');

} catch (err) {
    console.error('INSERT FAILED:', err);
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
}
