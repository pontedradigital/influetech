import React, { useState, useEffect } from 'react';

export const AdRevenueCalculator: React.FC = () => {
    const [views, setViews] = useState(10000);
    const [cpm, setCpm] = useState(2.50); // Default CPM
    const [platform, setPlatform] = useState('YouTube');

    const estimatedRevenue = (views / 1000) * cpm;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg shadow-purple-500/5 border-t-4 border-t-purple-500">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">play_circle</span>
                Calculadora de Ads
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Plataforma</label>
                    <div className="flex gap-2">
                        {['YouTube', 'TikTok', 'Instagram'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPlatform(p)}
                                className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${platform === p
                                        ? 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300 font-bold'
                                        : 'border-gray-200 dark:border-gray-700 text-gray-500'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Visualizações Estimadas</label>
                    <input
                        type="range"
                        min="1000"
                        max="1000000"
                        step="1000"
                        value={views}
                        onChange={(e) => setViews(Number(e.target.value))}
                        className="w-full"
                    />
                    <div className="text-right font-bold text-gray-700 dark:text-white mt-1">
                        {views.toLocaleString()} views
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">CPM Estimado ($)</label>
                    <input
                        type="number"
                        step="0.10"
                        value={cpm}
                        onChange={(e) => setCpm(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Receita Estimada</p>
                    <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                        $ {estimatedRevenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                        R$ {(estimatedRevenue * 5).toFixed(2)} (aprox.)
                    </p>
                </div>
            </div>
        </div>
    );
};
