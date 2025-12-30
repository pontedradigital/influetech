import { Request, Response } from 'express';
import db from '../db';
import { generateFullProduct, getRandomProduct } from '../utils/productData';

interface TrendingProduct {
    id: number;
    product_name: string;
    category: string;
    platform: string;
    price_min: number;
    price_max: number;
    currency: string;
    search_volume: number;
    growth_percentage: number;
    sentiment_score: number;
    hype_level: string;
    image_url: string;
    product_url: string;
    keywords: string;
    description: string;
    last_updated: string;
    created_at: string;
}

interface QueryFilters {
    platform?: string;
    category?: string;
    hype_level?: string;
    price_min?: number;
    price_max?: number;
    sort_by?: string;
    limit?: number;
    offset?: number;
}

export const getAllTrendingProducts = (req: Request, res: Response) => {
    try {
        const {
            platform,
            category,
            hype_level,
            price_min,
            price_max,
            sort_by = 'growth_percentage',
            limit = 50,
            offset = 0
        }: QueryFilters = req.query;

        let query = 'SELECT * FROM trending_products WHERE 1=1';
        const params: any[] = [];

        // Apply filters
        if (platform && platform !== 'all') {
            query += ' AND platform = ?';
            params.push(platform);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (hype_level) {
            query += ' AND hype_level = ?';
            params.push(hype_level);
        }

        if (price_min !== undefined) {
            query += ' AND price_max >= ?';
            params.push(price_min);
        }

        if (price_max !== undefined) {
            query += ' AND price_min <= ?';
            params.push(price_max);
        }

        // Apply sorting
        const validSortFields = ['growth_percentage', 'sentiment_score', 'search_volume', 'price_min', 'created_at'];
        const sortField = validSortFields.includes(sort_by as string) ? sort_by : 'growth_percentage';
        query += ` ORDER BY ${sortField} DESC`;

        // Apply pagination
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const products = db.prepare(query).all(...params) as TrendingProduct[];

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM trending_products WHERE 1=1';
        const countParams: any[] = [];

        if (platform && platform !== 'all') {
            countQuery += ' AND platform = ?';
            countParams.push(platform);
        }
        if (category) {
            countQuery += ' AND category = ?';
            countParams.push(category);
        }
        if (hype_level) {
            countQuery += ' AND hype_level = ?';
            countParams.push(hype_level);
        }

        const { total } = db.prepare(countQuery).get(...countParams) as { total: number };

        res.json({
            success: true,
            data: products.map(p => ({
                ...p,
                keywords: JSON.parse(p.keywords || '[]')
            })),
            pagination: {
                total,
                limit,
                offset,
                hasMore: (offset + limit) < total
            }
        });
    } catch (error) {
        console.error('Error fetching trending products:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch trending products' });
    }
};

export const getTrendingProductById = (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = db.prepare('SELECT * FROM trending_products WHERE id = ?').get(id) as TrendingProduct | undefined;

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Get trend history
        const history = db.prepare(`
      SELECT search_volume, growth_percentage, sentiment_score, recorded_at
      FROM trend_history
      WHERE product_id = ?
      ORDER BY recorded_at DESC
      LIMIT 30
    `).all(id);

        res.json({
            success: true,
            data: {
                ...product,
                keywords: JSON.parse(product.keywords || '[]'),
                history
            }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
};

export const getTrendingStats = (req: Request, res: Response) => {
    try {
        // Overall stats
        const overallStats = db.prepare(`
      SELECT 
        COUNT(*) as total_products,
        AVG(growth_percentage) as avg_growth,
        AVG(sentiment_score) as avg_sentiment,
        SUM(CASE WHEN hype_level = 'Altíssimo' THEN 1 ELSE 0 END) as high_hype_count
      FROM trending_products
    `).get() as {
            total_products: number;
            avg_growth: number;
            avg_sentiment: number;
            high_hype_count: number;
        };

        // Stats by platform
        const platformStats = db.prepare(`
      SELECT 
        platform,
        COUNT(*) as count,
        AVG(growth_percentage) as avg_growth,
        AVG(sentiment_score) as avg_sentiment
      FROM trending_products
      GROUP BY platform
    `).all();

        // Stats by category
        const categoryStats = db.prepare(`
      SELECT 
        category,
        COUNT(*) as count,
        AVG(growth_percentage) as avg_growth
      FROM trending_products
      GROUP BY category
      ORDER BY count DESC
      LIMIT 10
    `).all();

        // Top products
        const topProducts = db.prepare(`
      SELECT id, product_name, category, platform, growth_percentage, sentiment_score, hype_level
      FROM trending_products
      ORDER BY growth_percentage DESC
      LIMIT 5
    `).all();

        // Last update time
        const lastUpdate = db.prepare(`
      SELECT MAX(last_updated) as last_updated
      FROM trending_products
    `).get() as { last_updated: string };

        res.json({
            success: true,
            data: {
                overall: overallStats,
                byPlatform: platformStats,
                byCategory: categoryStats,
                topProducts,
                lastUpdate: lastUpdate.last_updated
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
};

export const getCategories = (req: Request, res: Response) => {
    try {
        const categories = db.prepare(`
      SELECT 
        pc.id,
        pc.name,
        pc.icon,
        pc.description,
        pc.parent_category,
        COUNT(tp.id) as product_count
      FROM product_categories pc
      LEFT JOIN trending_products tp ON tp.category = pc.name
      GROUP BY pc.id, pc.name, pc.icon, pc.description, pc.parent_category
      ORDER BY product_count DESC
    `).all();

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
};

export const refreshTrendingData = (req: Request, res: Response) => {
    try {
        // 1. Get all current products ordered by performance (growth * sentiment as a proxy score)
        const products = db.prepare('SELECT * FROM trending_products').all() as TrendingProduct[];

        // Calculate a score for each product to decide who stays
        const scoredProducts = products.map(p => ({
            ...p,
            score: p.growth_percentage + (p.sentiment_score * 2) // Weight sentiment more
        })).sort((a, b) => a.score - b.score); // Ascending order (lowest score first)

        // 2. Remove bottom 20% performers (make space for new trends)
        const totalToRemove = Math.max(1, Math.floor(products.length * 0.2));
        const productsToRemove = scoredProducts.slice(0, totalToRemove);

        // Delete them
        const deleteStmt = db.prepare('DELETE FROM trending_products WHERE id = ?');
        const deleteHistoryStmt = db.prepare('DELETE FROM trend_history WHERE product_id = ?');

        const deleteTransaction = db.transaction(() => {
            for (const p of productsToRemove) {
                deleteHistoryStmt.run(p.id);
                deleteStmt.run(p.id);
            }
        });
        deleteTransaction();

        // 3. Update remaining products (simulate market changes)
        // Keep the ones we didn't delete
        const remainingProducts = scoredProducts.slice(totalToRemove);
        const updateStmt = db.prepare(`
            UPDATE trending_products 
            SET 
                search_volume = ?,
                growth_percentage = ?,
                sentiment_score = ?,
                last_updated = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const insertHistoryStmt = db.prepare(`
            INSERT INTO trend_history (product_id, search_volume, growth_percentage, sentiment_score)
            VALUES (?, ?, ?, ?)
        `);

        // Helper to import from utils (need to handle Require/Import here or ensure top level import)
        // Since we are in the controller, we can't easily import from 'productData' if not already imported.
        // But we will add the import at the top of this file next.

        const updateTransaction = db.transaction(() => {
            for (const p of remainingProducts) {
                // Simulate small variations
                const newSearchVolume = Math.floor(p.search_volume * (0.9 + Math.random() * 0.2)); // +/- 10%
                const newGrowth = Math.max(0, p.growth_percentage + (Math.random() * 40 - 20));
                // Clamp sentiment 0-100 and round to integer
                const newSentiment = Math.floor(Math.min(100, Math.max(0, p.sentiment_score + (Math.random() * 10 - 5))));

                updateStmt.run(newSearchVolume, newGrowth, newSentiment, p.id);
                insertHistoryStmt.run(p.id, newSearchVolume, newGrowth, newSentiment);
            }
        });
        updateTransaction();

        // 4. Add new products to replace removed ones
        // We need to dynamically import or have imported the generator
        // For now, I'll assume we added the import at the top.

        // Imported generators are used below

        const insertStmt = db.prepare(`
            INSERT INTO trending_products (
                product_name, category, platform, price_min, price_max, currency,
                search_volume, growth_percentage, sentiment_score, hype_level,
                image_url, product_url, keywords, description
            ) VALUES (
                @product_name, @category, @platform, @price_min, @price_max, @currency,
                @search_volume, @growth_percentage, @sentiment_score, @hype_level,
                @image_url, @product_url, @keywords, @description
            )
        `);

        const insertNewTransaction = db.transaction(() => {
            for (let i = 0; i < totalToRemove; i++) {
                const template = getRandomProduct();
                // Add "NEW" suffix or similar to verify it's new? No, just let it be generic.
                const newProduct = generateFullProduct(template);
                // Boost growth for new products to show they are "trending"
                newProduct.growth_percentage = Math.floor(Math.random() * 400) + 100;
                newProduct.hype_level = 'Altíssimo'; // New trends are usually hype

                insertStmt.run(newProduct);
            }
        });
        insertNewTransaction();

        res.json({
            success: true,
            message: 'Trending data refreshed successfully',
            updated: remainingProducts.length,
            removed: totalToRemove,
            added: totalToRemove
        });
    } catch (error) {
        console.error('Error refreshing data:', error);
        res.status(500).json({ success: false, error: 'Failed to refresh data' });
    }
};
