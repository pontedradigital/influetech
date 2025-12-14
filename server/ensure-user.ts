import db from './src/db';

const userId = '327aa8c1-7c26-41c2-95d7-b375c25eb896';

try {
    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId);
    if (!user) {
        console.log('User not found. Creating default user...');
        const stmt = db.prepare(`
        INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
        // Create a dummy user. Adjust columns if your User model is different.
        // Based on standard Prisma User model shown in snippets.
        stmt.run(userId, 'Test User', 'test@example.com', 'password123', 'USER');
        console.log('Default user created.');
    } else {
        console.log('Default user already exists.');
    }
} catch (error) {
    console.error('Error checking/creating user:', error);
}
