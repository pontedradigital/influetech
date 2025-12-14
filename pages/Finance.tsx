import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

import { TransactionModal, DeleteConfirmModal } from '../components/Financial/TransactionModals';
import { GoalsSection } from '../components/Financial/GoalsSection';
import { RecurringExpenseList } from '../components/Financial/RecurringExpenseList';
import { MonthComparator } from '../components/Financial/MonthComparator';
import { PaymentCalendar } from '../components/Financial/PaymentCalendar';
import { AdRevenueCalculator } from '../components/Financial/AdRevenueCalculator';
import { FinancialInsights } from '../components/Financial/FinancialInsights';
import { TaxSimulatorModal } from '../components/Financial/TaxSimulatorModal';
import { ROICalculatorModal } from '../components/Financial/ROICalculatorModal';
import { ExpenseBreakdown } from '../components/Financial/ExpenseBreakdown';
import { IncomeTrend } from '../components/Financial/IncomeTrend';
import { AffiliateSection } from '../components/Financial/AffiliateSection';

export default function Finance() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PLANNING' | 'AFFILIATES' | 'ANALYSIS' | 'TOOLS'>('OVERVIEW');

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState({ income: 0, expenses: 0, profit: 0, expensesByCategory: {} });
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modals for Transactions
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Modals for Tools
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showROIModal, setShowROIModal] = useState(false);

  // Fetch Data
  const fetchSummary = () => {
    fetch(`/api/financial/summary?month=${selectedMonth}&year=${selectedYear}`)
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error('Erro ao buscar resumo:', err));
  };

  const fetchHistory = () => {
    fetch('/api/financial/history')
      .then(res => res.json())
      .then(data => setHistoryData(data))
      .catch(err => console.error('Erro ao buscar histórico:', err));
  };

  const fetchTransactions = () => {
    fetch(`/api/financial?month=${selectedMonth}&year=${selectedYear}`)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error('Erro ao buscar transações:', err));
  };

  const refreshData = () => {
    fetchSummary();
    fetchTransactions();
    fetchHistory();
  };

  useEffect(() => {
    refreshData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const response = await fetch(`/api/financial/${deletingId}`, { method: 'DELETE' });
      if (response.ok) refreshData();
    } catch (error) {
      console.error('Erro:', error);
    }
    setDeletingId(null);
  };

  // Chart Config
  const pieData = Object.entries(summary.expensesByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value as string)
  }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const months = [
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' }
  ];
  const years = [2023, 2024, 2025, 2026];

  return (
    <div className="space-y-8 pb-20">
      {/* --- Global Modals --- */}
      <DeleteConfirmModal isOpen={!!deletingId} onClose={() => setDeletingId(null)} onConfirm={confirmDelete} />
      <TransactionModal isOpen={showIncomeModal} onClose={() => setShowIncomeModal(false)} type="INCOME" onSuccess={refreshData} />
      <TransactionModal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} type="EXPENSE" onSuccess={refreshData} />
      <TaxSimulatorModal isOpen={showTaxModal} onClose={() => setShowTaxModal(false)} onTransactionCreated={refreshData} />
      <ROICalculatorModal isOpen={showROIModal} onClose={() => setShowROIModal(false)} onTransactionCreated={refreshData} />

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Financeiro</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestão 360º para Influenciadores</p>
        </div>

        {/* Month Selector always visible */}
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-medium"
          >
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-medium"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* --- Action Buttons (Quick Access) --- */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setShowIncomeModal(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95">
          <span className="material-symbols-outlined">add_circle</span> Receita
        </button>
        <button onClick={() => setShowExpenseModal(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95">
          <span className="material-symbols-outlined">remove_circle</span> Despesa
        </button>
        <button onClick={() => setShowTaxModal(true)} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-bold transition-all">
          <span className="material-symbols-outlined text-gray-400">account_balance</span> Impostos
        </button>
        <button onClick={() => setShowROIModal(true)} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-bold transition-all">
          <span className="material-symbols-outlined text-gray-400">monitoring</span> ROI
        </button>
      </div>

      {/* --- Tabs --- */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'OVERVIEW', label: 'Visão Geral', icon: 'dashboard' },
            { id: 'PLANNING', label: 'Planejamento', icon: 'savings' },
            { id: 'AFFILIATES', label: 'Ganhos Afiliações', icon: 'payments' },
            { id: 'ANALYSIS', label: 'Comparativo Mês a Mês', icon: 'query_stats' },
            { id: 'TOOLS', label: 'Ferramentas', icon: 'construction' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
              `}
            >
              <span className={`material-symbols-outlined mr-2 ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* --- Tab Content --- */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Receita</span>
                  <span className="material-symbols-outlined text-green-500">trending_up</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  R$ {summary.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Despesa</span>
                  <span className="material-symbols-outlined text-red-500">trending_down</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  R$ {summary.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Lucro Líquido</span>
                  <span className="material-symbols-outlined text-primary">monitoring</span>
                </div>
                <p className={`text-3xl font-bold mt-2 ${summary.profit >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600'}`}>
                  R$ {summary.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* AI Insights - NEW */}
            <FinancialInsights summary={summary} historyData={historyData} />

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-96">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Fluxo de Caixa (6 Meses)</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={historyData}>
                    <defs>
                      <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="receita" stroke="#16a34a" fillOpacity={1} fill="url(#colorRec)" />
                    <Area type="monotone" dataKey="despesa" stroke="#dc2626" fillOpacity={1} fill="url(#colorDes)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-96">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Por Categoria</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">Sem dados</div>
                )}
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Lançamentos Recentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Nome</th>
                      <th className="px-6 py-4">Categoria</th>
                      <th className="px-6 py-4">Valor</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.slice(0, 5).map(t => (
                      <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{t.name}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700">{t.category}</span></td>
                        <td className={`px-6 py-4 font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'INCOME' ? '+' : '-'} R$ {parseFloat(t.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setDeletingId(t.id)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {transactions.length > 5 && (
                  <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                    <button className="text-primary font-bold hover:underline">Ver todas</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'PLANNING' && (
          <div className="space-y-8">
            <GoalsSection onTransactionCreated={refreshData} />
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-8"></div>
            <RecurringExpenseList onTransactionCreated={refreshData} />
          </div>
        )}

        {activeTab === 'ANALYSIS' && (
          <div className="space-y-6">
            <MonthComparator />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseBreakdown month={selectedMonth} year={selectedYear} />
              <PaymentCalendar />
            </div>
            <IncomeTrend />
          </div>

        )}

        {activeTab === 'AFFILIATES' && (
          <AffiliateSection onTransactionCreated={refreshData} />
        )}

        {activeTab === 'TOOLS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AdRevenueCalculator onTransactionCreated={refreshData} />

              <div
                onClick={() => setShowTaxModal(true)}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-2xl">account_balance</span>
                  </div>
                  <h3 className="font-bold text-lg dark:text-white">Simulador de Impostos</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Descubra quanto você pagaria de imposto no Simples Nacional vs MEI vs Lucro Presumido.
                </p>
                <span className="text-blue-600 font-bold text-sm group-hover:underline">Simular agora &rarr;</span>
              </div>

              <div
                onClick={() => setShowROIModal(true)}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined text-2xl">monitoring</span>
                  </div>
                  <h3 className="font-bold text-lg dark:text-white">Calculadora ROI</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Calcule o Retorno sobre Investimento de suas campanhas ou compras de equipamentos.
                </p>
                <span className="text-green-600 font-bold text-sm group-hover:underline">Calcular agora &rarr;</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
