import db from '../db';
import { productTemplates, generateFullProduct } from './productData';

export const generateDailyTrends = async () => {
    console.log('🔄 Generating daily trends...');

    try {
        // Transaction to ensure atomicity
        await db.$transaction(async (tx) => {
            const txa = tx as any;

            // 1. Clear current trending products
            await txa.trendHistory.deleteMany({});
            await txa.trendingProduct.deleteMany({});

            // 2. Select random subset of templates
            const shuffled = [...productTemplates].sort(() => 0.5 - Math.random());
            const selectedTemplates = shuffled.slice(0, 45); // Pick 45 random products

            // 3. Insert new products
            for (const template of selectedTemplates) {
                const product = generateFullProduct(template);

                // Create returns the created object with ID
                const created = await txa.trendingProduct.create({
                    data: {
                        productName: product.product_name,
                        category: product.category,
                        platform: product.platform,
                        priceMin: product.price_min,
                        priceMax: product.price_max,
                        currency: product.currency,
                        searchVolume: product.search_volume,
                        growthPercentage: product.growth_percentage,
                        sentimentScore: product.sentiment_score,
                        hypeLevel: product.hype_level,
                        imageUrl: product.product_url.includes('placehold') ? product.image_url : product.image_url,
                        productUrl: product.product_url,
                        keywords: product.keywords,
                        description: product.description,
                    }
                });

                // 4. Create fake initial history
                await txa.trendHistory.create({
                    data: {
                        productId: created.id,
                        searchVolume: product.search_volume,
                        growthPercentage: product.growth_percentage,
                        sentimentScore: product.sentiment_score,
                        recordedAt: new Date()
                    }
                });
            }
        });

        console.log('✅ Daily trends successfully regenerated!');

    } catch (error) {
        console.error('❌ Error generating daily trends:', error);
        throw error;
    }
};
