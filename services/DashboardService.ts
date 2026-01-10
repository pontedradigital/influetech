import { supabase } from '../src/lib/supabase';
import { ProductService } from './ProductService';
import { SaleService } from './SaleService';
import { ShipmentService } from './ShipmentService';
import { BazarService } from './BazarService';
import { FinancialService } from './FinancialService';
import { TaskService } from './TaskService';
import { SystemAnnouncementService } from './SystemAnnouncementService';

export const DashboardService = {
    async getStats() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentYear = today.getFullYear();

            // Executar buscas em paralelo para performance
            const [
                products,
                financialSummary,
                shipments,
                bazares,
                tasks,
                goals,
                sales,
                financialHistory
            ] = await Promise.all([
                ProductService.getAvailableForSale(),
                FinancialService.getSummary(currentMonth, currentYear),
                ShipmentService.list(),
                BazarService.getAll(),
                TaskService.getAll(),
                FinancialService.Goals.getAll(),
                SaleService.getAll(),
                FinancialService.getHistory()
            ]);

            // 1. Processar Inventário
            const inventoryCount = products.length;

            // 2. Processar Faturamento (Receita do Mês)
            const revenueValue = financialSummary.income;

            // 3. Processar Envios Pendentes
            // Consideramos pendente tudo que não está 'delivered' ou 'cancelled'
            // Ajuste conforme os status reais do seu app (ex: 'pending', 'label_generated', 'posted')
            const pendingShipments = shipments.filter(s =>
                !['delivered', 'cancelled', 'entregue', 'cancelado'].includes(s.status.toLowerCase())
            ).length;

            // 4. Próximo Bazar
            // Filtrar bazares futuros e pegar o mais próximo
            const nextBazar = bazares
                .filter((b: any) => new Date(b.date) >= new Date(today.setHours(0, 0, 0, 0)))
                .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

            const bazarData = nextBazar ? {
                value: nextBazar.date,
                title: nextBazar.name || 'Bazar Agendado'
            } : null;

            // 5. Widgets
            // 5a. Tarefas Prioritárias (não concluídas)
            const activeTasks = tasks
                .filter((t: any) => t.status !== 'DONE')
                .sort((a: any, b: any) => {
                    // Prioridade: HIGH > MEDIUM > LOW
                    const pMap: any = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
                    return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
                })
                .slice(0, 5); // Top 5

            // 5b. Meta Ativa (pegar a primeira não concluída ou a mais recente)
            // Goal não tem status explicito no create, assumimos comparação current < target
            const activeGoal = goals.find((g: any) => g.currentAmount < g.targetAmount) || goals[0] || null;

            // 5c. Vendas Recentes
            const recentSales = sales.slice(0, 5);

            // 6. Gráficos
            // 6a. Histórico de Faturamento
            const revenueHistory = financialHistory.map((h: any) => ({
                month: h.name,
                value: h.receita
            })); // FinancialService retorna ordem cronológica (Antigo -> Novo), ideal para gráficos.
            // O FinancialService.getHistory constroi array invertido (i=5 ate 0), então [Mes-5, Mes-4 ... Mes Atual]
            // Porém o código faz push, então está na ordem cronológica (Antigo -> Novo).
            // Vamos verificar visualmente. Se array é [Jan, Fev, Mar], AreaChart renderiza esq->dir.
            // O código original do FinancialService já faz push do mais antigo para o novo?
            // "for (let i = 5; i >= 0; i--)" -> i=5 (antigo), i=0 (hoje).
            // "months.push(...)" -> Logo, o índice 0 é há 5 meses atrás. Está correto (Crescente).
            // Não precisa reverse se o chart espera esquerda(antigo) -> direita(novo).

            // 6b. Distribuição por Categoria (Baseado nas vendas ou produtos?)
            // O título era "Vendas por Categoria", então vamos agregar Sales -> Product -> Category
            const categoryMap: Record<string, number> = {};
            sales.forEach((sale: any) => {
                const cat = sale.product?.category || 'Outros';
                categoryMap[cat] = (categoryMap[cat] || 0) + Number(sale.salePrice);
            });

            const categoryDistribution = Object.entries(categoryMap)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value) // Maior valor primeiro
                .slice(0, 5); // Top 5 categorias

            return {
                inventory: { value: inventoryCount, label: 'Produtos em Estoque' },
                revenue: { value: revenueValue, label: 'Faturamento do Mês' },
                shipments: { value: pendingShipments, label: 'Envios Pendentes' },
                bazar: bazarData,
                widgets: {
                    tasks: activeTasks,
                    goal: activeGoal,
                    recentSales: recentSales
                },
                charts: {
                    revenueHistory: revenueHistory, // Mantem ordem original do service
                    categoryDistribution
                }
            };
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            // Retornar fallback silencioso ou re-throw dependendo da estratégia
            // Para UI não quebrar, retornamos null e o componente trata ou retornamos estrutura zerada
            throw error; // Deixa o componente tratar o erro (lá tem try/catch)
        }
    },

    async getInsights() {
        // Implementação simples de insights baseada nos dados
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const insights = [];

            // 0. AVISOS DO DASHBOARD (SystemAnnouncement) - Prioridade Máxima
            try {
                const announcements = await SystemAnnouncementService.getActive();
                for (const ann of announcements) {
                    let level = 'INFO';
                    if (ann.type === 'WARNING') level = 'HIGH';
                    if (ann.type === 'UPDATE' || ann.type === 'NEWS') level = 'MEDIUM';

                    insights.push({
                        id: `sys-${ann.id}`,
                        type: ann.type === 'WARNING' ? 'ALERT' : (ann.type === 'INFO' ? 'INFO' : 'SUGGESTION'),
                        level: level,
                        title: ann.title,
                        message: ann.message,
                        createdAt: ann.createdAt,
                        isSystem: true // Flag opcional se o frontend usar
                    });
                }
            } catch (e) {
                console.error('Falha ao buscar avisos do sistema', e);
            }

            // Exemplo 1: Verificar se tem envios pendentes acumulados
            const { count: pendingShipments } = await supabase
                .from('Shipment')
                .select('*', { count: 'exact', head: true })
                .eq('userId', user.id)
                .eq('status', 'pending');

            if (pendingShipments && pendingShipments > 3) {
                insights.push({
                    id: 'shipment-alert',
                    type: 'ALERT',
                    level: 'HIGH',
                    title: 'Envios Acumulados',
                    message: `Você tem ${pendingShipments} envios aguardando processamento.`,
                    createdAt: new Date().toISOString()
                });
            }

            // Exemplo 2: Dica de Bazar se não tiver nenhum agendado
            const { count: plannedBazares } = await supabase
                .from('BazarEvent')
                .select('*', { count: 'exact', head: true })
                .eq('userId', user.id)
                .gte('date', new Date().toISOString());

            if (plannedBazares === 0) {
                insights.push({
                    id: 'bazar-suggestion',
                    type: 'SUGGESTION',
                    level: 'MEDIUM',
                    title: 'Agende seu Bazar',
                    message: 'Que tal planejar seu próximo bazar para aumentar o faturamento?',
                    createdAt: new Date().toISOString()
                });
            }

            return insights;
        } catch (error) {
            console.error('Erro ao gerar insights:', error);
            return [];
        }
    }
};
