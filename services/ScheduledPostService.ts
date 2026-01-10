import { supabase } from '../src/lib/supabase';
import { ScheduledPost } from '../types';

export const ScheduledPostService = {
    async getAll() {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');
        const userId = userData.user.id;

        const { data, error } = await supabase
            .from('ScheduledPost')
            .select('*')
            .eq('userId', userId)
            .order('scheduledFor', { ascending: true });

        if (error) throw error;
        return data as ScheduledPost[];
    },

    async create(post: any) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');
        const userId = userData.user.id;

        const { data, error } = await supabase
            .from('ScheduledPost')
            .insert([{
                ...post,
                userId,
                status: 'SCHEDULED',
                // Platforms is stored as JSON string in definition, handled by frontend usually
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('ScheduledPost')
            .update({ ...updates, updatedAt: new Date().toISOString() })
            .eq('id', id)
            .eq('userId', userData.user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('ScheduledPost')
            .delete()
            .eq('id', id)
            .eq('userId', userData.user.id);

        if (error) throw error;
        return { success: true };
    },

    async publish(id: string) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('ScheduledPost')
            .update({
                status: 'PUBLISHED',
                publishedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            .eq('id', id)
            .eq('userId', userData.user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
