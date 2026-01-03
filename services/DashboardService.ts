
export const DashboardService = {
    async getStats() {
        // Mock data to prevent crash since backend is removed
        return {
            inventory: { value: 0, label: 'Produtos em Estoque' },
            revenue: { value: 0, label: 'Faturamento do Mês' },
            shipments: { value: 0, label: 'Envios Pendentes' },
            bazar: null,
            widgets: { tasks: [], goal: null, recentSales: [] },
            charts: { revenueHistory: [], categoryDistribution: [] }
        };
    },

    async getInsights() {
        return [];
    }
};
