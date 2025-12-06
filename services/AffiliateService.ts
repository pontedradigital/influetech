import { AffiliateProduct } from '../types';

const STORAGE_KEY = 'influetech_affiliate_products';

export class AffiliateService {
    // List all affiliate products
    static async list(): Promise<AffiliateProduct[]> {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading affiliate products:', error);
            return [];
        }
    }

    // Get a single product by ID
    static async getById(id: string): Promise<AffiliateProduct | null> {
        const products = await this.list();
        return products.find(p => p.id === id) || null;
    }

    // Create a new affiliate product
    static async create(productData: Omit<AffiliateProduct, 'id' | 'clicks' | 'conversions' | 'revenue' | 'createdAt'>): Promise<AffiliateProduct> {
        const products = await this.list();

        const newProduct: AffiliateProduct = {
            ...productData,
            id: this.generateId(),
            clicks: 0,
            conversions: 0,
            revenue: 0,
            createdAt: new Date().toISOString(),
        };

        products.push(newProduct);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

        return newProduct;
    }

    // Update an existing product
    static async update(id: string, updates: Partial<AffiliateProduct>): Promise<AffiliateProduct | null> {
        const products = await this.list();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return null;

        products[index] = {
            ...products[index],
            ...updates,
            id, // Ensure ID doesn't change
            updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        return products[index];
    }

    // Delete a product
    static async delete(id: string): Promise<boolean> {
        const products = await this.list();
        const filtered = products.filter(p => p.id !== id);

        if (filtered.length === products.length) return false;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    }

    // Track a click on an affiliate link
    static async trackClick(id: string): Promise<void> {
        const product = await this.getById(id);
        if (!product) return;

        await this.update(id, {
            clicks: product.clicks + 1,
        });
    }

    // Track a conversion (sale)
    static async trackConversion(id: string, saleValue?: number): Promise<void> {
        const product = await this.getById(id);
        if (!product) return;

        const commissionEarned = saleValue
            ? (saleValue * product.commission) / 100
            : (product.price * product.commission) / 100;

        await this.update(id, {
            conversions: product.conversions + 1,
            revenue: product.revenue + commissionEarned,
        });
    }

    // Generate a short link (simplified version - in production would use a URL shortener API)
    static generateShortLink(productId: string, productName: string): string {
        const slug = productName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return `${window.location.origin}/#/go/${slug}-${productId.slice(0, 6)}`;
    }

    // Toggle favorite status
    static async toggleFavorite(id: string): Promise<void> {
        const product = await this.getById(id);
        if (!product) return;

        await this.update(id, {
            isFavorite: !product.isFavorite,
        });
    }

    // Get analytics summary
    static async getAnalytics(): Promise<{
        totalProducts: number;
        totalClicks: number;
        totalConversions: number;
        totalRevenue: number;
        conversionRate: number;
        topPerformers: AffiliateProduct[];
    }> {
        const products = await this.list();

        const totalClicks = products.reduce((sum, p) => sum + p.clicks, 0);
        const totalConversions = products.reduce((sum, p) => sum + p.conversions, 0);
        const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
        const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

        const topPerformers = [...products]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return {
            totalProducts: products.length,
            totalClicks,
            totalConversions,
            totalRevenue,
            conversionRate,
            topPerformers,
        };
    }

    // Generate unique ID
    private static generateId(): string {
        return `aff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Export data as CSV
    static async exportToCSV(): Promise<string> {
        const products = await this.list();

        const headers = ['Nome', 'Categoria', 'Link', 'Comissão (%)', 'Preço', 'Cliques', 'Conversões', 'Receita'];
        const rows = products.map(p => [
            p.name,
            p.category,
            p.affiliateLink,
            p.commission,
            p.price,
            p.clicks,
            p.conversions,
            p.revenue.toFixed(2),
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(',')),
        ].join('\n');

        return csv;
    }
}
