import { Request, Response } from 'express';
import db from '../db';

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
        // Simulate data refresh by updating timestamps and slightly varying metrics
        const products = db.prepare('SELECT id, search_volume, growth_percentage, sentiment_score FROM trending_products').all() as Array<{
            id: number;
            search_volume: number;
            growth_percentage: number;
            sentiment_score: number;
        }>;

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

        const refresh = db.transaction(() => {
            for (const product of products) {
                // Simulate small variations in metrics
                const newSearchVolume = Math.floor(product.search_volume * (0.95 + Math.random() * 0.1));
                const newGrowth = Math.max(0, product.growth_percentage + (Math.random() * 20 - 10));
                const newSentiment = Math.min(100, Math.max(0, product.sentiment_score + (Math.random() * 6 - 3)));

                updateStmt.run(newSearchVolume, newGrowth, newSentiment, product.id);
                insertHistoryStmt.run(product.id, newSearchVolume, newGrowth, newSentiment);
            }
        });

        refresh();

        res.json({
            success: true,
            message: 'Trending data refreshed successfully',
            updated: products.length
        });
    } catch (error) {
        console.error('Error refreshing data:', error);
        res.status(500).json({ success: false, error: 'Failed to refresh data' });
    }
};
