import { Request, Response } from 'express';
import db from '../db';
import { generateFullProduct, getRandomProduct } from '../utils/productData';
import { Prisma } from '@prisma/client';

// Workaround for persistent build error where generated client types are not picked up
const prisma = db as any;

export const getAllTrendingProducts = async (req: Request, res: Response) => {
    try {
        const {
            platform,
            category,
            hype_level,
            price_min,
            price_max,
            sort_by = 'growthPercentage',
            limit = 50,
            offset = 0
        } = req.query;

        const where: any = {}; // Typed as any to avoid 'TrendingProductWhereInput' error

        if (platform && platform !== 'all') {
            where.platform = String(platform);
        }
        if (category) {
            where.category = String(category);
        }
        if (hype_level) {
            where.hypeLevel = String(hype_level);
        }
        if (price_min) {
            where.priceMin = { gte: Number(price_min) };
        }
        if (price_max) {
            where.priceMax = { lte: Number(price_max) };
        }

        // Map sort fields to schema fields
        const sortMapping: Record<string, string> = {
            'growth_percentage': 'growthPercentage',
            'growthPercentage': 'growthPercentage',
            'sentiment_score': 'sentimentScore',
            'sentimentScore': 'sentimentScore',
            'search_volume': 'searchVolume',
            'searchVolume': 'searchVolume',
            'price_min': 'priceMin',
            'priceMin': 'priceMin',
            'created_at': 'createdAt',
            'createdAt': 'createdAt'
        };

        const orderByField = sortMapping[String(sort_by)] || 'growthPercentage';
        const orderBy = { [orderByField]: 'desc' };

        // Execute query
        const [products, total] = await db.$transaction([
            prisma.trendingProduct.findMany({
                where,
                orderBy,
                take: Number(limit),
                skip: Number(offset)
            }),
            prisma.trendingProduct.count({ where })
        ]);

        res.json({
            success: true,
            data: products.map((p: any) => ({
                ...p,
                priceMin: Number(p.priceMin),
                priceMax: p.priceMax ? Number(p.priceMax) : null,
                keywords: p.keywords ? JSON.parse(p.keywords) : []
            })),
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: (Number(offset) + Number(limit)) < total
            }
        });
    } catch (error) {
        console.error('Error fetching trending products:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch trending products' });
    }
};

export const getTrendingProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await prisma.trendingProduct.findUnique({
            where: { id: Number(id) },
            include: {
                history: {
                    orderBy: { recordedAt: 'desc' },
                    take: 30
                }
            }
        });

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.json({
            success: true,
            data: {
                ...product,
                priceMin: Number(product.priceMin),
                priceMax: product.priceMax ? Number(product.priceMax) : null,
                keywords: product.keywords ? JSON.parse(product.keywords) : [],
                history: product.history
            }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
};

export const getTrendingStats = async (req: Request, res: Response) => {
    try {
        const [
            totalProducts,
            aggregates,
            highHypeCount,
            platformGroups,
            categoryGroups,
            topProducts,
            lastUpdateProduct
        ] = await db.$transaction([
            // 1. Total Count
            prisma.trendingProduct.count(),

            // 2. Averages
            prisma.trendingProduct.aggregate({
                _avg: {
                    growthPercentage: true,
                    sentimentScore: true
                }
            }),

            // 3. High Hype Count
            prisma.trendingProduct.count({
                where: { hypeLevel: 'Altíssimo' }
            }),

            // 4. Platform Stats
            prisma.trendingProduct.groupBy({
                by: ['platform'],
                _count: { _all: true },
                _avg: {
                    growthPercentage: true,
                    sentimentScore: true
                }
            }),

            // 5. Category Stats (Top 10 by count)
            prisma.trendingProduct.groupBy({
                by: ['category'],
                _count: { _all: true },
                _avg: { growthPercentage: true },
            }),

            // 6. Top Products
            prisma.trendingProduct.findMany({
                select: {
                    id: true,
                    productName: true,
                    category: true,
                    platform: true,
                    growthPercentage: true,
                    sentimentScore: true,
                    hypeLevel: true
                },
                orderBy: { growthPercentage: 'desc' },
                take: 5
            }),

            // 7. Last Update
            prisma.trendingProduct.findFirst({
                orderBy: { lastUpdated: 'desc' },
                select: { lastUpdated: true }
            })
        ]);

        // Process Platform Stats
        const byPlatform = platformGroups.map((p: any) => ({
            platform: p.platform,
            count: p._count._all,
            avg_growth: p._avg.growthPercentage,
            avg_sentiment: p._avg.sentimentScore
        }));

        // Process Category Stats (sort and slice)
        const byCategory = categoryGroups
            .map((c: any) => ({
                category: c.category,
                count: c._count._all,
                avg_growth: c._avg.growthPercentage
            }))
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 10);

        res.json({
            success: true,
            data: {
                overall: {
                    total_products: totalProducts,
                    avg_growth: aggregates._avg.growthPercentage,
                    avg_sentiment: aggregates._avg.sentimentScore,
                    high_hype_count: highHypeCount
                },
                byPlatform,
                byCategory,
                topProducts,
                lastUpdate: lastUpdateProduct?.lastUpdated || new Date()
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        // 1. Get all categories definitions
        const categories = await prisma.productCategory.findMany();

        // 2. Get counts from trending products
        const counts = await prisma.trendingProduct.groupBy({
            by: ['category'],
            _count: { _all: true }
        });

        // 3. Merge
        const categoryMap = new Map(counts.map((c: any) => [c.category, c._count._all]));

        const result = categories.map((c: any) => ({
            id: c.id,
            name: c.name,
            icon: c.icon,
            description: c.description,
            parent_category: c.parentCategory,
            product_count: categoryMap.get(c.name) || 0 // Default to 0 if no products
        })).sort((a: any, b: any) => b.product_count - a.product_count);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
};

export const refreshTrendingData = async (req: Request, res: Response) => {
    try {
        // 1. Get all current products
        const products = await prisma.trendingProduct.findMany();

        // Calculate score in JS
        const scoredProducts = products.map((p: any) => ({
            ...p,
            score: p.growthPercentage + (p.sentimentScore * 2)
        })).sort((a: any, b: any) => a.score - b.score);

        // 2. Remove bottom 20%
        const totalToRemove = Math.max(1, Math.floor(products.length * 0.2));
        const productsToRemove = scoredProducts.slice(0, totalToRemove);
        const idsToRemove = productsToRemove.map((p: any) => p.id);

        await db.$transaction(async (tx) => {
            const txa = tx as any; // Cast transaction to any

            // Delete removed
            if (idsToRemove.length > 0) {
                await txa.trendingProduct.deleteMany({
                    where: { id: { in: idsToRemove } }
                });
            }

            // 3. Update remaining
            const remainingProducts = scoredProducts.slice(totalToRemove);
            for (const p of remainingProducts) {
                const newSearchVolume = Math.floor(p.searchVolume * (0.9 + Math.random() * 0.2));
                const newGrowth = Math.max(0, p.growthPercentage + (Math.random() * 40 - 20));
                const newSentiment = Math.floor(Math.min(100, Math.max(0, p.sentimentScore + (Math.random() * 10 - 5))));

                await txa.trendingProduct.update({
                    where: { id: p.id },
                    data: {
                        searchVolume: newSearchVolume,
                        growthPercentage: newGrowth,
                        sentimentScore: newSentiment,
                        lastUpdated: new Date()
                    }
                });

                await txa.trendHistory.create({
                    data: {
                        productId: p.id,
                        searchVolume: newSearchVolume,
                        growthPercentage: newGrowth,
                        sentimentScore: newSentiment,
                        recordedAt: new Date() // Default is now
                    }
                });
            }

            // 4. Add new products
            for (let i = 0; i < totalToRemove; i++) {
                const template = getRandomProduct();
                const newProduct = generateFullProduct(template);
                newProduct.growth_percentage = Math.floor(Math.random() * 400) + 100;
                newProduct.hype_level = 'Altíssimo';

                await txa.trendingProduct.create({
                    data: {
                        productName: newProduct.product_name,
                        category: newProduct.category,
                        platform: newProduct.platform,
                        priceMin: newProduct.price_min,
                        priceMax: newProduct.price_max,
                        currency: newProduct.currency,
                        searchVolume: newProduct.search_volume,
                        growthPercentage: newProduct.growth_percentage,
                        sentimentScore: newProduct.sentiment_score,
                        hypeLevel: newProduct.hype_level,
                        imageUrl: newProduct.image_url,
                        productUrl: newProduct.product_url,
                        keywords: newProduct.keywords, // String
                        description: newProduct.description
                    }
                });
            }
        });

        res.json({
            success: true,
            message: 'Trending data refreshed successfully',
            updated: products.length - totalToRemove,
            removed: totalToRemove,
            added: totalToRemove
        });
    } catch (error) {
        console.error('Error refreshing data:', error);
        res.status(500).json({ success: false, error: 'Failed to refresh data' });
    }
};
