const API_URL = 'http://localhost:3001/api/dashboard';

export const DashboardService = {
    async getStats() {
        try {
            // Assuming headers handling or auth is done via global interceptor or not needed for dev
            // If auth is needed, usually we get token from localStorage
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`${API_URL}/stats`, { headers });
            if (!response.ok) throw new Error('Failed to fetch stats');
            return await response.json();
        } catch (error) {
            console.error(error);
            // MOCK DATA FOR FALLBACK
            return {
                inventory: { value: 124, label: 'Produtos em Estoque' },
                revenue: { value: 15430.50, label: 'Faturamento do Mês' },
                shipments: { value: 3, label: 'Envios Pendentes' },
                bazar: { value: new Date(Date.now() + 864000000).toISOString(), title: 'Bazar de Verão' },
                widgets: {
                    tasks: [
                        { id: 1, title: 'Enviar produtos para ganhadores', priority: 'HIGH', dueDate: new Date() },
                        { id: 2, title: 'Gravar stories de unboxing', priority: 'MEDIUM', dueDate: new Date(Date.now() + 86400000) }
                    ],
                    goal: { name: 'Compra de Câmera Nova', currentAmount: 3500, targetAmount: 8000 },
                    recentSales: [
                        { id: 101, customerName: 'João Silva', salePrice: 150.00, saleDate: new Date().toISOString(), product: { name: 'Kit Lentes' } },
                        { id: 102, customerName: 'Maria Oliveira', salePrice: 89.90, saleDate: new Date(Date.now() - 86400000).toISOString(), product: { name: 'Tripé Flexível' } }
                    ]
                },
                charts: {
                    revenueHistory: [
                        { month: 'Jan', value: 4000 },
                        { month: 'Fev', value: 3000 },
                        { month: 'Mar', value: 5500 },
                        { month: 'Abr', value: 9000 },
                        { month: 'Mai', value: 7500 },
                        { month: 'Jun', value: 15430 }
                    ],
                    categoryDistribution: [
                        { name: 'Eletrônicos', value: 400 },
                        { name: 'Acessórios', value: 300 },
                        { name: 'Moda', value: 300 },
                        { name: 'Outros', value: 200 }
                    ]
                }
            };
        }
    },

    async getInsights() {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`${API_URL}/insights`, { headers });
            if (!response.ok) throw new Error('Failed to fetch insights');
            return await response.json();
        } catch (error) {
            console.error(error);
            // MOCK DATA FOR FALLBACK
            return [
                {
                    id: '1',
                    type: 'SUGGESTION',
                    level: 'HIGH',
                    title: 'Oportunidade de Crescimento',
                    message: 'Seus vídeos de review tiveram 40% mais engajamento esta semana. Considere fazer mais conteúdo nesse formato.'
                },
                {
                    id: '2',
                    type: 'INFO',
                    level: 'MEDIUM',
                    title: 'Bazar chegando',
                    message: 'Faltam 10 dias para o Bazar de Verão. Verifique seu estoque.'
                }
            ];
        }
    }
};
