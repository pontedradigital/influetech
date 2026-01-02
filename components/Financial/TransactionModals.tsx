import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const EXPENSE_CATEGORIES = [
    'Imposto',
    'Marketing',
    'Frete',
    'Compras em Geral',
    'Serviço',
    'Outros'
];

const INCOME_CATEGORIES = [
    'Post Pago',
    'Publi',
    'Venda de Afiliação',
    'Outros'
];

export const TransactionModal = ({ isOpen, onClose, type, onSuccess }: {
    isOpen: boolean;
    onClose: () => void;
    type: 'INCOME' | 'EXPENSE';
    onSuccess: () => void;
}) => {
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('BRL');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setCurrency('BRL');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setDescription('');
            setCategory(type === 'INCOME' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
        }
    }, [isOpen, type]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !name) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        try {
            await api.post('/financial', {
                type,
                amount: parseFloat(amount),
                description,
                name,
                currency,
                date,
                category,
                // userId is handled by backend from token
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Erro ao criar transação:', error);
            alert(`Erro ao criar transação: ${error.message || 'Erro desconhecido'}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className={`material-symbols-outlined ${type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                            {type === 'INCOME' ? 'trending_up' : 'trending_down'}
                        </span>
                        {type === 'INCOME' ? 'Nova Receita' : 'Nova Despesa'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Nome do Lançamento <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                                placeholder={type === 'INCOME' ? "Ex: Publi Coca-Cola" : "Ex: Pagamento Editor"}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Moeda
                            </label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                            >
                                <option value="BRL">Real (BRL)</option>
                                <option value="USD">Dólar (USD)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Valor <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                    {currency === 'BRL' ? 'R$' : '$'}
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    className="w-full h-11 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Data <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Categoria <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                            >
                                {(type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Descrição <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow resize-none"
                                placeholder="Detalhes adicionais..."
                            />
                        </div>
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
                            className={`px-6 py-2.5 font-bold text-white rounded-lg shadow-lg shadow-offset-2 transition-all transform active:scale-95 ${type === 'INCOME'
                                ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20'
                                : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                                }`}
                        >
                            {type === 'INCOME' ? 'Salvar Receita' : 'Salvar Despesa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Excluir Transação</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Tem certeza que deseja excluir esta transação? Essa ação não pode ser desfeita.</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Cancelar
                        </button>
                        <button onClick={onConfirm} className="flex-1 h-11 rounded-lg bg-red-600 font-bold text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
