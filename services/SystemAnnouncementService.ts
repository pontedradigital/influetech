import { supabase } from '../src/lib/supabase';

export interface SystemAnnouncement {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'UPDATE' | 'NEWS';
    active: boolean;
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
    createdBy?: string;
}

export const SystemAnnouncementService = {
    // Admin: List all
    async getAll() {
        const { data, error } = await supabase
            .from('SystemAnnouncement')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data as SystemAnnouncement[];
    },

    // Public: List active only
    async getActive() {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('SystemAnnouncement')
            .select('*')
            .eq('active', true)
            .or(`expiresAt.is.null,expiresAt.gt.${now}`)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data as SystemAnnouncement[];
    },

    // Admin: Create
    async create(announcement: Partial<SystemAnnouncement>) {
        const { data: userData } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('SystemAnnouncement')
            .insert([{
                ...announcement,
                createdBy: userData.user?.id,
                updatedAt: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Update
    async update(id: string, updates: Partial<SystemAnnouncement>) {
        const { data, error } = await supabase
            .from('SystemAnnouncement')
            .update({
                ...updates,
                updatedAt: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Delete
    async delete(id: string) {
        const { error } = await supabase
            .from('SystemAnnouncement')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
