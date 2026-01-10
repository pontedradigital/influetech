import { supabase } from '../src/lib/supabase';
import { Alert } from '../types';

export const AlertService = {
    async getAll() {
        let userId;
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
            userId = userData.user.id;
        } else {
            const localUser = localStorage.getItem('user');
            if (localUser) {
                const parsed = JSON.parse(localUser);
                userId = parsed.id || localStorage.getItem('userId');
            } else {
                userId = localStorage.getItem('userId');
            }
        }

        if (!userId) throw new Error('User not authenticated');

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
        const { error } = await supabase
            .from('Alert')
            .update({ isRead: 1 })
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    },

    async generate() {
        return { success: true, message: 'Generation handled by backend API' };
    }
};
