import { api } from './api';

export interface Product {
    id: string;
    name: string;
    category: string;
    brand?: string;
    model?: string;
    marketValue?: number;
    status: 'RECEIVED' | 'ANALYZING' | 'PUBLISHED' | 'SOLD' | 'SHIPPED';
    condition?: string;
    userId: string;
    companyId?: string;
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
    primaryColor?: string;
    secondaryColor?: string;
    shippingCost?: number;
    createdAt: string;
    updatedAt: string;
}

export class ProductService {
    static async getAll(): Promise<Product[]> {
        return api.get('/products');
    }

    static async getAvailableForShipping(): Promise<Product[]> {
        // Backend doesn't have a specific endpoint for this filter yet, but we can list all and filter on client 
        // OR add a query param to listProducts. 
        // For now, let's filter on client side to keep backend simple, or assume list returns all.
        // Wait, listProducts returns all for user.
        const products: Product[] = await api.get('/products');
        return products.filter(p => p.status === 'SOLD');
    }

    static async create(product: Partial<Product>): Promise<Product> {
        return api.post('/products', product);
    }

    static async update(id: string, product: Partial<Product>): Promise<void> {
        return api.put(`/products/${id}`, product);
    }

    static async delete(id: string): Promise<void> {
        return api.delete(`/products/${id}`);
    }
}

