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
    company?: string; // Mapped field
    price?: number; // Mapped field
    receiveDate?: string; // Mapped field
    image?: string; // Mapped field
}

export class ProductService {
    static async getAll(): Promise<Product[]> {
        const { data, error } = await supabase
            .from('Product')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data as Product[];
    }

    static async getAvailableForShipping(): Promise<Product[]> {
        const { data, error } = await supabase
            .from('Product')
            .select('*')
            .eq('status', 'SOLD')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data as Product[];
    }

    static async create(product: Partial<Product>): Promise<Product> {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) throw new Error('Usuario não autenticado');

        const newId = crypto.randomUUID();
        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from('Product')
            .insert([{
                ...product,
                id: newId,
                userId,
                createdAt: now,
                updatedAt: now
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Product;
    }

    static async update(id: string, product: Partial<Product>): Promise<void> {
        const updates = {
            ...product,
            updatedAt: new Date().toISOString()
        };

        const { error } = await supabase
            .from('Product')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
    }

    static async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('Product')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}

