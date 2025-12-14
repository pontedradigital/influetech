import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

export const MonthComparator: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [monthA, setMonthA] = useState(new Date().getMonth()); // Previous month
    const [monthB, setMonthB] = useState(new Date().getMonth() + 1); // Current month
    const [yearA, setYearA] = useState(currentYear);
    const [yearB, setYearB] = useState(currentYear);

    const [dataA, setDataA] = useState<any>(null);
    const [dataB, setDataB] = useState<any>(null);

    const fetchMonthData = async (m: number, y: number, setData: Function) => {
        try {
            const res = await fetch(`/api/financial/summary?month=${m}&year=${y}`);
            if (res.ok) setData(await res.json());
        } catch (error) {
            console.error('Error fetching comp data');
        }
    };

    useEffect(() => {
        fetchMonthData(monthA, yearA, setDataA);
    }, [monthA, yearA]);

    useEffect(() => {
        fetchMonthData(monthB, yearB, setDataB);
    }, [monthB, yearB]);

    const months = [
        { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' }
    ];

    const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

    const renderDiff = (valA: number, valB: number, type: 'income' | 'expense' | 'profit') => {
        const diff = valB - valA;
        const percent = valA !== 0 ? ((diff / valA) * 100) : (valB > 0 ? 100 : 0);

        let color = 'text-gray-500';
        let bg = 'bg-gray-100 dark:bg-gray-700';
        let icon = 'remove';

        if (type === 'income' || type === 'profit') {
            if (diff > 0) { color = 'text-green-600 dark:text-green-400'; bg = 'bg-green-100 dark:bg-green-900/30'; icon = 'trending_up'; }
            if (diff < 0) { color = 'text-red-600 dark:text-red-400'; bg = 'bg-red-100 dark:bg-red-900/30'; icon = 'trending_down'; }
        } else {
            if (diff > 0) { color = 'text-red-600 dark:text-red-400'; bg = 'bg-red-100 dark:bg-red-900/30'; icon = 'trending_up'; } // More expenses = bad
            if (diff < 0) { color = 'text-green-600 dark:text-green-400'; bg = 'bg-green-100 dark:bg-green-900/30'; icon = 'trending_down'; } // Less expenses = good
        }

        return (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${color} ${bg}`}>
                <span className="material-symbols-outlined text-lg">{icon}</span>
                <span>{isFinite(percent) ? Math.abs(percent).toFixed(1) : 0}%</span>
                <span className="text-xs opacity-80 border-l border-current pl-2 ml-1">
                    {diff > 0 ? '+' : ''}R$ {Math.abs(diff).toFixed(0)}
                </span>
            </div>
        );
    };

    if (!dataA || !dataB) return <div className="p-8 text-center text-gray-500 animate-pulse">Carregando comparativo...</div>;

    const chartData = [
        { name: 'Receita', A: dataA.income, B: dataB.income },
        { name: 'Despesas', A: dataA.expenses, B: dataB.expenses },
        { name: 'Lucro', A: dataA.profit, B: dataB.profit },
    ];

    // Calculate biggest category changes
    const allCategories = new Set([...Object.keys(dataA.expensesByCategory || {}), ...Object.keys(dataB.expensesByCategory || {})]);
    const categoryAnalysis = Array.from(allCategories).map(cat => {
        const valA = dataA.expensesByCategory?.[cat] || 0;
        const valB = dataB.expensesByCategory?.[cat] || 0;
        const diff = valB - valA;
        return { category: cat, diff, valA, valB };
    }).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)).slice(0, 3); // Top 3 changes

    const monthNameA = months.find(m => m.value === monthA)?.label.substring(0, 3);
    const monthNameB = months.find(m => m.value === monthB)?.label.substring(0, 3);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <span className="material-symbols-outlined">compare_arrows</span>
                </div>
                Comparativo Mensal
            </h3>

            {/* Selectors */}
            <div className="flex justify-center items-center gap-4 mb-8 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 max-w-2xl mx-auto">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mês Base</span>
                    <select
                        value={monthA}
                        onChange={e => setMonthA(Number(e.target.value))}
                        className="bg-transparent font-bold text-lg text-gray-900 dark:text-white border-none focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </div>

                <div className="text-gray-400">
                    <span className="material-symbols-outlined text-3xl">arrow_right_alt</span>
                </div>

                <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mês Comparado</span>
                    <select
                        value={monthB}
                        onChange={e => setMonthB(Number(e.target.value))}
                        className="bg-transparent font-bold text-lg text-gray-900 dark:text-white border-none focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors text-right"
                    >
                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Chart */}
                <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barSize={40}>
                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={val => `R$${val / 1000}k`} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', borderRadius: '8px', border: 'none', color: '#fff' }}
                                formatter={(value: number) => formatCurrency(value)}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="A" name={monthNameA} fill="#94A3B8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="B" name={monthNameB} fill="#6366F1" radius={[4, 4, 0, 0]} >
                                {
                                    chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : (index === 1 ? '#EF4444' : '#6366F1')} />
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Detailed Stats */}
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors">
                            <div>
                                <div className="text-sm text-gray-500">Receita</div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(dataB.income)}</div>
                            </div>
                            {renderDiff(dataA.income, dataB.income, 'income')}
                        </div>
                        <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors">
                            <div>
                                <div className="text-sm text-gray-500">Despesas</div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(dataB.expenses)}</div>
                            </div>
                            {renderDiff(dataA.expenses, dataB.expenses, 'expense')}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/20 rounded-lg border border-gray-100 dark:border-gray-700">
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Lucro Líquido</div>
                                <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(dataB.profit)}</div>
                            </div>
                            {renderDiff(dataA.profit, dataB.profit, 'profit')}
                        </div>
                    </div>

                    {/* Top Changes */}
                    {categoryAnalysis.length > 0 && (
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Principais Mudanças</h4>
                            <div className="space-y-2">
                                {categoryAnalysis.map((cat, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-700 dark:text-gray-300">{cat.category}</span>
                                        <span className={cat.diff > 0 ? 'text-red-500' : 'text-green-500'}>
                                            {cat.diff > 0 ? '+' : ''}{formatCurrency(cat.diff)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
