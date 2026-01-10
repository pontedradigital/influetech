import { supabase } from '../src/lib/supabase';
import { Alert } from '../types';

export const AlertService = {
    async getAll() {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');
        const userId = userData.user.id;

        const { data, error } = await supabase
            .from('Alert')
            .select('*')
            .eq('userId', userId)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        // Parse manual boolean if needed or database handles 0/1
        return data.map((d: any) => ({
            ...d,
            isRead: d.isRead === 1 || d.isRead === true
        })) as Alert[];
    },

    async markAsRead(id: string) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('Alert')
            .update({ isRead: 1 })
            .eq('id', id)
            .eq('userId', userData.user.id);

        if (error) throw error;
        return { success: true };
    },

    async generate() {
        // Since generation logic is complex and backend-side, we might keep the API call
        // OR try to trigger a Supabase function.
        // For now, let's keep the API call logic in the component OR assume this service won't handle generation directly yet
        // unless we port the logic to client-side (which might be heavy).
        // Let's rely on the component calling the API for generation, but reading via this service.
        return { success: true, message: 'Generation handled by backend API' };
    }
};
