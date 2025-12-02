
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const FinanceDashboard = () => {
  const data = [
    { name: 'Jan', receita: 4000, despesa: 2400 },
    { name: 'Fev', receita: 3000, despesa: 1398 },
    { name: 'Mar', receita: 2000, despesa: 9800 },
    { name: 'Abr', receita: 2780, despesa: 3908 },
    { name: 'Mai', receita: 1890, despesa: 4800 },
    { name: 'Jun', receita: 2390, despesa: 3800 },
  ];

  const pieData = [
    { name: 'Vendas', value: 400 },
    { name: 'Marketing', value: 300 },
    { name: 'Software', value: 300 },
    { name: 'Outros', value: 200 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Financeiro</h1>
          <p className="text-gray-500">Acompanhe suas receitas, despesas e lucros.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined">download</span> Exportar
          </button>
          <Link to="nova-transacao" className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-bold">
            <span className="material-symbols-outlined">add_circle</span> Nova Transação
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Receita Total</span>
            <span className="material-symbols-outlined text-green-500">trending_up</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">R$ 15.789,00</p>
          <p className="text-sm text-green-500 mt-1">+12% vs. mês passado</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Despesa Total</span>
            <span className="material-symbols-outlined text-red-500">trending_down</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">R$ 8.945,50</p>
          <p className="text-sm text-red-500 mt-1">+8% vs. mês passado</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Lucro Líquido</span>
            <span className="material-symbols-outlined text-primary">monitoring</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">R$ 6.843,50</p>
          <p className="text-sm text-green-500 mt-1">+15% vs. mês passado</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-96">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Receita vs. Despesa (6 Meses)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2463eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2463eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-96">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Despesas por Categoria</h3>
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
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Transações Recentes</h3>
          <div className="flex gap-2">
             <select className="bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-sm"><option>Últimos 30 dias</option></select>
          </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">15/06/2024</td>
                <td className="px-6 py-4">Venda do Bazar - Lote #12</td>
                <td className="px-6 py-4">Vendas</td>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Receita</span></td>
                <td className="px-6 py-4 text-right text-green-600 font-bold">+ R$ 1.250,00</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">14/06/2024</td>
                <td className="px-6 py-4">Assinatura Adobe</td>
                <td className="px-6 py-4">Software</td>
                <td className="px-6 py-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Despesa</span></td>
                <td className="px-6 py-4 text-right text-red-600 font-bold">- R$ 275,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NewTransaction = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Adicionar Nova Transação</h1>
        <p className="text-gray-500">Registre uma nova receita ou despesa no sistema.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="type" className="peer sr-only" defaultChecked />
              <div className="text-center py-3 rounded-lg border border-gray-300 dark:border-gray-600 peer-checked:bg-green-50 peer-checked:border-green-500 peer-checked:text-green-700 dark:peer-checked:bg-green-900/20 dark:peer-checked:text-green-400 font-medium">Receita</div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="type" className="peer sr-only" />
              <div className="text-center py-3 rounded-lg border border-gray-300 dark:border-gray-600 peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 dark:peer-checked:bg-red-900/20 dark:peer-checked:text-red-400 font-medium">Despesa</div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Categoria</label>
            <select className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4">
              <option>Venda de Produto</option>
              <option>Publicidade</option>
              <option>Bazar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Valor</label>
            <input type="text" placeholder="R$ 0,00" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Data</label>
          <input type="date" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4" defaultValue="2024-07-23" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea className="w-full h-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-4" placeholder="Adicione uma breve descrição..."></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Comprovante (Opcional)</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <span className="material-symbols-outlined text-4xl text-gray-400">upload_file</span>
            <p className="mt-2 text-sm text-gray-500">Clique para selecionar ou arraste um arquivo</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link to="/financeiro" className="px-6 py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</Link>
          <button className="px-6 py-2.5 font-bold text-white bg-primary hover:bg-primary-600 rounded-lg">Salvar Transação</button>
        </div>
      </div>
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
