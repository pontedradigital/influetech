import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockTrendsData = [
    { name: 'Seg', iphone: 4000, samsung: 2400, xiaomi: 2400 },
    { name: 'Ter', iphone: 3000, samsung: 1398, xiaomi: 2210 },
    { name: 'Qua', iphone: 2000, samsung: 9800, xiaomi: 2290 },
    { name: 'Qui', iphone: 2780, samsung: 3908, xiaomi: 2000 },
    { name: 'Sex', iphone: 1890, samsung: 4800, xiaomi: 2181 },
    { name: 'Sáb', iphone: 2390, samsung: 3800, xiaomi: 2500 },
    { name: 'Dom', iphone: 3490, samsung: 4300, xiaomi: 2100 },
];

const topProducts = [
    { id: 1, name: 'iPhone 16 Pro Max', growth: '+340%', sentiment: 95, status: 'Alta', image: 'https://placehold.co/100x100/png?text=iPhone' },
    { id: 2, name: 'MacBook Air M3', growth: '+280%', sentiment: 92, status: 'Alta', image: 'https://placehold.co/100x100/png?text=MacBook' },
    { id: 3, name: 'AirPods Pro 3', growth: '+245%', sentiment: 88, status: 'Média', image: 'https://placehold.co/100x100/png?text=AirPods' },
];

const upcomingLaunches = [
    { date: '15/Jan', name: 'Galaxy S25 Ultra', brand: 'Samsung', hype: 'Altíssimo' },
    { date: '20/Jan', name: 'Xiaomi 14T Pro', brand: 'Xiaomi', hype: 'Alto' },
    { date: '28/Jan', name: 'Nothing Phone 3', brand: 'Nothing', hype: 'Médio' },
];

const ProductPlanner = () => {
    return (
        <div className="p-8 bg-gray-50 dark:bg-[#111621] min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Planejador de Produtos</h1>
                <p className="text-gray-500 mt-2">Inteligência Artificial para monitorar tendências e identificar oportunidades.</p>
            </div>

            {/* Top Section: Trends Chart & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tendências de Busca (Google Trends)</h2>
                        <select className="bg-gray-100 dark:bg-gray-700 border-none rounded-lg px-4 py-2 text-sm">
                            <option>Últimos 7 dias</option>
                            <option>Últimos 30 dias</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockTrendsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="iphone" stroke="#8884d8" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="samsung" stroke="#82ca9d" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="xiaomi" stroke="#ffc658" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Resumo de Oportunidades</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/50">
                            <div>
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Alta Probabilidade</p>
                                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">15</h3>
                                <p className="text-xs text-green-600 dark:text-green-400">Produtos em alta</p>
                            </div>
                            <span className="material-symbols-outlined text-4xl text-green-500">trending_up</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                            <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Lançamentos</p>
                                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">8</h3>
                                <p className="text-xs text-blue-600 dark:text-blue-400">Próximos 30 dias</p>
                            </div>
                            <span className="material-symbols-outlined text-4xl text-blue-500">rocket_launch</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Top Products List */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🔥 Produtos em Alta (Top 3)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topProducts.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{product.name}</h3>
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                            Oportunidade {product.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500">Buscas</p>
                                    <p className="font-bold text-green-500">{product.growth}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Sentimento</p>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-gray-900 dark:text-white">{product.sentiment}%</span>
                                        <span className="text-yellow-400 text-xs">★</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 h-10 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-600 transition-colors">
                                    Solicitar
                                </button>
                                <button className="h-10 w-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <span className="material-symbols-outlined text-gray-500">visibility</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Section: Upcoming Launches */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">📅 Próximos Lançamentos</h2>
                    <button className="text-primary text-sm font-bold hover:underline">Ver Calendário Completo</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700">
                                <th className="pb-4 text-sm font-medium text-gray-500">Data</th>
                                <th className="pb-4 text-sm font-medium text-gray-500">Produto</th>
                                <th className="pb-4 text-sm font-medium text-gray-500">Marca</th>
                                <th className="pb-4 text-sm font-medium text-gray-500">Hype</th>
                                <th className="pb-4 text-sm font-medium text-gray-500">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {upcomingLaunches.map((launch, index) => (
                                <tr key={index} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="py-4 text-sm font-bold text-gray-900 dark:text-white">{launch.date}</td>
                                    <td className="py-4 text-sm text-gray-700 dark:text-gray-300">{launch.name}</td>
                                    <td className="py-4 text-sm text-gray-500">{launch.brand}</td>
                                    <td className="py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${launch.hype === 'Altíssimo' ? 'bg-red-100 text-red-700' :
                                                launch.hype === 'Alto' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {launch.hype}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <button className="text-primary text-sm font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                            Agendar Solicitação
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductPlanner;
