import { supabase } from '../src/lib/supabase';
import { ScheduledPost } from '../types';

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const ScheduledPostService = {
    async getAll() {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
            // Fallback to localStorage for hybrid auth states if necessary, or throw
            const localUser = localStorage.getItem('user');
            if (localUser) {
                const parsed = JSON.parse(localUser);
                if (parsed.id) return this.getAllForUser(parsed.id);
            }
            throw new Error('User not authenticated');
        }
        return this.getAllForUser(userData.user.id);
    },

    async getAllForUser(userId: string) {
        const { data, error } = await supabase
            .from('ScheduledPost')
            .select('*')
            .eq('userId', userId)
            .order('scheduledFor', { ascending: true });

        if (error) throw error;
        return data as ScheduledPost[];
    },

    async create(post: any) {
        let userId;
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
            userId = userData.user.id;
        } else {
            const localUser = localStorage.getItem('user');
            if (localUser) {
                userId = JSON.parse(localUser).id;
            } else {
                throw new Error('User not authenticated');
            }
        }

        const newId = generateUUID();

        const { data, error } = await supabase
            .from('ScheduledPost')
            .insert([{
                ...post,
                id: newId, // Generate ID client-side
                userId,
                status: 'SCHEDULED',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any) {
        const { data, error } = await supabase
            .from('ScheduledPost')
            .update({ ...updates, updatedAt: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('ScheduledPost')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    },

    async publish(id: string) {
        const { data, error } = await supabase
            .from('ScheduledPost')
            .update({
                status: 'PUBLISHED',
                publishedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
