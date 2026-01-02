import { supabase } from '../src/lib/supabase';

export const MediaKitService = {
    async getBrands() {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('MediaKitBrand')
            .select('*')
            .eq('userId', userId)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async addBrand(brand: any) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('MediaKitBrand')
            .insert([{ ...brand, userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteBrand(id: string) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('MediaKitBrand')
            .delete()
            .eq('id', id)
            .eq('userId', userId);

        if (error) throw error;
        return { success: true };
    }
};
