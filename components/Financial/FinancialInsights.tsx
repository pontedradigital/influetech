import React, { useMemo } from 'react';

interface FinancialInsightsProps {
    summary: {
        income: number;
        expenses: number;
        profit: number;
    };
    historyData: Array<{
        name: string;
        receita: number;
        despesa: number;
        lucro: number;
    }>;
}

export const FinancialInsights: React.FC<FinancialInsightsProps> = ({ summary, historyData }) => {

    const insights = useMemo(() => {
        const tips = [];
        const { income, expenses, profit } = summary;

        // 0. Verifica se tem dados suficientes
        if (income === 0 && expenses === 0) return [];

        // 1. Regra: Custos Fixos Altos / Margem de Lucro Baixa
        // Se despesas > 80% da receita
        if (income > 0 && (expenses / income) > 0.8) {
            tips.push({
                type: 'warning',
                icon: 'warning',
                title: 'Atenção aos Gastos',
                message: `Suas despesas representam ${((expenses / income) * 100).toFixed(0)}% da sua receita. Tente reduzir custos para aumentar sua margem.`,
                color: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800'
            });
        }

        // 2. Regra: Crescimento de Receita (Comparado ao mês anterior)
        // Pega o penúltimo mês do histórico (já que o último geralmente é o atual)
        // Nota: O histórico pode variar dependendo de como a API retorna, assumindo que o ultimo é o atual ou proximo
        if (historyData.length >= 2) {
            const lastMonth = historyData[historyData.length - 2];
            // Se o mês atual tiver receita maior que o mês anterior (supondo dados completos)
            // Como summary é do mês selecionado, e history é geral, precisamos ter cuidado. 
            // Simplificação: Se a receita atual for 10% maior que a média dos últimos 3 meses
            const avgIncome = historyData.slice(-3).reduce((acc, curr) => acc + curr.receita, 0) / Math.min(historyData.length, 3);

            if (income > avgIncome * 1.1 && avgIncome > 0) {
                tips.push({
                    type: 'success',
                    icon: 'trending_up',
                    title: 'Crescimento de Receita!',
                    message: `Sua receita atual está acima da média dos últimos meses. Ótimo trabalho!`,
                    color: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800'
                });
            }
        }

        // 3. Regra: Oportunidade de Investimento (Lucro alto)
        if (profit > 2000) {
            tips.push({
                type: 'info',
                icon: 'lightbulb',
                title: 'Oportunidade de Investimento',
                message: `Você tem R$ ${profit.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} de lucro neste mês. Que tal investir em novos equipamentos ou tráfego pago?`,
                color: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800'
            });
        }

        // 4. Regra: Prejuízo
        if (profit < 0) {
            tips.push({
                type: 'error',
                icon: 'trending_down',
                title: 'Mês no Vermelho',
                message: `Você gastou R$ ${Math.abs(profit).toLocaleString('pt-BR')} a mais do que recebeu. Revise suas despesas supérfluas.`,
                color: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800'
            });
        }

        return tips.slice(0, 3); // Limita a 3 dicas
    }, [summary, historyData]);

    if (insights.length === 0) {
        // Se não tiver insights (ou dados zerados), não mostra nada ou mostra placeholder discreto
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500">auto_awesome</span>
                Insights Inteligentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((tip, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${tip.color} flex flex-col gap-2 animate-in fade-in zoom-in duration-300`}>
                        <div className="flex items-center gap-2 font-bold">
                            <span className="material-symbols-outlined">{tip.icon}</span>
                            {tip.title}
                        </div>
                        <p className="text-sm opacity-90 leading-relaxed">
                            {tip.message}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
