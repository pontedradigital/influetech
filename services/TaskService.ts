import { supabase } from '../src/lib/supabase';

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const TaskService = {
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
            .from('Task')
            .select('*')
            .eq('userId', userId)
            .order('dueDate', { ascending: true });

        if (error) throw error;
        return data;
    },

    async create(task: any) {
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

        const newId = generateUUID();

        const { data, error } = await supabase
            .from('Task')
            .insert([{
                ...task,
                id: newId,
                userId
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any) {
        const { data, error } = await supabase
            .from('Task')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('Task')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    }
};
