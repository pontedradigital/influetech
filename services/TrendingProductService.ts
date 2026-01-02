// Mock Trending Products Service (Frontend Only)
// Simulates trending product data from AliExpress, Temu, Shein

export interface TrendingProduct {
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
    keywords: string[];
    description: string;
    last_updated: string;
}

const MOCK_PRODUCTS: TrendingProduct[] = [
    {
        id: 1,
        product_name: "Fone Bluetooth TWS Pro",
        category: "Eletrônicos",
        platform: "aliexpress",
        price_min: 45,
        price_max: 120,
        currency: "BRL",
        search_volume: 125000,
        growth_percentage: 285,
        sentiment_score: 92,
        hype_level: "Altíssimo",
        image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
        product_url: "https://pt.aliexpress.com",
        keywords: ["bluetooth", "fone", "tws", "wireless"],
        description: "Fone de ouvido sem fio com cancelamento de ruído e bateria de longa duração",
        last_updated: new Date().toISOString()
    },
    {
        id: 2,
        product_name: "Smartwatch Fitness Tracker",
        category: "Acessórios",
        platform: "temu",
        price_min: 89,
        price_max: 199,
        currency: "BRL",
        search_volume: 98000,
        growth_percentage: 210,
        sentiment_score: 88,
        hype_level: "Alto",
        image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
        product_url: "https://temu.com",
        keywords: ["smartwatch", "fitness", "saúde", "exercício"],
        description: "Relógio inteligente com monitor cardíaco e rastreamento de atividades",
        last_updated: new Date().toISOString()
    },
    {
        id: 3,
        product_name: "Ring Light LED Profissional",
        category: "Iluminação",
        platform: "shein",
        price_min: 65,
        price_max: 150,
        currency: "BRL",
        search_volume: 87000,
        growth_percentage: 195,
        sentiment_score: 85,
        hype_level: "Alto",
        image_url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400",
        product_url: "https://br.shein.com",
        keywords: ["ring light", "LED", "fotografia", "vídeo"],
        description: "Iluminação profissional para fotografia e vídeo com controle de intensidade",
        last_updated: new Date().toISOString()
    },
    {
        id: 4,
        product_name: "Suporte Celular Magnético",
        category: "Acessórios",
        platform: "aliexpress",
        price_min: 25,
        price_max: 75,
        currency: "BRL",
        search_volume: 110000,
        growth_percentage: 175,
        sentiment_score: 90,
        hype_level: "Médio",
        image_url: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
        product_url: "https://pt.aliexpress.com",
        keywords: ["suporte", "magnético", "celular", "carro"],
        description: "Suporte magnético versátil para celular com rotação 360°",
        last_updated: new Date().toISOString()
    },
    {
        id: 5,
        product_name: "Power Bank 20000mAh",
        category: "Eletrônicos",
        platform: "temu",
        price_min: 55,
        price_max: 130,
        currency: "BRL",
        search_volume: 95000,
        growth_percentage: 165,
        sentiment_score: 87,
        hype_level: "Médio",
        image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
        product_url: "https://temu.com",
        keywords: ["power bank", "bateria", "carregador", "portátil"],
        description: "Bateria externa de alta capacidade com carregamento rápido",
        last_updated: new Date().toISOString()
    }
];

export const TrendingProductService = {
    async getProducts(params?: { platform?: string; category?: string; hype_level?: string; sort_by?: string; limit?: number }) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let filtered = [...MOCK_PRODUCTS];

        // Apply filters
        if (params?.platform && params.platform !== 'all') {
            filtered = filtered.filter(p => p.platform === params.platform);
        }
        if (params?.category) {
            filtered = filtered.filter(p => p.category === params.category);
        }
        if (params?.hype_level) {
            filtered = filtered.filter(p => p.hype_level === params.hype_level);
        }

        // Sort
        if (params?.sort_by) {
            filtered.sort((a, b) => {
                const key = params.sort_by as keyof TrendingProduct;
                return (b[key] as number) - (a[key] as number);
            });
        }

        // Limit
        if (params?.limit) {
            filtered = filtered.slice(0, params.limit);
        }

        return { success: true, data: filtered };
    },

    async getStats() {
        await new Promise(resolve => setTimeout(resolve, 300));

        const total = MOCK_PRODUCTS.length;
        const avgGrowth = MOCK_PRODUCTS.reduce((sum, p) => sum + p.growth_percentage, 0) / total;
        const avgSentiment = MOCK_PRODUCTS.reduce((sum, p) => sum + p.sentiment_score, 0) / total;
        const highHype = MOCK_PRODUCTS.filter(p => p.hype_level === 'Altíssimo').length;

        const byPlatform = ['aliexpress', 'temu', 'shein'].map(platform => {
            const products = MOCK_PRODUCTS.filter(p => p.platform === platform);
            return {
                platform,
                count: products.length,
                avg_growth: products.reduce((sum, p) => sum + p.growth_percentage, 0) / products.length,
                avg_sentiment: products.reduce((sum, p) => sum + p.sentiment_score, 0) / products.length
            };
        });

        const categoryMap = new Map<string, TrendingProduct[]>();
        MOCK_PRODUCTS.forEach(p => {
            if (!categoryMap.has(p.category)) {
                categoryMap.set(p.category, []);
            }
            categoryMap.get(p.category)!.push(p);
        });

        const byCategory = Array.from(categoryMap.entries()).map(([category, products]) => ({
            category,
            count: products.length,
            avg_growth: products.reduce((sum, p) => sum + p.growth_percentage, 0) / products.length
        }));

        return {
            success: true,
            data: {
                overall: {
                    total_products: total,
                    avg_growth: avgGrowth,
                    avg_sentiment: avgSentiment,
                    high_hype_count: highHype
                },
                byPlatform,
                byCategory,
                topProducts: MOCK_PRODUCTS.slice(0, 5).map(p => ({
                    id: p.id,
                    product_name: p.product_name,
                    category: p.category,
                    platform: p.platform,
                    growth_percentage: p.growth_percentage,
                    sentiment_score: p.sentiment_score,
                    hype_level: p.hype_level
                })),
                lastUpdate: new Date().toISOString()
            }
        };
    },

    async getCategories() {
        await new Promise(resolve => setTimeout(resolve, 200));

        const categoryMap = new Map<string, number>();
        MOCK_PRODUCTS.forEach(p => {
            categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
        });

        const categories = Array.from(categoryMap.entries()).map(([name, count], idx) => ({
            id: idx + 1,
            name,
            icon: '📦',
            description: `${count} produtos em tendência`,
            product_count: count
        }));

        return { success: true, data: categories };
    },

    async refresh() {
        // Simulate refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, message: 'Dados atualizados com sucesso' };
    }
};
