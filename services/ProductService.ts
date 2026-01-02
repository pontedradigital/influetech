import { supabase } from '../src/lib/supabase';

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
    static async list(): Promise<Product[]> {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('Product')
                .select('*')
                .eq('userId', userId)
                .order('createdAt', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    static async getAvailableForShipping(): Promise<Product[]> {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('Product')
                .select('*')
                .eq('userId', userId)
                .eq('status', 'SOLD')
                .order('createdAt', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching available products:', error);
            throw error;
        }
    }

    static async create(product: Partial<Product>): Promise<Product> {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('Product')
                .insert([{ ...product, userId }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async update(id: string, product: Partial<Product>): Promise<void> {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('Product')
                .update(product)
                .eq('id', id)
                .eq('userId', userId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async delete(id: string): Promise<void> {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('Product')
                .delete()
                .eq('id', id)
                .eq('userId', userId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
}

