
import React from 'react';
import { Product } from '../types';

const Dashboard = () => {
  const stats = [
    { label: 'Total em Estoque', value: '1,204 produtos', trend: '+5.2% vs. mês passado', trendColor: 'text-green-600', icon: 'inventory_2' },
    { label: 'Faturamento do Mês', value: 'R$ 25.480,00', trend: '+12.8% vs. mês passado', trendColor: 'text-green-600', icon: 'payments' },
    { label: 'Envios Pendentes', value: '82', trend: '+3 hoje', trendColor: 'text-yellow-600', icon: 'local_shipping' },
    { label: 'Próximo Bazar', value: '15 Dez', sub: '+ R$ 12k estimado', trendColor: 'text-primary', icon: 'event', isSpecial: true },
  ];

  const recentProducts: Product[] = [
    { id: '1', name: 'Headphone Pro X', category: 'Eletrônicos', company: 'TechWave', receiveDate: '03 Nov, 2023', status: 'Em análise', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' },
    { id: '2', name: 'Chrono Watch', category: 'Acessórios', company: 'Timeless Co.', receiveDate: '01 Nov, 2023', status: 'Post Agendado', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80' },
    { id: '3', name: 'Galaxy Phone 22', category: 'Eletrônicos', company: 'Quantum Inc', receiveDate: '28 Out, 2023', status: 'Aguardando Envio', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em análise': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Post Agendado': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Aguardando Envio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Bem-vindo, Influenciador!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Aqui está o resumo da sua performance hoje.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm">
          <span className="material-symbols-outlined text-xl">add_circle</span>
          Novo Produto
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl border transition-all hover:shadow-md ${stat.isSpecial ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 bg-white dark:bg-[#1A202C] dark:border-gray-700'}`}>
            <div className="flex justify-between items-start mb-4">
              <p className={`text-sm font-medium ${stat.isSpecial ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>{stat.label}</p>
              <span className={`material-symbols-outlined ${stat.isSpecial ? 'text-primary' : 'text-gray-400'}`}>{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
            <p className={`text-sm font-medium ${stat.trendColor}`}>{stat.sub || stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Produtos Recentes</h2>
          <div className="bg-white dark:bg-[#1A202C] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
                  <tr>
                    <th className="px-6 py-4">Produto</th>
                    <th className="px-6 py-4">Empresa</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{product.company}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{product.receiveDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Next Scheduled Post */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Próxima Postagem</h2>
          <div className="bg-white dark:bg-[#1A202C] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="relative h-48 w-full">
              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80" alt="Social Media" className="h-full w-full object-cover" />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                Agendado
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-pink-600">
                <span className="material-symbols-outlined">videocam</span>
                <span className="text-sm font-bold">Instagram Reel</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Unboxing do novo Chrono Watch da Timeless Co.</h3>
              <div className="mt-auto flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <span className="material-symbols-outlined text-gray-500">calendar_month</span>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Amanhã, 10 de Nov às 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
