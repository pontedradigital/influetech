import { supabase } from '../src/lib/supabase';

export const SaleService = {
    async getAll(searchTerm?: string) {
        const { data, error } = await supabase
            .from('Sale')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;

        const sales = data;

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            return sales.filter((s: any) =>
                (s.customerName && s.customerName.toLowerCase().includes(lowerSearch)) ||
                (s.customerEmail && s.customerEmail.toLowerCase().includes(lowerSearch))
            );
        }
        return sales;
    },

    async create(sale: any) {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) throw new Error('Usuario não autenticado');

        const newId = crypto.randomUUID();
        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from('Sale')
            .insert([{
                ...sale,
                id: newId,
                userId,
                createdAt: now,
                updatedAt: now,
                status: 'PENDING'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('Sale')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
