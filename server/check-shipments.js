const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

try {
    console.log('Checking Shipments in database...\n');

    const shipments = db.prepare('SELECT * FROM Shipment ORDER BY createdAt DESC LIMIT 5').all();

    if (shipments.length === 0) {
        console.log('No shipments found in database.');
    } else {
        console.log(`Found ${shipments.length} shipment(s):\n`);
        shipments.forEach((s, i) => {
            console.log(`${i + 1}. ID: ${s.id}`);
            console.log(`   Recipient: ${s.recipientName}`);
            console.log(`   Content: ${s.contentDescription}`);
            console.log(`   Status: ${s.status}`);
            console.log(`   SaleId: ${s.saleId || 'null'}`);
            console.log(`   LabelGenerated: ${s.labelGenerated}`);
            console.log(`   DeclarationGenerated: ${s.declarationGenerated}`);
            console.log(`   Created: ${s.createdAt}\n`);
        });
    }
} catch (error) {
    console.error('Error:', error.message);
} finally {
    db.close();
}
