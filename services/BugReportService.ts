import { supabase } from '../src/lib/supabase';

export interface BugReport {
    id: string;
    userId: string;
    title: string;
    description: string;
    images: string[];
    status: string;
    adminMessage?: string;
    createdAt: string;
    updatedAt: string;
}

export const BugReportService = {
    async getAll() {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return [];

        const { data, error } = await supabase
            .from('BugReport')
            .select('*')
            .eq('userId', userData.user.id)
            .order('createdAt', { ascending: false });

        if (error) {
            console.error('Error fetching bug reports:', error);
            return [];
        }
        return data as BugReport[];
    },

    async create(report: { title: string; description: string; images: string[] }) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('BugReport')
            .insert([{
                id: crypto.randomUUID(),
                userId: userData.user.id,
                title: report.title,
                description: report.description,
                images: report.images, // Expecting array of Base64 strings or URLs
                status: 'Acompanhando',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }])
            .select() // Returning * is safer
            .single();

        if (error) {
            console.error('Error creating bug report:', error);
            throw error;
        }

        return data;
    }
};
