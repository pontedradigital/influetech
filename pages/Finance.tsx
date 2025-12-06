import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const EXPENSE_CATEGORIES = [
  'Frete',
  'Compras em Geral',
  'Serviços',
  'Impostos',
  'Outras'
];

const INCOME_CATEGORIES = [
  'Vendas',
  'Afiliações'
];

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Excluir Transação</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Tem certeza que deseja excluir esta transação?</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancelar
            </button>
            <button onClick={onConfirm} className="flex-1 h-11 rounded-lg bg-red-600 font-bold text-white hover:bg-red-700 transition-colors">
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState({ income: 0, expenses: 0, profit: 0, expensesByCategory: {} });
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSummary = () => {
    fetch(`http://localhost:3001/api/financial/summary?month=${selectedMonth}&year=${selectedYear}`)
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error('Erro ao buscar resumo:', err));
  };

  const fetchHistory = () => {
    fetch('http://localhost:3001/api/financial/history')
      .then(res => res.json())
      .then(data => setHistoryData(data))
      .catch(err => console.error('Erro ao buscar histórico:', err));
  };

  const fetchTransactions = () => {
    fetch(`http://localhost:3001/api/financial?month=${selectedMonth}&year=${selectedYear}`)
      .then(res => res.json())
      .then(data => setTransactions(data.slice(0, 10))) // Last 10 transactions
      .catch(err => console.error('Erro ao buscar transações:', err));
  };

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const response = await fetch(`http://localhost:3001/api/financial/${deletingId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchSummary();
        fetchTransactions();
        fetchHistory();
      }
    } catch (error) {
      console.error('Erro:', error);
    }
    setDeletingId(null);
  };

  // Prepare pie chart data
  const pieData = Object.entries(summary.expensesByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value as string)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Generate month options
  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const years = [2023, 2024, 2025];

  return (
    <div className="space-y-8">
      <DeleteConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
      />

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Financeiro</h1>
          <p className="text-gray-500">Acompanhe suas receitas, despesas e lucros.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-medium"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-medium"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={() => navigate('nova-transacao')}
            className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            <span className="material-symbols-outlined">add_circle</span> Nova Transação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Receita Total</span>
            <span className="material-symbols-outlined text-green-500">trending_up</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            R$ {summary.income.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Despesa Total</span>
            <span className="material-symbols-outlined text-red-500">trending_down</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            R$ {summary.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Lucro Líquido</span>
            <span className="material-symbols-outlined text-primary">monitoring</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            R$ {summary.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-96 animate-in fade-in duration-1000">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Receita vs. Despesa (6 Meses)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2463eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2463eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="receita" stroke="#2463eb" fillOpacity={1} fill="url(#colorRec)" />
              <Area type="monotone" dataKey="despesa" stroke="#ef4444" fillOpacity={1} fill="url(#colorDes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-96 animate-in fade-in duration-1000">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Despesas por Categoria</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Nenhuma despesa registrada</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Transações Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nenhuma transação registrada neste mês.
                  </td>
                </tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4">{t.description}</td>
                    <td className="px-6 py-4">{t.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${t.type === 'INCOME'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                        {t.type === 'INCOME' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                      {t.type === 'INCOME' ? '+' : '-'} R$ {parseFloat(t.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeletingId(t.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NewTransaction = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Set default category when type changes
    if (type === 'INCOME') {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          description,
          date,
          category,
          userId: 'mock-id'
        })
      });

      if (response.ok) {
        navigate('/financeiro');
      } else {
        alert('Erro ao criar transação');
      }
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      alert('Erro ao criar transação');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Adicionar Nova Transação</h1>
        <p className="text-gray-500">Registre uma nova receita ou despesa no sistema.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tipo</label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="type"
                className="peer sr-only"
                checked={type === 'INCOME'}
                onChange={() => setType('INCOME')}
              />
              <div className="text-center py-3 rounded-lg border border-gray-300 dark:border-gray-600 peer-checked:bg-green-50 peer-checked:border-green-500 peer-checked:text-green-700 dark:peer-checked:bg-green-900/20 dark:peer-checked:text-green-400 font-medium">
                Receita
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="type"
                className="peer sr-only"
                checked={type === 'EXPENSE'}
                onChange={() => setType('EXPENSE')}
              />
              <div className="text-center py-3 rounded-lg border border-gray-300 dark:border-gray-600 peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 dark:peer-checked:bg-red-900/20 dark:peer-checked:text-red-400 font-medium">
                Despesa
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white"
            >
              {(type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Valor <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Data <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Descrição <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full h-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 text-gray-900 dark:text-white"
            placeholder="Adicione uma breve descrição..."
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/financeiro')}
            className="px-6 py-2.5 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 font-bold text-white bg-primary hover:bg-primary-600 rounded-lg"
          >
            Salvar Transação
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Finance() {
  return (
    <Routes>
      <Route path="/" element={<FinanceDashboard />} />
      <Route path="/nova-transacao" element={<NewTransaction />} />
    </Routes>
  );
}
