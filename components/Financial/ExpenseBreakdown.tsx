import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FinancialService } from '../../services/FinancialService';

interface ExpenseBreakdownProps {
    month?: number;
    year?: number;
}

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444', '#6B7280'];

export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ month, year }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!month || !year) return;
            try {
                const result = await FinancialService.getSummary(month, year);
                const categories = result.expensesByCategory || {};
                const formattedData = Object.keys(categories).map((key, index) => ({
                    name: key,
                    value: categories[key],
                    color: COLORS[index % COLORS.length]
                })).filter(item => item.value > 0);

                // Sort by value desc
                formattedData.sort((a, b) => b.value - a.value);

                setData(formattedData);
            } catch (error) {
                console.error("Error fetching expense breakdown", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [month, year]);

    if (loading) return <div className="h-64 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl"></div>;

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <span className="material-symbols-outlined text-gray-400 text-3xl">donut_small</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sem dados de gastos</h3>
                <p className="text-gray-500 text-sm mt-1">Nenhuma despesa registrada neste período.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-pink-500">pie_chart</span>
                        Distribuição de Gastos
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Visualize para onde seu dinheiro está indo.</p>
                </div>
                <div className="group relative">
                    <span className="material-symbols-outlined text-gray-400 cursor-help text-xl hover:text-gray-600 transition-colors">help</span>
                    <div className="absolute right-0 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        Este gráfico mostra a proporção dos seus gastos por categoria. Use isso para identificar onde você pode economizar.
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
                {/* Chart Section */}
                <div className="relative w-full md:w-1/2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => `R$ ${value.toLocaleString()}`}
                                contentStyle={{ backgroundColor: '#1F2937', borderRadius: '8px', border: 'none', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Absolute Center Text - Perfectly aligned now */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Total</span>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                            {data.length}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium mt-1">Categorias</div>
                    </div>
                </div>

                {/* Custom Legend Section */}
                <div className="w-full md:w-1/2 flex flex-col gap-3 pr-4 h-64 overflow-y-auto custom-scrollbar">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                            </div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                                {((item.value / data.reduce((acc: number, curr: any) => acc + curr.value, 0)) * 100).toFixed(0)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
