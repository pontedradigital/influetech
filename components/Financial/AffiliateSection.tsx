import React, { useState, useEffect } from 'react';

interface Platform {
    id: string;
    name: string;
    paymentTermDays: number;
    icon: string;
}

interface Earning {
    id: string;
    amount: number;
    requestDate: string;
    receiptDate: string;
    platformName: string;
    platformIcon: string;
    description?: string;
}

interface AffiliateSectionProps {
    onTransactionCreated?: () => void;
}

export const AffiliateSection: React.FC<AffiliateSectionProps> = ({ onTransactionCreated }) => {
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [earnings, setEarnings] = useState<Earning[]>([]);
    const [isEarningModalOpen, setIsEarningModalOpen] = useState(false);
    const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);

    // Form States
    const [newPlatform, setNewPlatform] = useState({ name: '', paymentTermDays: 30, icon: 'store' });
    const [newEarning, setNewEarning] = useState({ platformId: '', amount: '', requestDate: new Date().toISOString().split('T')[0], description: '' });

    const getUserId = () => {
        try {
            const u = localStorage.getItem('user');
            return u ? JSON.parse(u).id : null;
        } catch { return null; }
    };

    const fetchPlatforms = async () => {
        const res = await fetch('/api/affiliate-platforms');
        if (res.ok) setPlatforms(await res.json());
    };

    const fetchEarnings = async () => {
        const res = await fetch('/api/affiliate-earnings');
        if (res.ok) setEarnings(await res.json());
    };

    useEffect(() => {
        fetchPlatforms();
        fetchEarnings();
    }, []);

    const handleCreatePlatform = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/affiliate-platforms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newPlatform, userId: getUserId() })
        });
        setIsPlatformModalOpen(false);
        setNewPlatform({ name: '', paymentTermDays: 30, icon: 'store' });
        fetchPlatforms();
    };

    const handleCreateEarning = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/affiliate-earnings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newEarning,
                amount: parseFloat(newEarning.amount),
                userId: getUserId()
            })
        });

        if (res.ok) {
            setIsEarningModalOpen(false);
            setNewEarning({ platformId: '', amount: '', requestDate: new Date().toISOString().split('T')[0], description: '' });
            fetchEarnings();
            if (onTransactionCreated) onTransactionCreated();
        }
    };

    const handleDeleteEarning = async (id: string) => {
        if (!confirm('Remover este ganho?')) return;
        await fetch(`/api/affiliate-earnings/${id}`, { method: 'DELETE' });
        fetchEarnings();
        if (onTransactionCreated) onTransactionCreated();
    };

    return (
        <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-600">payments</span>
                        Ganhos Afiliações
                    </h2>
                    <p className="text-sm text-gray-500">Gerencie plataformas, saques e previsões de recebimento.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsPlatformModalOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300"
                    >
                        Gerenciar Plataformas
                    </button>
                    <button
                        onClick={() => setIsEarningModalOpen(true)}
                        className="px-4 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg shadow-purple-500/20 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Novo Saque
                    </button>
                </div>
            </div>

            {/* Platforms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {platforms.map(platform => (
                    <div key={platform.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                            <span className="material-symbols-outlined">{platform.icon || 'store'}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{platform.name}</h3>
                            <p className="text-xs text-gray-500">Pagamento: {platform.paymentTermDays} dias</p>
                        </div>
                    </div>
                ))}

                {/* Add Platform Button Card */}
                <button
                    onClick={() => setIsPlatformModalOpen(true)}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all text-left group"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-purple-600 transition-colors">
                        <span className="material-symbols-outlined">add</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 group-hover:text-purple-600 transition-colors">Nova Plataforma</h3>
                        <p className="text-xs text-gray-400">Cadastrar empresa</p>
                    </div>
                </button>
            </div>

            <div className="flex justify-between items-center mt-8">
                <h3 className="font-bold text-lg dark:text-white">Histórico de Saques e Ganhos</h3>
            </div>

            {/* Earnings List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3">Plataforma</th>
                            <th className="px-6 py-3">Data Solicitação</th>
                            <th className="px-6 py-3">Data Recebimento (Prevista)</th>
                            <th className="px-6 py-3">Valor</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {earnings.map(earning => (
                            <tr key={earning.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-400">{earning.platformIcon || 'store'}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{earning.platformName}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(earning.requestDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">
                                        {new Date(earning.receiptDate).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-green-600">
                                    R$ {Number(earning.amount).toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDeleteEarning(earning.id)} className="text-gray-400 hover:text-red-500">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {earnings.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Nenhum ganho registrado. Adicione suas plataformas e comece a controlar!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Platform Modal */}
            {isPlatformModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold dark:text-white">Gerenciar Plataformas</h3>
                            <button onClick={() => setIsPlatformModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* List Existing Platforms */}
                        <div className="space-y-3 mb-8">
                            <h4 className="text-sm font-bold text-gray-500 uppercase">Plataformas Cadastradas</h4>
                            {platforms.length === 0 && <p className="text-sm text-gray-400 italic">Nenhuma plataforma cadastrada.</p>}
                            {platforms.map(p => (
                                <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600">
                                            <span className="material-symbols-outlined text-sm">{p.icon || 'store'}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{p.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{p.paymentTermDays} dias prazo</p>
                                        </div>
                                    </div>
                                    {/* Ability to delete platform could be added here if needed */}
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Adicionar Nova</h4>
                        <form onSubmit={handleCreatePlatform} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nome (ex: Amazon)</label>
                                <input
                                    type="text"
                                    value={newPlatform.name}
                                    onChange={e => setNewPlatform({ ...newPlatform, name: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Nome da plataforma"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Prazo de Pagamento (Dias)</label>
                                <input
                                    type="number"
                                    value={newPlatform.paymentTermDays}
                                    onChange={e => setNewPlatform({ ...newPlatform, paymentTermDays: parseInt(e.target.value) })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">O sistema calculará a data de recebimento automaticamente baseada neste prazo.</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsPlatformModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">Salvar Plataforma</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Earning Modal */}
            {isEarningModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Novo Saque / Ganho</h3>
                        <form onSubmit={handleCreateEarning} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Plataforma</label>
                                <select
                                    value={newEarning.platformId}
                                    onChange={e => setNewEarning({ ...newEarning, platformId: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {platforms.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.paymentTermDays} dias)</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Valor Solicitado (R$)</label>
                                <input
                                    type="number"
                                    value={newEarning.amount}
                                    onChange={e => setNewEarning({ ...newEarning, amount: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Data da Solicitação</label>
                                <input
                                    type="date"
                                    value={newEarning.requestDate}
                                    onChange={e => setNewEarning({ ...newEarning, requestDate: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsEarningModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">Registrar Saque</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
