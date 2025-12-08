const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

try {
    console.log('Checking userId in Shipments...\n');

    const shipments = db.prepare('SELECT id, recipientName, userId FROM Shipment ORDER BY createdAt DESC LIMIT 5').all();

    shipments.forEach((s, i) => {
        console.log(`${i + 1}. ${s.recipientName}`);
        console.log(`   UserId: ${s.userId}\n`);
    });
} catch (error) {
    console.error('Error:', error.message);
} finally {
    db.close();
}
