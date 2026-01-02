import { supabase } from '../src/lib/supabase';

export const SaleService = {
    async getAll(searchTerm?: string) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        let query = supabase
            .from('Sale')
            .select(`
                *,
                product:Product(name, category)
            `)
            .eq('userId', userId)
            .order('saleDate', { ascending: false });

        if (searchTerm) {
            query = query.or(`customerName.ilike.%${searchTerm}%,customerEmail.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async create(sale: any) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('Sale')
            .insert([{ ...sale, userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('Sale')
            .delete()
            .eq('id', id)
            .eq('userId', userId);

        if (error) throw error;
        return { success: true };
    }
};
