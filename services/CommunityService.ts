import { supabase } from '../src/lib/supabase';

export const CommunityService = {
    async getPosts(userId?: string) {
        const currentUserId = localStorage.getItem('userId');
        if (!currentUserId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('CommunityPost')
            .select(`
                *,
                user:User(name, email),
                comments:PostComment(count),
                reactions:PostReaction(count)
            `)
            .order('createdAt', { ascending: false })
            .limit(50);

        if (error) throw error;
        return data;
    },

    async createPost(content: string) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('CommunityPost')
            .insert([{ content, userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deletePost(postId: string) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('CommunityPost')
            .delete()
            .eq('id', postId)
            .eq('userId', userId);

        if (error) throw error;
        return { success: true };
    },

    async reactToPost(postId: string, type: 'LIKE' | 'HYPE') {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        // Check if reaction exists
        const { data: existing } = await supabase
            .from('PostReaction')
            .select('id')
            .eq('postId', postId)
            .eq('userId', userId)
            .eq('type', type)
            .single();

        if (existing) {
            // Remove reaction
            await supabase
                .from('PostReaction')
                .delete()
                .eq('id', existing.id);
        } else {
            // Add reaction
            await supabase
                .from('PostReaction')
                .insert([{ postId, userId, type }]);
        }

        return { success: true };
    }
};
