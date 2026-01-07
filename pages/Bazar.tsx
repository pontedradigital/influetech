import React, { useState, useEffect } from 'react';
import PremiumFeatureWrapper from '../components/PremiumFeatureWrapper';
import { Product } from '../types';
import { BazarService } from '../services/BazarService';
import { ProductService } from '../services/ProductService';

interface BazarSuggestion {
  date: string;
  score: number;
  reasons: string[];
  nearbyEvent?: string;
  dayOfWeek: string;
  isWeekend: boolean;
  isPayday: boolean;
  tips: string[];
}

interface BazarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  productIds: string;
  status: string;
}

function BazarContent() {
  const [suggestions, setSuggestions] = useState<BazarSuggestion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bazarEvents, setBazarEvents] = useState<BazarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<BazarSuggestion | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoreModalData, setScoreModalData] = useState<BazarSuggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Suggestions (Local/Mock - should always work)
      try {
        const suggestionsData = await BazarService.getSuggestions();
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }

      // Fetch User Data (Products & Events) - might fail if auth issue
      try {
        const [allProducts, eventsData] = await Promise.all([
          ProductService.getAll(),
          BazarService.getEvents()
        ]);

        // 1. Identifica produtos já usados em outros bazares (exceto cancelados)
        const productsInUse = new Set<string>();
        eventsData.forEach(event => {
          if (event.status !== 'CANCELLED') {
            try {
              const ids = JSON.parse(event.productIds || '[]');
              if (Array.isArray(ids)) {
                ids.forEach(id => productsInUse.add(String(id)));
              }
            } catch (e) {
              console.error('Error parsing productIds for event:', event.id, e);
            }
          }
        });

        // 2. Filtra produtos: não vendidos E não usados em outros bazares
        setTotalProductsCount(allProducts.length);
        const invalidStatuses = ['SOLD', 'VENDIDO', 'SHIPPED', 'ENVIADO', 'SENT'];

        const availableProducts = allProducts.filter((p) => {
          const isSold = invalidStatuses.includes(p.status?.toUpperCase());
          const isInUse = productsInUse.has(p.id); // Check adherence to exclusivity rule
          return !isSold && !isInUse;
        });

        setProducts(availableProducts);
        setBazarEvents(eventsData);
      } catch (error) {
        console.error('Error fetching user data (products/events):', error);
      }

    } catch (error) {
      console.error('General error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Filter keys (YYYY-MM)
  const allMonths = Array.from(new Set(suggestions.map(s => {
    const d = new Date(s.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }))).sort();

  // Agrupa sugestões por mês (Filtered)
  const groupedSuggestions = suggestions
    .filter(s => {
      if (selectedMonth === 'all') return true;
      const d = new Date(s.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === selectedMonth;
    })
    .reduce((acc, suggestion) => {
      const date = new Date(suggestion.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(suggestion);
      return acc;
    }, {} as Record<string, BazarSuggestion[]>);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl">storefront</span>
            Planejador de Bazares
          </h1>
          <p className="text-gray-500 mt-1">Sugestões inteligentes para os próximos 6 meses</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-end md:items-center">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer font-medium"
            >
              <option value="all">Todos os Meses</option>
              {allMonths.map((monthKey: string) => {
                const [year, month] = monthKey.split('-');
                const label = `${monthNames[parseInt(month) - 1]} ${year}`;
                return <option key={monthKey} value={monthKey}>{label}</option>;
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total de Produtos</p>
              <p className="text-2xl font-black text-primary">{totalProductsCount}</p>
            </div>
            <div className="bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
              <p className="text-xs text-gray-600 dark:text-gray-400">Bazares Agendados</p>
              <p className="text-2xl font-black text-green-600">{bazarEvents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vantagens */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">lightbulb</span>
          Por que planejar seus bazares?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-blue-600 text-2xl">trending_up</span>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Maximize Vendas</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Venda em datas estratégicas com maior demanda</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-purple-600 text-2xl">calendar_clock</span>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Organize-se Melhor</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Planeje com antecedência e evite correria</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-green-600 text-2xl">psychology</span>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Insights Inteligentes</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Dicas personalizadas para cada data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sugestões por Mês */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-500 mt-4">Analisando melhores datas...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSuggestions).map(([monthKey, monthSuggestions]: [string, BazarSuggestion[]]) => {
            const [year, month] = monthKey.split('-');
            const monthIndex = parseInt(month) - 1;

            return (
              <div key={monthKey} className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  {monthNames[monthIndex]} {year}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {monthSuggestions.map((suggestion, index) => {
                    const date = new Date(suggestion.date);
                    const formattedDate = date.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short'
                    });

                    return (
                      <div
                        key={suggestion.date}
                        className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-primary transition-all hover:shadow-xl"
                      >
                        {/* Header do Card */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {suggestion.isWeekend && (
                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">
                                  FIM DE SEMANA
                                </span>
                              )}
                              {suggestion.nearbyEvent && (
                                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded">
                                  {suggestion.nearbyEvent}
                                </span>
                              )}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                              {formattedDate}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.dayOfWeek}</p>
                          </div>
                          {/* Score Circular Gauge */}
                          <div className="relative flex items-center justify-center">
                            <svg className="transform -rotate-90" width="90" height="90">
                              {/* Background circle */}
                              <circle
                                cx="45"
                                cy="45"
                                r="36"
                                stroke="currentColor"
                                strokeWidth="7"
                                fill="none"
                                className="text-gray-200 dark:text-gray-700"
                              />
                              {/* Progress circle */}
                              <circle
                                cx="45"
                                cy="45"
                                r="36"
                                stroke={suggestion.score >= 90 ? '#10b981' : suggestion.score >= 80 ? '#3b82f6' : suggestion.score >= 60 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="7"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 36} `}
                                strokeDashoffset={`${2 * Math.PI * 36 * (1 - suggestion.score / 100)} `}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                                style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
                              />
                            </svg>
                            {/* Score number in center */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className={`text - 3xl font - black ${suggestion.score >= 90 ? 'text-green-600' :
                                suggestion.score >= 80 ? 'text-blue-600' :
                                  suggestion.score >= 60 ? 'text-yellow-600' :
                                    'text-red-600'
                                } `}>
                                {suggestion.score}
                              </span>
                              <span className="text-[10px] text-gray-500 font-medium">/ 100</span>
                            </div>
                          </div>
                        </div>

                        {/* Score Label */}
                        <div className="mb-4">
                          <div className={`inline - flex items - center gap - 2 px - 3 py - 1.5 rounded - full text - xs font - bold ${suggestion.score >= 90 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            suggestion.score >= 80 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                              suggestion.score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            } `}>
                            <span className="material-symbols-outlined text-base">
                              {suggestion.score >= 90 ? 'star' : suggestion.score >= 80 ? 'thumb_up' : 'info'}
                            </span>
                            {suggestion.score >= 90 ? 'Excelente' : suggestion.score >= 80 ? 'Muito Bom' : suggestion.score >= 60 ? 'Bom' : 'Ruim / Arriscado'}
                          </div>
                        </div>

                        {/* Botão para Entender o Score */}
                        <button
                          onClick={() => {
                            setScoreModalData(suggestion);
                            setShowScoreModal(true);
                          }}
                          className="mb-4 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined">help</span>
                          Entenda o Score dessa Data
                        </button>

                        {/* Razões */}
                        <div className="space-y-2 mb-4">
                          <h4 className={`text-xs font-bold uppercase ${suggestion.score >= 60 ? 'text-gray-400' : 'text-red-500'}`}>
                            {suggestion.score >= 60 ? 'POR QUE ESTA DATA?' : 'POR QUE RECOMENDAMOS PULAR?'}
                          </h4>
                          {suggestion.reasons.map((reason, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className={`material-symbols-outlined text-sm mt-0.5 ${suggestion.score >= 60 ? 'text-green-600' : 'text-red-500'}`}>
                                {suggestion.score >= 60 ? 'check_circle' : 'warning'}
                              </span>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{reason}</p>
                            </div>
                          ))}
                        </div>

                        {/* Dicas */}
                        <div className="space-y-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                          <h4 className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                            Dicas para Aumentar Vendas
                          </h4>
                          {suggestion.tips.slice(0, 2).map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-blue-600 dark:text-blue-400 text-xs">💡</span>
                              <p className="text-xs text-gray-700 dark:text-gray-300">{tip}</p>
                            </div>
                          ))}
                        </div>

                        {/* Botão */}
                        <button
                          onClick={() => {
                            setSelectedSuggestion(suggestion);
                            setShowModal(true);
                          }}
                          className="w-full py-3 bg-primary hover:bg-primary-600 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined">add_circle</span>
                          Agendar Bazar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Agendamento */}
      {showModal && selectedSuggestion && (
        <BazarModal
          suggestion={selectedSuggestion}
          products={products}
          onClose={() => {
            setShowModal(false);
            setSelectedSuggestion(null);
          }}
          onSuccess={() => {
            fetchData();
            setShowModal(false);
            setSelectedSuggestion(null);
          }}
        />
      )}

      {/* Modal de Explicação do Score */}
      {showScoreModal && scoreModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined">analytics</span>
                Como Calculamos o Score
              </h2>
              <button onClick={() => setShowScoreModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Score desta data:</p>
                <div className="flex items-center justify-center gap-3">
                  <span className={`text - 5xl font - black ${scoreModalData.score >= 90 ? 'text-green-600' :
                    scoreModalData.score >= 80 ? 'text-blue-600' :
                      scoreModalData.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                    } `}>
                    {scoreModalData.score}
                  </span>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">/ 100</p>
                    <p className={`text - sm font - bold ${scoreModalData.score >= 90 ? 'text-green-600' :
                      scoreModalData.score >= 80 ? 'text-blue-600' :
                        scoreModalData.score >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                      } `}>
                      {scoreModalData.score >= 90 ? '🌟 Excelente' :
                        scoreModalData.score >= 80 ? '👍 Muito Bom' :
                          scoreModalData.score >= 60 ? '✅ Bom' :
                            '⚠️ Ruim / Arriscado'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Faixas de Classificação</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-2xl">🌟</span>
                    <div className="flex-1">
                      <p className="font-bold text-green-700 dark:text-green-300">Excelente (90-100 pontos)</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Melhor momento para realizar seu bazar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-2xl">👍</span>
                    <div className="flex-1">
                      <p className="font-bold text-blue-700 dark:text-blue-300">Muito Bom (80-89 pontos)</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Ótima data com alto potencial de vendas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="text-2xl">✅</span>
                    <div className="flex-1">
                      <p className="font-bold text-yellow-700 dark:text-yellow-300">Bom (60-79 pontos)</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Data favorável para vendas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-2xl">📊</span>
                    <div className="flex-1">
                      <p className="font-bold text-red-700 dark:text-red-300">Ruim (abaixo de 60)</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Data com histórico de vendas baixo ou feriados de viagem</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Fatores que Influenciam o Score</h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-xl">📅</span>
                    <div>
                      <p className="font-bold">Fim de semana: <span className="text-green-600">+25 pontos</span></p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Pessoas têm mais tempo livre para compras</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-xl">💰</span>
                    <div>
                      <p className="font-bold">Dia de pagamento: <span className="text-green-600">+20 pontos</span></p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">5º, 15º ou 25º dia do mês - maior poder de compra</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-xl">🎉</span>
                    <div>
                      <p className="font-bold">Evento comercial próximo: <span className="text-green-600">até +35 pontos</span></p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">10-12 dias antes é o sweet spot ideal para pré-venda</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="font-bold">Feriado prolongado: <span className="text-red-600">-15 pontos</span></p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Pessoas viajam, movimento reduzido</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>💡 Dica Importante:</strong> Datas com score acima de 80 têm maior potencial de vendas.
                  Combine o score alto com as dicas personalizadas para maximizar seus resultados!
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setShowScoreModal(false)}
                className="px-6 py-2.5 font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg shadow-lg shadow-purple-500/20 transition-all active:scale-95"
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal de Agendamento
function BazarModal({ suggestion, products, onClose, onSuccess }: {
  suggestion: BazarSuggestion;
  products: Product[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserId = () => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u).id : null;
    } catch { return null; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await BazarService.create({
        title,
        description,
        date: suggestion.date,
        location,
        productIds: JSON.stringify(selectedProducts)
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating bazar:', error);
    }
  };

  const date = new Date(suggestion.date);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined">storefront</span>
                Agendar Bazar
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 capitalize">{formattedDate}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                  Score: {suggestion.score}/100
                </span>
                {suggestion.nearbyEvent && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full">
                    {suggestion.nearbyEvent}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nome do Bazar *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="Ex: Bazar de Primavera"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none resize-none"
              placeholder="Descreva seu bazar..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Local (opcional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="Ex: Instagram, Loja Física, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Produtos ({selectedProducts.length} selecionados)
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none mb-3"
              placeholder="Buscar produtos..."
            />
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
              {filteredProducts.map(product => (
                <label
                  key={product.id}
                  className={`flex items - center gap - 3 p - 3 rounded - lg cursor - pointer transition - all ${selectedProducts.includes(product.id)
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    } `}
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts([...selectedProducts, product.id]);
                      } else {
                        setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                      }
                    }}
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">tips_and_updates</span>
              Dicas para este Bazar
            </h4>
            <ul className="space-y-1">
              {suggestion.tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                  <span>•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 font-bold text-white bg-primary hover:bg-primary-600 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Confirmar Bazar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Bazar() {
  return (
    <PremiumFeatureWrapper featureName="Planejador de Bazares">
      <BazarContent />
    </PremiumFeatureWrapper>
  );
}
