
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BazarRecommendation } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const recommendations: BazarRecommendation[] = [
  {
    id: '1',
    title: '15 de Março - Dia do Consumidor',
    score: 92,
    revenueRange: 'R$ 9.500 - R$ 12.800',
    date: '15 Mar',
    insights: ['Data comercial de alto impacto', 'Estoque: 12 produtos', 'Competição: Média']
  },
  {
    id: '2',
    title: '28 de Novembro - Black Friday',
    score: 88,
    revenueRange: 'R$ 15.000 - R$ 22.500',
    date: '28 Nov',
    insights: ['Maior data comercial', 'Tendências em alta', 'Competição: Muito Alta']
  }
];

const BazarList = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Inteligência de Bazares</h1>
          <p className="text-gray-500">Recomendações para os próximos 90 dias</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex gap-1">
          {['30 dias', '60 dias', '90 dias'].map((t, i) => (
            <button key={t} className={`px-4 py-1.5 text-sm font-medium rounded-md ${i === 2 ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {recommendations.map(rec => (
          <div key={rec.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex flex-wrap justify-between items-start gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{rec.title}</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400 text-xl">{'★'.repeat(5)}</div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{rec.score}/100</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">KEY INSIGHTS</h3>
                  {rec.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className={`material-symbols-outlined text-base ${insight.includes('Alta') ? 'text-red-500' : 'text-green-500'}`}>
                        {insight.includes('Alta') ? 'warning' : 'check_circle'}
                      </span>
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Previsão</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">{rec.revenueRange}</p>
                
                <div className="flex gap-3 mt-6 justify-end">
                  <button onClick={() => navigate(`${rec.id}`)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-sm font-bold hover:bg-gray-200">VER ANÁLISE</button>
                  <button onClick={() => navigate('criar')} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-600">PLANEJAR BAZAR</button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Mock Breakdown Bars */}
               <div className="space-y-3">
                 <h4 className="text-xs font-bold text-gray-400 uppercase">Breakdown</h4>
                 {[
                   { l: 'Data Comercial', v: 90, c: 'bg-primary' },
                   { l: 'Estoque', v: 95, c: 'bg-primary' },
                   { l: 'Competição', v: 60, c: 'bg-yellow-500' }
                 ].map(item => (
                   <div key={item.l}>
                     <div className="flex justify-between text-xs mb-1 text-gray-600 dark:text-gray-300"><span>{item.l}</span><span>{item.v}/100</span></div>
                     <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${item.c}`} style={{ width: `${item.v}%` }}></div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BazarAnalysis = () => {
  const data = [
    { name: 'Sem 1', value: 4000 },
    { name: 'Sem 2', value: 7000 },
    { name: 'Sem 3', value: 5000 },
    { name: 'Sem 4', value: 9000 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/bazar" className="p-2 hover:bg-gray-100 rounded-full"><span className="material-symbols-outlined">arrow_back</span></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Análise Detalhada: Bazar de Inverno</h1>
          <p className="text-gray-500">Previsão baseada em dados históricos e tendências.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { l: 'Potencial de Venda', v: 'R$ 25.000', sub: '+15.2%', c: 'text-green-500' },
          { l: 'Público Alvo', v: '~15.7k seguidores', sub: '+2.1%', c: 'text-blue-500' },
          { l: 'Itens Sugeridos', v: '42', sub: '+8.0%', c: 'text-green-500' }
        ].map(stat => (
          <div key={stat.l} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 text-sm font-medium">{stat.l}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.v}</p>
            <p className={`text-sm font-bold mt-1 ${stat.c}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Projeção de Receita</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Line type="monotone" dataKey="value" stroke="#2463eb" strokeWidth={3} dot={{ r: 4, fill: '#2463eb', strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recomendações da IA</h3>
        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><span className="material-symbols-outlined">category</span></div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Focar em produtos de inverno</h4>
              <p className="text-sm text-gray-500">Casacos, botas e acessórios de lã tem alta performance nesta época.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><span className="material-symbols-outlined">local_shipping</span></div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Oferecer frete grátis</h4>
              <p className="text-sm text-gray-500">Aumenta conversão em 35% para compras acima de R$ 150.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateBazar = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white">Criar Bazar</h1>
      
      <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex gap-4 items-start">
        <span className="material-symbols-outlined text-primary mt-1">auto_awesome</span>
        <div>
          <p className="font-bold text-gray-900 dark:text-white">Sugestão da IA</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Formulário pré-preenchido com dados otimizados para maximizar suas vendas.</p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Bazar</label>
              <input type="text" className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 outline-none" defaultValue="Bazar de Inverno Tech" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
              <textarea className="w-full h-32 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 outline-none" defaultValue="Uma seleção exclusiva dos melhores gadgets..." />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cronograma</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Início</label>
              <input type="date" className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800" defaultValue="2024-07-25" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fim</label>
              <input type="date" className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800" defaultValue="2024-08-05" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Produtos</h2>
            <span className="text-sm text-primary font-bold">32 selecionados</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
             <input type="text" placeholder="Buscar produtos..." className="w-full h-10 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border-none focus:ring-1 focus:ring-primary" />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                    <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Produto {i}</p>
                      <p className="text-xs text-gray-500">Categoria</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded focus:ring-primary" />
                  </div>
                ))}
             </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:pl-64 flex justify-end gap-4 z-20">
        <button className="px-6 py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
        <button className="px-6 py-2.5 font-bold text-white bg-primary hover:bg-primary-600 rounded-lg shadow-lg shadow-primary/30">Confirmar Bazar</button>
      </div>
    </div>
  );
}

export default function Bazar() {
  return (
    <Routes>
      <Route path="/" element={<BazarList />} />
      <Route path="/criar" element={<CreateBazar />} />
      <Route path="/:id" element={<BazarAnalysis />} />
    </Routes>
  );
}
