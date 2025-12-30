import React, { useState, useEffect } from 'react';
import { DashboardService } from '../services/DashboardService';
import { Insight } from '../types';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, insightsData] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getInsights()
        ]);
        setStats(statsData);
        setInsights(insightsData);
      } catch (error) {
        console.error('Falha ao carregar dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'ALERT': return 'warning';
      case 'SUGGESTION': return 'lightbulb';
      case 'INFO': return 'info';
      default: return 'notifications';
    }
  };

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fallback stats
  const displayStats = stats || {
    inventory: { value: 0, label: 'Produtos em Estoque' },
    revenue: { value: 0, label: 'Faturamento do Mês' },
    shipments: { value: 0, label: 'Envios Pendentes' },
    bazar: null,
    widgets: { tasks: [], goal: null, recentSales: [] },
    charts: { revenueHistory: [], categoryDistribution: [] }
  };

  // Featured Insight (first high priority or most recent)
  const featuredInsight = insights.find(i => i.level === 'HIGH') || insights[0];
  const otherInsights = insights.filter(i => i.id !== featuredInsight?.id).slice(0, 3);

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Visão 360º do seu negócio.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Nova Venda', icon: 'shopping_cart', to: '/vendas?action=new', color: 'bg-blue-600' },
          { label: 'Novo Post', icon: 'post_add', to: '/agenda?action=new', color: 'bg-pink-600' },
          { label: 'Nova Tarefa', icon: 'check_circle', to: '/agenda?tab=tasks', color: 'bg-green-600' },
          { label: 'Novo Envio', icon: 'local_shipping', to: '/envios?action=new', color: 'bg-yellow-600' },
        ].map((action, idx) => (
          <Link key={idx} to={action.to} className={`${action.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 font-bold text-lg`}>
            <span className="material-symbols-outlined text-2xl">{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>

      {/* Hero Insight Section */}
      {featuredInsight && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hero Card */}
          <div className={`lg:col-span-2 rounded-2xl p-8 relative overflow-hidden shadow-xl flex flex-col justify-center text-white ${featuredInsight.level === 'HIGH' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 opacity-90">
                <span className="material-symbols-outlined text-3xl">{getInsightIcon(featuredInsight.type)}</span>
                <span className="font-bold text-sm uppercase tracking-widest">{featuredInsight.type === 'ALERT' ? 'Atenção Necessária' : 'Sugestão Inteligente'}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{featuredInsight.title}</h2>
              <p className="text-lg opacity-95 max-w-2xl">{featuredInsight.message}</p>
            </div>
            <span className="material-symbols-outlined absolute -right-10 -bottom-10 text-[12rem] opacity-20 rotate-12">auto_awesome</span>
          </div>

          {/* Side List */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase px-2">Outros Insights</h3>
            {otherInsights.map(insight => (
              <div key={insight.id} className={`p-4 rounded-xl border-l-4 shadow-sm bg-white dark:bg-[#1A202C] ${insight.level === 'HIGH' ? 'border-red-500' : 'border-blue-500'}`}>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{insight.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{insight.message}</p>
              </div>
            ))}
            {insights.length === 0 && <p className="text-sm text-gray-400 p-4">Tudo tranquilo por aqui.</p>}
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Inventory */}
        <div className="p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A202C] shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{displayStats.inventory.label}</p>
            <span className="material-symbols-outlined text-gray-400">inventory_2</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{displayStats.inventory.value} <span className="text-base font-normal text-gray-400">items</span></p>
        </div>

        {/* Revenue */}
        <div className="p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A202C] shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{displayStats.revenue.label}</p>
            <span className="material-symbols-outlined text-green-500">payments</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayStats.revenue.value)}
          </p>
        </div>

        {/* Shipments */}
        <div className="p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A202C] shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{displayStats.shipments.label}</p>
            <span className="material-symbols-outlined text-yellow-500">local_shipping</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{displayStats.shipments.value} <span className="text-base font-normal text-gray-400">pendentes</span></p>
        </div>

        {/* Next Bazar */}
        <div className="p-6 rounded-xl border border-primary bg-primary/5 dark:bg-primary/10 transition-all hover:shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-sm font-medium text-primary">Próximo Bazar</p>
            <span className="material-symbols-outlined text-primary">event</span>
          </div>
          {displayStats.bazar ? (
            <>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1 relative z-10">
                {new Date(displayStats.bazar.value).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 relative z-10 truncate">
                {displayStats.bazar.title}
              </p>
            </>
          ) : (
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400 relative z-10">Nenhum agendado</p>
          )}
          <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-primary/10 select-none">event_upcoming</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[400px]">
        {/* Area Chart: History */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A202C] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Evolução de Faturamento</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayStats.charts?.revenueHistory || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} tickFormatter={(v) => `R$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                />
                <Area type="monotone" dataKey="value" stroke="#4F46E5" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Categories */}
        <div className="bg-white dark:bg-[#1A202C] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Vendas por Categoria</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayStats.charts?.categoryDistribution || []}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(displayStats.charts?.categoryDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {(displayStats.charts?.categoryDistribution || []).map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-gray-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Vendas Recentes</h3>
          <div className="bg-white dark:bg-[#1A202C] rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col divide-y dark:divide-gray-800">
            {displayStats.widgets?.recentSales?.map((sale: any) => (
              <div key={sale.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">attach_money</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{sale.customerName}</p>
                    <p className="text-xs text-gray-500">{sale.product?.name || 'Produto'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.salePrice)}</p>
                  <p className="text-xs text-gray-400">{new Date(sale.saleDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
            {(!displayStats.widgets?.recentSales || displayStats.widgets.recentSales.length === 0) && (
              <div className="p-8 text-center text-gray-500">Nenhuma venda recente.</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Goal Widget */}
          {displayStats.widgets?.goal ? (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-full group transition-all hover:scale-[1.01] hover:shadow-xl">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xs font-semibold opacity-75 uppercase tracking-wider mb-1">Meta Financeira</h3>
                    <p className="text-xl font-bold line-clamp-1" title={displayStats.widgets.goal.name}>{displayStats.widgets.goal.name}</p>
                  </div>
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm shadow-sm group-hover:bg-white/30 transition-colors">
                    <span className="material-symbols-outlined text-white">savings</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">{Math.round((displayStats.widgets.goal.currentAmount / displayStats.widgets.goal.targetAmount) * 100)}%</span>
                      <span className="text-sm opacity-80 pb-1">concluído</span>
                    </div>
                    <p className="text-sm font-medium opacity-90 pb-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayStats.widgets.goal.targetAmount)}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-black/20 rounded-full h-3 backdrop-blur-sm overflow-hidden border border-white/10">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                      style={{ width: `${Math.min((displayStats.widgets.goal.currentAmount / displayStats.widgets.goal.targetAmount) * 100, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mt-3 text-xs opacity-70">
                    <span>Atual: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayStats.widgets.goal.currentAmount)}</span>
                    <span>Faltam: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayStats.widgets.goal.targetAmount - displayStats.widgets.goal.currentAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Decorational Background Icon */}
              <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[10rem] opacity-5 select-none pointer-events-none group-hover:opacity-10 transition-opacity">flag_circle</span>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1A202C] rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">savings</span>
              <p className="text-gray-500 mb-2">Nenhuma meta ativa</p>
              <Link to="/financeiro" className="text-primary font-bold text-sm">Definir Meta</Link>
            </div>
          )}

          {/* Tasks Widget */}
          <div className="bg-white dark:bg-[#111621] rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Tarefas Prioritárias</h3>
              <Link to="/agenda" className="text-sm text-primary hover:underline">Ver Agenda</Link>
            </div>
            {displayStats.widgets?.tasks?.length > 0 ? (
              <div className="flex flex-col gap-3 flex-1">
                {displayStats.widgets.tasks.map((task: any) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg group">
                    <button className="mt-0.5 text-gray-400 hover:text-green-500 transition-colors">
                      <span className="material-symbols-outlined text-xl">radio_button_unchecked</span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                          {task.priority === 'HIGH' ? 'Alta' : task.priority}
                        </span>
                        {task.dueDate && <span className="text-[10px] text-gray-400">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 py-8 opacity-60">
                <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                <p className="text-sm">Tudo feito por hoje!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
