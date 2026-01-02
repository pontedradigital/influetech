import { supabase } from '../src/lib/supabase';
import { calculateDateScore } from '../src/utils/dateScoring';

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
        const suggestions = [];
        const today = new Date();
        // Look ahead 180 days
        const daysToLookAhead = 180;

        for (let i = 1; i <= daysToLookAhead; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const scoreData = calculateDateScore(date);

            // Filter logic: Only keep dates with "Good" score (>= 70) OR if it's a weekend OR if it has an event
            // But user also wants to see "Bad" dates? Or just suggestions?
            // "Show bad dates" implies we might return them but categorize them.
            // However, listing EVERY day is too much.
            // Let's prioritize: Weekends, Fridays, and any date > 60 score.
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isFriday = dayOfWeek === 5;

            if (scoreData.score >= 60 || isWeekend || isFriday || scoreData.nearbyEvent) {
                // Ensure we don't spam. Limit to top choices per week?
                // For now, let's collect them all and maybe slice later or Frontend groups them.
                suggestions.push({
                    date: date.toISOString(),
                    score: scoreData.score,
                    reasons: scoreData.reasons,
                    nearbyEvent: scoreData.nearbyEvent,
                    dayOfWeek: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
                    isWeekend: isWeekend,
                    isPayday: scoreData.reasons.some(r => r.includes('pagamento')),
                    tips: scoreData.tips
                });
            }
        }

        // Sort by date ascending (Chronological order)
        return suggestions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },

    async getEvents() {
        // Alias to getAll
        return this.getAll();
    }
};
