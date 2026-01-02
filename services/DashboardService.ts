import { supabase } from '../src/lib/supabase';

export const DashboardService = {
    async getStats() {
        try {
            // Get user ID from localStorage
            const userId = localStorage.getItem('userId');

            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Parallel queries for better performance
            const [
                productsResult,
                salesResult,
                shipmentsResult,
                bazarResult,
                tasksResult,
                goalResult
            ] = await Promise.all([
                // Products in inventory
                supabase
                    .from('Product')
                    .select('id', { count: 'exact', head: true })
                    .eq('userId', userId)
                    .eq('status', 'RECEIVED'),

                // Revenue this month
                supabase
                    .from('Sale')
                    .select('salePrice')
                    .eq('userId', userId)
                    .gte('saleDate', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),

                // Pending shipments
                supabase
                    .from('Shipment')
                    .select('id', { count: 'exact', head: true })
                    .eq('userId', userId)
                    .eq('status', 'pending'),

                // Next bazar event
                supabase
                    .from('BazarEvent')
                    .select('*')
                    .eq('userId', userId)
                    .gte('date', new Date().toISOString())
                    .order('date', { ascending: true })
                    .limit(1)
                    .maybeSingle(),

                // Recent tasks
                supabase
                    .from('Task')
                    .select('*')
                    .eq('userId', userId)
                    .order('dueDate', { ascending: true })
                    .limit(5),

                // Financial goal
                supabase
                    .from('FinancialGoal')
                    .select('*')
                    .eq('userId', userId)
                    .eq('status', 'ACTIVE')
                    .order('createdAt', { ascending: false })
                    .limit(1)
                    .maybeSingle()
            ]);

            // Calculate total revenue
            const totalRevenue = salesResult.data?.reduce((sum, sale) => sum + parseFloat(sale.salePrice || '0'), 0) || 0;

            // Get recent sales with product info
            const recentSalesResult = await supabase
                .from('Sale')
                .select(`
                    *,
                    product:Product(name)
                `)
                .eq('userId', userId)
                .order('saleDate', { ascending: false })
                .limit(5);

            // Get revenue history (last 6 months)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const revenueHistoryResult = await supabase
                .from('Sale')
                .select('salePrice, saleDate')
                .eq('userId', userId)
                .gte('saleDate', sixMonthsAgo.toISOString());

            // Group by month
            const monthlyRevenue = (revenueHistoryResult.data || []).reduce((acc, sale) => {
                const month = new Date(sale.saleDate).toLocaleString('pt-BR', { month: 'short' });
                acc[month] = (acc[month] || 0) + parseFloat(sale.salePrice || '0');
                return acc;
            }, {} as Record<string, number>);

            const revenueHistory = Object.entries(monthlyRevenue).map(([month, value]) => ({
                month,
                value
            }));

            // Get category distribution
            const categoryResult = await supabase
                .from('Product')
                .select('category')
                .eq('userId', userId);

            const categoryDistribution = (categoryResult.data || []).reduce((acc, product) => {
                const cat = product.category || 'Outros';
                const existing = acc.find(c => c.name === cat);
                if (existing) {
                    existing.value += 1;
                } else {
                    acc.push({ name: cat, value: 1 });
                }
                return acc;
            }, [] as Array<{ name: string; value: number }>);

            return {
                inventory: {
                    value: productsResult.count || 0,
                    label: 'Produtos em Estoque'
                },
                revenue: {
                    value: totalRevenue,
                    label: 'Faturamento do Mês'
                },
                shipments: {
                    value: shipmentsResult.count || 0,
                    label: 'Envios Pendentes'
                },
                bazar: bazarResult.data ? {
                    value: bazarResult.data.date,
                    title: bazarResult.data.title || 'Próximo Bazar'
                } : {
                    value: new Date(Date.now() + 864000000).toISOString(),
                    title: 'Sem eventos programados'
                },
                widgets: {
                    tasks: tasksResult.data || [],
                    goal: goalResult.data || { name: 'Sem metas ativas', currentAmount: 0, targetAmount: 0 },
                    recentSales: recentSalesResult.data || []
                },
                charts: {
                    revenueHistory,
                    categoryDistribution
                }
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    async getInsights() {
        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                throw new Error('User not authenticated');
            }

            const result = await supabase
                .from('Insight')
                .select('*')
                .eq('userId', userId)
                .order('createdAt', { ascending: false })
                .limit(10);

            return result.data || [];
        } catch (error) {
            console.error('Error fetching insights:', error);
            return [];
        }
    }
};

