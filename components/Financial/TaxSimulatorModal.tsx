import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const TaxSimulatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [revenue, setRevenue] = useState(10000);

    if (!isOpen) return null;

    const meiLimit = 81000 / 12; // 6750
    const simplesRate = 0.06; // 6% approx starting
    const lpRate = 0.1633; // ~16.33% Presumed Profit

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-500">account_balance</span>
                        Simulador de Impostos (BR)
                    </h3>
                    <button onClick={onClose}><span className="material-symbols-outlined dark:text-gray-400">close</span></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Faturamento Mensal (R$)</label>
                        <input
                            type="number"
                            value={revenue}
                            onChange={e => setRevenue(Number(e.target.value))}
                            className="w-full text-2xl font-bold p-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Simulação baseada em alíquotas médias para serviços de publicidade/marketing digital.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* MEI Card */}
                        <div className={`p-4 rounded-xl border ${revenue <= meiLimit ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-gray-800">MEI</span>
                                <span className="font-bold text-gray-800">~R$ 70,00</span>
                            </div>
                            <p className="text-xs text-gray-600">Fixo mensal (DAS)</p>
                            {revenue > meiLimit && <p className="text-xs text-red-500 font-bold mt-1">Acima do limite (R$ 6.750/mês)</p>}
                        </div>

                        {/* Simples Nacional */}
                        <div className="p-4 rounded-xl border bg-blue-50 border-blue-200">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-blue-900">Simples Nacional</span>
                                <span className="font-bold text-blue-900">R$ {(revenue * simplesRate).toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-blue-700">~6% sobre faturamento (Anexo III)</p>
                        </div>

                        {/* Lucro Presumido */}
                        <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-gray-800 dark:text-white">Lucro Presumido</span>
                                <span className="font-bold text-gray-800 dark:text-white">R$ {(revenue * lpRate).toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-500">~13.33% a 16.33% (Federal + Municipal)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
