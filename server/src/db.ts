import Database from 'better-sqlite3';
import path from 'path';

// Use absolute path from server directory to ensure correct database file
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const db = new Database(dbPath);

export default db;
