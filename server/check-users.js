const db = require('better-sqlite3')('prisma/dev.db');

console.log('--- USERS IN DATABASE ---');
const users = db.prepare('SELECT id, name, isPublicProfile, email FROM User').all();
users.forEach(u => {
    console.log(`ID: ${u.id} | Name: ${u.name} | Public: ${u.isPublicProfile} | Email: ${u.email}`);
});

console.log('\n--- PROFILE LIKES ---');
const likes = db.prepare('SELECT * FROM ProfileLike').all();
console.log(likes);
