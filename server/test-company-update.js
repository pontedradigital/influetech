const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('Testing company update...\n');

// Get a test company
const companies = db.prepare("SELECT * FROM Company LIMIT 1").all();
if (companies.length === 0) {
    console.log('No companies found in database');
    db.close();
    process.exit(0);
}

const testCompany = companies[0];
console.log('Test company:', testCompany);

// Try to update it
try {
    const stmt = db.prepare(`
    UPDATE Company 
    SET name = ?, contactName = ?, email = ?, phone = ?, country = ?, website = ?, contactMethod = ?, contactValue = ?, partnershipStatus = ?, status = ?, rating = ?, updatedAt = datetime('now')
    WHERE id = ?
  `);

    const result = stmt.run(
        testCompany.name + ' UPDATED',
        testCompany.contactName,
        testCompany.email,
        testCompany.phone,
        testCompany.country,
        testCompany.website,
        testCompany.contactMethod,
        testCompany.contactValue,
        testCompany.partnershipStatus,
        testCompany.status,
        testCompany.rating,
        testCompany.id
    );

    console.log('\nUpdate result:', result);
    console.log('Changes:', result.changes);

    // Verify the update
    const updated = db.prepare("SELECT * FROM Company WHERE id = ?").get(testCompany.id);
    console.log('\nUpdated company:', updated);

} catch (error) {
    console.error('\nError updating company:', error);
}

db.close();
