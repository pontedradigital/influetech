import React, { useState, useEffect } from 'react';
import { GoalCard } from './GoalCard';

interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    color?: string;
    icon?: string;
}

interface GoalsSectionProps {
    onTransactionCreated?: () => void;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({ onTransactionCreated }) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', deadline: '' });
    const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [fundAmount, setFundAmount] = useState('');
    const [registerAsExpense, setRegisterAsExpense] = useState(false);

    const getUserId = () => {
        try {
            const u = localStorage.getItem('user');
            return u ? JSON.parse(u).id : null;
        } catch { return null; }
    };

    const fetchGoals = async () => {
        try {
            const res = await fetch('/api/financial-goals');
            if (res.ok) setGoals(await res.json());
        } catch (error) {
            console.error('Failed to fetch goals');
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/financial-goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newGoal,
                    targetAmount: parseFloat(newGoal.targetAmount),
                    userId: getUserId()
                })
            });
            if (!res.ok) throw new Error('Failed to create goal');

            setIsModalOpen(false);
            setNewGoal({ name: '', targetAmount: '', deadline: '' });
            fetchGoals();
        } catch (error) {
            console.error('Error creating goal', error);
            alert('Erro ao criar meta. Verifique se o servidor está rodando.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir esta meta?')) return;
        await fetch(`/api/financial-goals/${id}`, { method: 'DELETE' });
        fetchGoals();
        if (onTransactionCreated) onTransactionCreated();
    };

    const openAddFundsModal = (id: string) => {
        setSelectedGoalId(id);
        setFundAmount('');
        setRegisterAsExpense(false);
        setIsAddFundsModalOpen(true);
    };

    const handleConfirmAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGoalId || !fundAmount) return;

        const amount = parseFloat(fundAmount);

        try {
            // Atomic update via backend
            await fetch(`/api/financial-goals/${selectedGoalId}/fund`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount,
                    createTransaction: registerAsExpense
                })
            });

            if (registerAsExpense && onTransactionCreated) {
                onTransactionCreated();
            }

            setIsAddFundsModalOpen(false);
            fetchGoals();
        } catch (error) {
            console.error('Error adding funds', error);
            alert('Erro ao adicionar fundos.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">flag</span>
                    Metas Financeiras
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Nova Meta
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map(goal => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        onAddFunds={() => openAddFundsModal(goal.id)}
                        onEdit={() => { }}
                        onDelete={handleDelete}
                    />
                ))}
                {goals.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                        <p>Nenhuma meta definida. Comece a planejar seus sonhos!</p>
                    </div>
                )}
            </div>

            {/* Create Goal Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Nova Meta</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nome da Meta</label>
                                <input
                                    type="text"
                                    value={newGoal.name}
                                    onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Ex: Viagem, Câmera Nova..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Valor Alvo (R$)</label>
                                <input
                                    type="number"
                                    value={newGoal.targetAmount}
                                    onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Prazo (Opcional)</label>
                                <input
                                    type="date"
                                    value={newGoal.deadline}
                                    onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
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
                                    className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark"
                                >
                                    Criar Meta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Funds Modal */}
            {isAddFundsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl slide-in-bottom">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold dark:text-white">Adicionar Economia</h3>
                            <button onClick={() => setIsAddFundsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleConfirmAddFunds} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Valor a Adicionar (R$)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                                    <input
                                        type="number"
                                        value={fundAmount}
                                        onChange={e => setFundAmount(e.target.value)}
                                        className="w-full pl-10 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        placeholder="0.00"
                                        autoFocus
                                        required
                                    />
                                </div>
                            </div>

                            <label className="flex items-start gap-2 p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={registerAsExpense}
                                    onChange={e => setRegisterAsExpense(e.target.checked)}
                                    className="mt-1 rounded text-primary focus:ring-primary"
                                />
                                <div className="text-sm">
                                    <span className="font-medium text-gray-900 dark:text-white block">Registrar como Despesa?</span>
                                    <span className="text-gray-500 text-xs">Isso criará uma transação de saída no seu fluxo de caixa para manter o saldo correto.</span>
                                </div>
                            </label>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddFundsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-500/20 text-sm flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    Confirmar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
