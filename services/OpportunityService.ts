import { supabase } from '../src/lib/supabase';

export const OpportunityService = {
    async getAll(params?: { category?: string; location?: string }) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        let query = supabase
            .from('Opportunity')
            .select('*')
            .order('createdAt', { ascending: false });

        if (params?.category) {
            query = query.eq('category', params.category);
        }
        if (params?.location) {
            query = query.ilike('location', `%${params.location}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async create(opportunity: any) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('Opportunity')
            .insert([{ ...opportunity, userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
