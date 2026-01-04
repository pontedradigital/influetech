import React, { useState, useEffect } from 'react';
import { FinancialService } from '../../services/FinancialService';

interface RecurringExpense {
    id: string;
    name: string;
    amount: number;
    frequency: string;
    category: string;
    active: number;
    nextDueDate?: string;
}

interface RecurringExpenseListProps {
    onTransactionCreated?: () => void;
}

export const RecurringExpenseList: React.FC<RecurringExpenseListProps> = ({ onTransactionCreated }) => {
    const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({ name: '', amount: '', frequency: 'MONTHLY', category: 'Serviço' });

    const getUserId = () => {
        try {
            const u = localStorage.getItem('user');
            return u ? JSON.parse(u).id : null;
        } catch { return null; }
    };

    const fetchExpenses = async () => {
        try {
            const data = await FinancialService.Recurring.getAll();
            setExpenses(data);
        } catch (error) {
            console.error('Failed to fetch expenses', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await FinancialService.Recurring.create({
                ...newExpense,
                amount: parseFloat(newExpense.amount),
            });

            // Auto-create the first transaction for immediate impact
            await FinancialService.create({
                type: 'EXPENSE',
                amount: parseFloat(newExpense.amount),
                description: `Assinatura: ${newExpense.name}`,
                name: newExpense.name,
                currency: 'BRL',
                date: new Date().toISOString(),
                category: newExpense.category,
                status: 'COMPLETED'
            });

            setIsModalOpen(false);
            setNewExpense({ name: '', amount: '', frequency: 'MONTHLY', category: 'Serviço' });
            fetchExpenses();
            if (onTransactionCreated) onTransactionCreated();
            alert('Assinatura salva e lançada nas despesas deste mês!');
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar assinatura.');
        }
    };

    const toggleActive = async (id: string, currentStatus: number) => {
        try {
            await FinancialService.Recurring.update(id, { active: currentStatus ? 0 : 1 });
            fetchExpenses();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remover esta assinatura?')) return;
        try {
            await FinancialService.Recurring.delete(id);
            fetchExpenses();
            if (onTransactionCreated) onTransactionCreated();
        } catch (err) {
            console.error(err);
        }
    };

    const totalMonthly = expenses
        .filter(e => e.active)
        .reduce((acc, curr) => acc + (curr.frequency === 'MONTHLY' ? Number(curr.amount) : Number(curr.amount) / 12), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500">calendar_month</span>
                    Assinaturas & Custos Fixos
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Adicionar
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Custo Mensal Estimado</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        R$ {totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3">Nome</th>
                            <th className="px-6 py-3">Valor</th>
                            <th className="px-6 py-3">Frequência</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {expenses.map(expense => (
                            <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{expense.name}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                    R$ {Number(expense.amount).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                        {expense.frequency === 'MONTHLY' ? 'Mensal' : 'Anual'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleActive(expense.id, expense.active)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${expense.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${expense.active ? 'translate-x-6' : 'translate-x-1'}`}
                                        />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(expense.id)} className="text-gray-400 hover:text-red-500">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {expenses.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Nenhuma assinatura cadastrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Nova Despesa Recorrente</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nome (ex: Spotify)</label>
                                <input
                                    type="text"
                                    value={newExpense.name}
                                    onChange={e => setNewExpense({ ...newExpense, name: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Valor (R$)</label>
                                <input
                                    type="number"
                                    value={newExpense.amount}
                                    onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Frequência</label>
                                <select
                                    value={newExpense.frequency}
                                    onChange={e => setNewExpense({ ...newExpense, frequency: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="MONTHLY">Mensal</option>
                                    <option value="YEARLY">Anual</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
