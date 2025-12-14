import React from 'react';

interface GoalCardProps {
    goal: {
        id: string;
        name: string;
        targetAmount: number;
        currentAmount: number;
        deadline?: string;
        color?: string;
        icon?: string;
    };
    onAddFunds: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onAddFunds, onEdit, onDelete }) => {
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const remaining = goal.targetAmount - goal.currentAmount;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{goal.icon || 'savings'}</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{goal.name}</h3>
                        {goal.deadline && (
                            <p className="text-xs text-gray-500">
                                Meta: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                            </p>
                        )}
                    </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    {/* Edit button could go here */}
                    <button
                        onClick={() => onDelete(goal.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                        R$ {Number(goal.currentAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-gray-500">
                        de R$ {Number(goal.targetAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, backgroundColor: goal.color || '#3b82f6' }}
                    />
                </div>

                <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-gray-500 font-medium">
                        {progress.toFixed(0)}% concluído
                    </p>
                    <button
                        onClick={() => onAddFunds(goal.id)}
                        className="text-xs font-bold text-primary hover:text-primary-dark bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
                    >
                        + Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
};
