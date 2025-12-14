import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ROICalculatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [cost, setCost] = useState(0);
    const [revenue, setRevenue] = useState(0);

    if (!isOpen) return null;

    const netProfit = revenue - cost;
    const roi = cost > 0 ? (netProfit / cost) * 100 : 0;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500">monitoring</span>
                        Calculadora ROI
                    </h3>
                    <button onClick={onClose}><span className="material-symbols-outlined dark:text-gray-400">close</span></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Custo do Investimento (R$)</label>
                        <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Receita Gerada (R$)</label>
                        <input type="number" value={revenue} onChange={e => setRevenue(Number(e.target.value))} className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <div className={`mt-6 p-6 rounded-xl border-2 text-center ${roi >= 0 ? 'border-green-100 bg-green-50 dark:bg-green-900/20' : 'border-red-100 bg-red-50 dark:bg-red-900/20'}`}>
                        <p className="text-sm font-medium text-gray-500">Retorno sobre Investimento</p>
                        <p className={`text-4xl font-black ${roi >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {roi.toFixed(1)}%
                        </p>
                        <p className="text-sm font-medium mt-2 dark:text-white">
                            Lucro Líquido: R$ {netProfit.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
