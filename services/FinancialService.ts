import { supabase } from '../src/lib/supabase';

export interface FinancialTransaction {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    description: string;
    name?: string;
    currency: string;
    date: string;
    category: string;
    status: string;
    userId: string;
    relatedId?: string;
    relatedType?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const FinancialService = {
    // List transactions with filtering
    async getAll(month: number, year: number) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return [];

        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

        const { data, error } = await supabase
            .from('FinancialTransaction')
            .select('*')
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }

        return data as FinancialTransaction[];
    },

    // Get summary (calculated on client)
    async getSummary(month: number, year: number) {
        const transactions = await this.getAll(month, year);

        let income = 0;
        let expenses = 0;
        const expensesByCategory: Record<string, number> = {};

        transactions.forEach(t => {
            const val = Number(t.amount);
            if (t.type === 'INCOME') {
                income += val;
            } else {
                expenses += val;
                // Sum by category
                if (expensesByCategory[t.category]) {
                    expensesByCategory[t.category] += val;
                } else {
                    expensesByCategory[t.category] = val;
                }
            }
        });

        return {
            income,
            expenses,
            profit: income - expenses,
            expensesByCategory
        };
    },

    // Get 6-month history (calculated on client)
    async getHistory() {
        const today = new Date();
        const months = [];

        // Parallel fetching is cleaner but let's do one query for 6 months range to be efficient
        const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1).toISOString();
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();

        const { data: transactions, error } = await supabase
            .from('FinancialTransaction')
            .select('*')
            .gte('date', startDate)
            .lte('date', endDate);

        if (error) {
            console.error('Error fetching history:', error);
            throw error;
        }

        // Group by month
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthLabel = date.toLocaleDateString('pt-BR', { month: 'short' });

            // Filter txs for this month
            const txs = transactions.filter((t: any) => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });

            const receita = txs.filter((t: any) => t.type === 'INCOME').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
            const despesa = txs.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, t: any) => acc + Number(t.amount), 0);

            months.push({
                name: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
                receita,
                despesa
            });
        }

        return months;
    },

    async create(transaction: Partial<FinancialTransaction>) {
        console.log('FinancialService.create called (v2)', transaction);
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        const now = new Date().toISOString();
        const payload = {
            ...transaction,
            id: crypto.randomUUID(),
            userId: userData.user.id,
            status: transaction.status || 'COMPLETED',
            currency: transaction.currency || 'BRL',
            createdAt: now,
            updatedAt: now,

            // Defensive coding: send snake_case too just in case DB schema is mixed
            created_at: now,
            updated_at: now
        };
        console.log('Sending payload to Supabase:', payload);

        const { data, error } = await supabase
            .from('FinancialTransaction')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error('Supabase Insert Error:', error);
            throw error;
        }
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('FinancialTransaction')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- GOALS ---
    Goals: {
        async getAll() {
            const { data, error } = await supabase.from('FinancialGoal').select('*').order('createdAt', { ascending: false });
            if (error) throw error;
            return data;
        },
        async create(goal: any) {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('User not authenticated');

            // Sanitize deadline
            const cleanGoal = { ...goal };
            if (cleanGoal.deadline === "") cleanGoal.deadline = null;

            const { data, error } = await supabase.from('FinancialGoal').insert([{
                ...cleanGoal,
                id: crypto.randomUUID(),
                userId: userData.user.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }]).select().single();
            if (error) throw error;
            return data;
        },
        async update(id: string, updates: any) {
            // Sanitize deadline
            const cleanUpdates = { ...updates };
            if (cleanUpdates.deadline === "") cleanUpdates.deadline = null;
            cleanUpdates.updatedAt = new Date().toISOString();

            const { data, error } = await supabase.from('FinancialGoal').update(cleanUpdates).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        async delete(id: string) {
            const { error } = await supabase.from('FinancialGoal').delete().eq('id', id);
            if (error) throw error;
        }
    },

    // --- RECURRING EXPENSES ---
    Recurring: {
        async getAll() {
            const { data, error } = await supabase.from('RecurringExpense').select('*').order('createdAt', { ascending: false });
            if (error) throw error;
            return data;
        },
        async create(expense: any) {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('User not authenticated');
            const { data, error } = await supabase.from('RecurringExpense').insert([{
                ...expense,
                id: crypto.randomUUID(),
                userId: userData.user.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }]).select().single();
            if (error) throw error;
            return data;
        },
        async update(id: string, updates: any) {
            const cleanUpdates = { ...updates };
            cleanUpdates.updatedAt = new Date().toISOString();
            const { data, error } = await supabase.from('RecurringExpense').update(cleanUpdates).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        async delete(id: string) {
            const { error } = await supabase.from('RecurringExpense').delete().eq('id', id);
            if (error) throw error;
        }
    },

    // --- AFFILIATES ---
    Affiliates: {
        async getPlatforms() {
            const { data, error } = await supabase.from('AffiliatePlatform').select('*').order('name');
            if (error) throw error;
            return data;
        },
        async createPlatform(platform: any) {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('User not authenticated');
            const { data, error } = await supabase.from('AffiliatePlatform').insert([{ ...platform, id: crypto.randomUUID(), userId: userData.user.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]).select().single();
            if (error) throw error;
            // Create initial earning? No, just platform.
            return data;
        },
        async getEarnings() {
            const { data, error } = await supabase.from('AffiliateEarning').select('*, platform:AffiliatePlatform(*)').order('requestDate', { ascending: false });
            if (error) throw error;
            return data;
        },
        async createEarning(earning: any) {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('User not authenticated');
            // receiptDate calc should happen client side or database trigger? Client side for now.
            const { data, error } = await supabase.from('AffiliateEarning').insert([{ ...earning, id: crypto.randomUUID(), userId: userData.user.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]).select().single();
            if (error) throw error;
            return data;
        },
        async deleteEarning(id: string) {
            const { error } = await supabase.from('AffiliateEarning').delete().eq('id', id);
            if (error) throw error;
        }
    }
};
