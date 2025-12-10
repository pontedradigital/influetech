const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('Checking Company table schema...\n');

// Get current schema
const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='Company'").get();
console.log('Current Company table schema:');
console.log(schema?.sql || 'Table does not exist');

// Check if columns exist
const columns = db.prepare("PRAGMA table_info(Company)").all();
console.log('\nCurrent columns:');
columns.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
});

// Check which columns are missing
const requiredColumns = ['website', 'contactMethod', 'contactValue', 'partnershipStatus'];
const existingColumnNames = columns.map(c => c.name);
const missingColumns = requiredColumns.filter(col => !existingColumnNames.includes(col));

console.log('\nMissing columns:', missingColumns.length > 0 ? missingColumns.join(', ') : 'None');

// Apply missing columns
if (missingColumns.length > 0) {
    console.log('\nApplying migrations...');

    if (missingColumns.includes('website')) {
        console.log('Adding website column...');
        db.prepare("ALTER TABLE Company ADD COLUMN website TEXT").run();
    }

    if (missingColumns.includes('partnershipStatus')) {
        console.log('Adding partnershipStatus column...');
        db.prepare("ALTER TABLE Company ADD COLUMN partnershipStatus TEXT DEFAULT 'Solicitada'").run();
    }

    if (missingColumns.includes('contactMethod')) {
        console.log('Adding contactMethod column...');
        db.prepare("ALTER TABLE Company ADD COLUMN contactMethod TEXT").run();
    }

    if (missingColumns.includes('contactValue')) {
        console.log('Adding contactValue column...');
        db.prepare("ALTER TABLE Company ADD COLUMN contactValue TEXT").run();
    }

    console.log('\nMigrations applied successfully!');

    // Verify
    const newColumns = db.prepare("PRAGMA table_info(Company)").all();
    console.log('\nUpdated columns:');
    newColumns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
    });
} else {
    console.log('\nAll required columns already exist!');
}

db.close();
