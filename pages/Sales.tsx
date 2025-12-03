import React from 'react';

export default function Sales() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">Vendas</h1>
                <button className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95">
                    <span className="material-symbols-outlined">add_circle</span>
                    Nova Venda
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-gray-400">shopping_cart</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nenhuma venda registrada</h2>
                    <p className="text-gray-500 max-w-md">Registre suas vendas para acompanhar o desempenho financeiro e o histórico de transações.</p>
                </div>
            </div>
        </div>
    );
}
