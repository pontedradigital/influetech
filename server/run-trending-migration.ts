import db from './src/db';
import fs from 'fs';
import path from 'path';

const migrationPath = path.join(__dirname, 'migrations/20241208_create_trending_products.sql');
const migration = fs.readFileSync(migrationPath, 'utf8');

console.log('Running migration: 20241208_create_trending_products.sql');

try {
    // Execute migration
    db.exec(migration);
    console.log('✅ Migration completed successfully!');

    // Verify tables were created
    const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name IN ('trending_products', 'trend_history', 'product_categories')
  `).all() as Array<{ name: string }>;

    console.log('Created tables:', tables.map(t => t.name).join(', '));

    // Check categories
    const categories = db.prepare('SELECT COUNT(*) as count FROM product_categories').get() as { count: number };
    console.log(`Inserted ${categories.count} product categories`);

} catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
}
