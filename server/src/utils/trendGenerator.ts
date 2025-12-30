import db from '../db';
import { productTemplates, generateFullProduct, TrendingProductInput } from './productData';

export const generateDailyTrends = async () => {
    console.log('🔄 Generating daily trends...');

    try {
        // Transaction to ensure atomicity
        const regenerate = db.transaction(() => {
            // 1. Clear current trending products
            // Note: We might want to archive them in history instead of deleting if we want long-term tracking
            // For now, to simulate "Fresh Daily Rotation", we wipe and replace select items.

            // Record current state to history before wiping? 
            // The current seed logic wipes everything. Let's stick to that for "New Options" feel.
            db.prepare('DELETE FROM trending_products').run();
            // We KEEP trend_history if possible, but if IDs change, history breaks. 
            // So for this MVP "Dynamic" mode, we wipe history too or start fresh.
            // Let's wipe to avoid FK errors.
            db.prepare('DELETE FROM trend_history').run();

            // Reset sequences
            db.prepare("DELETE FROM sqlite_sequence WHERE name='trending_products'").run();
            db.prepare("DELETE FROM sqlite_sequence WHERE name='trend_history'").run();

            // 2. Select random subset of templates to be "Trending" today (e.g. 40 out of 54)
            // This creates the "Dynamic" feel - not every product is trending every day.
            const shuffled = [...productTemplates].sort(() => 0.5 - Math.random());
            const selectedTemplates = shuffled.slice(0, 45); // Pick 45 random products

            // 3. Insert new products
            const insert = db.prepare(`
                INSERT INTO trending_products (
                product_name, category, platform, price_min, price_max, currency,
                search_volume, growth_percentage, sentiment_score, hype_level,
                image_url, product_url, keywords, description, last_updated
                ) VALUES (
                @product_name, @category, @platform, @price_min, @price_max, @currency,
                @search_volume, @growth_percentage, @sentiment_score, @hype_level,
                @image_url, @product_url, @keywords, @description, CURRENT_TIMESTAMP
                )
            `);

            for (const template of selectedTemplates) {
                // generateFullProduct now handles random metrics inside
                const product = generateFullProduct(template);
                insert.run(product);
            }

            // 4. Create fake initial history for these new items
            const products = db.prepare('SELECT id, search_volume, growth_percentage, sentiment_score FROM trending_products').all() as Array<{
                id: number;
                search_volume: number;
                growth_percentage: number;
                sentiment_score: number;
            }>;

            const insertHistory = db.prepare(`
                INSERT INTO trend_history (product_id, search_volume, growth_percentage, sentiment_score)
                VALUES (?, ?, ?, ?)
            `);

            for (const record of products) {
                insertHistory.run(record.id, record.search_volume, record.growth_percentage, record.sentiment_score);
            }
        });

        regenerate();
        console.log('✅ Daily trends successfully regenerated!');

    } catch (error) {
        console.error('❌ Error generating daily trends:', error);
        throw error;
    }
};
