const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

try {
    console.log('Adding new columns to Sale table...');

    // Add customerCpf to Sale table
    try {
        db.exec('ALTER TABLE Sale ADD COLUMN customerCpf TEXT;');
        console.log('✓ Added customerCpf to Sale');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('✓ customerCpf already exists in Sale');
        } else {
            throw e;
        }
    }

    console.log('\nAdding new columns to Shipment table...');

    // Add saleId to Shipment table
    try {
        db.exec('ALTER TABLE Shipment ADD COLUMN saleId TEXT;');
        console.log('✓ Added saleId to Shipment');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('✓ saleId already exists in Shipment');
        } else {
            throw e;
        }
    }

    // Add labelGenerated to Shipment table
    try {
        db.exec('ALTER TABLE Shipment ADD COLUMN labelGenerated INTEGER NOT NULL DEFAULT 0;');
        console.log('✓ Added labelGenerated to Shipment');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('✓ labelGenerated already exists in Shipment');
        } else {
            throw e;
        }
    }

    // Add declarationGenerated to Shipment table
    try {
        db.exec('ALTER TABLE Shipment ADD COLUMN declarationGenerated INTEGER NOT NULL DEFAULT 0;');
        console.log('✓ Added declarationGenerated to Shipment');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('✓ declarationGenerated already exists in Shipment');
        } else {
            throw e;
        }
    }

    console.log('\n✅ Migration completed successfully!');
} catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
} finally {
    db.close();
}
