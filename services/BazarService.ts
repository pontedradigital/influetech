import { supabase } from '../src/lib/supabase';

export const BazarService = {
    async getAll() {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('BazarEvent')
            .select('*')
            .eq('userId', userId)
            .order('eventDate', { ascending: true });

        if (error) throw error;
        return data;
    },

    async create(event: any) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('BazarEvent')
            .insert([{ ...event, userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('BazarEvent')
            .update(updates)
            .eq('id', id)
            .eq('userId', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('BazarEvent')
            .delete()
            .eq('id', id)
            .eq('userId', userId);

        if (error) throw error;
        return { success: true };
    },

    // Alias methods for Bazar planner
    async getSuggestions() {
        // Mock suggestions for now - in future could fetch from Supabase
        const suggestions = [];
        const today = new Date();

        // Generate 6 months of suggestions (2 per month)
        for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
            const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);

            // Weekend suggestion
            const weekendDate = new Date(targetMonth);
            weekendDate.setDate(15); // Mid-month weekend

            suggestions.push({
                date: weekendDate.toISOString(),
                score: 85 + Math.floor(Math.random() * 15),
                reasons: ['Fim de semana - maior movimento', 'Boa data para vendas online'],
                dayOfWeek: weekendDate.toLocaleDateString('pt-BR', { weekday: 'long' }),
                isWeekend: weekendDate.getDay() === 0 || weekendDate.getDay() === 6,
                isPayday: false,
                tips: ['Divulgue com 1 semana de antecedência', 'Prepare estoque adequado']
            });
        }

        return suggestions;
    },

    async getEvents() {
        // Alias to getAll
        return this.getAll();
    }
};
```
