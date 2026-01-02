import { supabase } from '../src/lib/supabase';

export const BazarService = {
    async getAll() {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('BazarEvent')
            .select('*')
            .eq('userId', userId)
            .order('eventDate', { ascending: true });

        if (error) throw error;
        return data;
    },

    async create(event: any) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('BazarEvent')
            .insert([{ ...event, userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('BazarEvent')
            .update(updates)
            .eq('id', id)
            .eq('userId', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('BazarEvent')
            .delete()
            .eq('id', id)
            .eq('userId', userId);

        if (error) throw error;
        return { success: true };
    }
};
