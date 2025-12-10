const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('Checking Product table schema...\n');

// Check if columns exist
const columns = db.prepare("PRAGMA table_info(Product)").all();
console.log('Current Product columns:');
columns.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
});

// Check which columns are missing
const requiredColumns = ['primaryColor', 'secondaryColor', 'shippingCost'];
const existingColumnNames = columns.map(c => c.name);
const missingColumns = requiredColumns.filter(col => !existingColumnNames.includes(col));

console.log('\nMissing columns:', missingColumns.length > 0 ? missingColumns.join(', ') : 'None');

// Apply missing columns
if (missingColumns.length > 0) {
    console.log('\nApplying migrations...');

    if (missingColumns.includes('primaryColor')) {
        console.log('Adding primaryColor column...');
        db.prepare("ALTER TABLE Product ADD COLUMN primaryColor TEXT").run();
    }

    if (missingColumns.includes('secondaryColor')) {
        console.log('Adding secondaryColor column...');
        db.prepare("ALTER TABLE Product ADD COLUMN secondaryColor TEXT").run();
    }

    if (missingColumns.includes('shippingCost')) {
        console.log('Adding shippingCost column...');
        db.prepare("ALTER TABLE Product ADD COLUMN shippingCost DECIMAL").run();
    }

    console.log('\nMigrations applied successfully!');

    // Verify
    const newColumns = db.prepare("PRAGMA table_info(Product)").all();
    console.log('\nUpdated columns:');
    newColumns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
    });
} else {
    console.log('\nAll required columns already exist!');
}

db.close();
