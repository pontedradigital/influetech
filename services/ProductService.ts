const API_URL = '/api';

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
    createdAt: string;
    updatedAt: string;
}

export class ProductService {
    static async list(): Promise<Product[]> {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    static async getAvailableForShipping(): Promise<Product[]> {
        try {
            const products = await this.list();
            // Filtrar produtos que foram vendidos mas ainda não foram enviados
            return products.filter(p => p.status === 'SOLD');
        } catch (error) {
            console.error('Error fetching available products:', error);
            throw error;
        }
    }

    static async create(product: Partial<Product>): Promise<Product> {
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error('Failed to create product');
            return await response.json();
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async update(id: string, product: Partial<Product>): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error('Failed to update product');
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async delete(id: string): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
}
