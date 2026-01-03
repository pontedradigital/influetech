import { supabase } from '../src/lib/supabase';

export const MediaKitService = {
    async getBrands() {
        const { data, error } = await supabase
            .from('MediaKitBrand')
            .select('*')
            .order('name');

        if (error) throw error;
        return data;
    },

    async addBrand(brand: any) {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) throw new Error('Usuario não autenticado');

        const { data, error } = await supabase
            .from('MediaKitBrand')
            .insert([{ ...brand, userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteBrand(id: string) {
        const { error } = await supabase
            .from('MediaKitBrand')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
