import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const StatCard: React.FC<{ title: string; value: string; icon: string; trend?: string; color: string }> = ({ title, value, icon, trend, color }) => (
    <div className="relative p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden group hover:bg-white/20 transition-all duration-300 shadow-lg">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
            <span className="material-symbols-outlined text-6xl">{icon}</span>
        </div>
        <div className="relative z-10 flex flex-col gap-1">
            <h3 className="text-slate-300 text-sm font-bold tracking-wide uppercase">{title}</h3>
            <p className="text-2xl font-black text-white">{value}</p>
            {trend && <span className={`text-xs font-bold ${color} mt-1`}>{trend}</span>}
        </div>
    </div>
);

const TransactionRow: React.FC<{ tx: any }> = ({ tx }) => {
    const statusColors = {
        paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
        pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
        overdue: 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
    };
    const statusLabels: any = { paid: 'Pago', pending: 'Pendente', overdue: 'Atrasado', active: 'Ativo' };

    return (
        <tr className="border-b border-white/5 hover:bg-white/10 transition-colors">
            <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                        {tx.user?.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-100 font-bold">{tx.user}</span>
                </div>
            </td>
            <td className="py-4 px-6 text-sm text-gray-300">{tx.description}</td>
            <td className="py-4 px-6 text-sm text-gray-300 font-medium">{new Date(tx.date).toLocaleDateString()}</td>
            <td className="py-4 px-6">
                <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${statusColors[tx.status?.toLowerCase() as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-400'}`}>
                    {statusLabels[tx.status?.toLowerCase()] || tx.status}
                </span>
            </td>
            <td className="py-4 px-6 text-sm font-bold text-white text-right">
                R$ {tx.amount.toFixed(2).replace('.', ',')}
            </td>
        </tr>
    );
};

const AdminFinance = () => {
    const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
    const [stats, setStats] = useState<any>({ overdue: 0, dueThisWeek: 0, mrr: 0 });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal Form State
    const [chargeUser, setChargeUser] = useState('');
    const [chargeAmount, setChargeAmount] = useState('');
    const [chargeDesc, setChargeDesc] = useState('');

    // Autocomplete State
    const [userSuggestions, setUserSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Plans State for Auto-fill
    const [availablePlans, setAvailablePlans] = useState<any[]>([]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (chargeUser.length > 1) {
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`/api/admin?search=${chargeUser}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUserSuggestions(data);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error('Error searching users:', error);
                }
            } else {
                setUserSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [chargeUser]);

    useEffect(() => {
        fetchData();
        fetchPlans(); // Fetch plans on mount
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/plans');
            if (res.ok) {
                const data = await res.json();
                setAvailablePlans(data);
            }
        } catch (error) {
            console.error('Error fetching plans for dropdown:', error);
        }
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [statsRes, txRes] = await Promise.all([
                fetch('/api/admin/payments/stats', { headers }),
                fetch('/api/admin/payments/transactions', { headers })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (txRes.ok) setTransactions(await txRes.json());

        } catch (error) {
            console.error('Failed to fetch finance data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCharge = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder API call
        console.log('Generating charge for:', chargeUser, chargeAmount);
        alert(`Cobrança enviada para ${chargeUser} com sucesso!`);
        setIsChargeModalOpen(false);
        setChargeUser('');
        setChargeAmount('');
        setChargeDesc('');
        // Refresh transactions if specific endpoint existed
    };

    return (
        <>
            <Helmet>
                <title>Gestão Financeira | Admin Master</title>
            </Helmet>

            <div className="flex flex-col gap-8 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Gestão Financeira</h2>
                        <p className="text-slate-300 mt-1">Visão geral de receitas e cobranças em tempo real.</p>
                    </div>
                    <button
                        onClick={() => setIsChargeModalOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105 flex items-center gap-2 border border-emerald-400/20"
                    >
                        <span className="material-symbols-outlined">add_card</span>
                        Gerar Nova Cobrança
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Faturamento Mensal (Est.)"
                        value={`R$ ${stats.mrr?.toFixed(2).replace('.', ',')}`}
                        icon="payments"
                        trend="Baseado em assinaturas ativas"
                        color="text-emerald-400"
                    />
                    <StatCard
                        title="Vencendo essa Semana"
                        value={`R$ ${(stats.dueThisWeek * 29.90).toFixed(2).replace('.', ',')}`} // Estimate
                        icon="pending_actions"
                        trend={`${stats.dueThisWeek} assinaturas`}
                        color="text-amber-400"
                    />
                    <StatCard
                        title="Inadimplência"
                        value={`${stats.overdue}`}
                        icon="event_busy"
                        trend="Contas com atraso"
                        color="text-red-400"
                    />
                </div>

                {/* Recent Transactions Table */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="text-lg font-bold text-white">Transações Recentes</h3>
                        <button className="text-sm text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider">Ver Todas</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black/20">
                                <tr>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Usuário</th>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Descrição</th>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Data</th>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-right text-xs font-bold text-slate-300 uppercase tracking-wider">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-400 animate-pulse">Carregando transações...</td></tr>
                                ) : transactions.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-400">Nenhuma transação registrada.</td></tr>
                                ) : (
                                    transactions.map(tx => (
                                        <TransactionRow key={tx.id} tx={tx} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CHARGE MODAL */}
            {isChargeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[#1e293b] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95">
                        {/* Decorative Gradient Top */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
                                        <span className="material-symbols-outlined">payments</span>
                                    </div>
                                    Gerar Cobrança
                                </h3>
                                <button
                                    onClick={() => setIsChargeModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleCreateCharge} className="flex flex-col gap-5">
                                <div className="relative">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Usuário / Email</label>
                                    <input
                                        type="text"
                                        required
                                        value={chargeUser}
                                        onChange={e => setChargeUser(e.target.value)}
                                        onFocus={() => chargeUser.length > 1 && setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="Busque por nome ou email..."
                                        autoComplete="off"
                                    />

                                    {showSuggestions && userSuggestions.length > 0 && (
                                        <div className="absolute top-[85px] left-0 w-full bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto custom-scrollbar ring-1 ring-white/10">
                                            {userSuggestions.map(user => (
                                                <div
                                                    key={user.id}
                                                    className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors flex items-center justify-between group"
                                                    onClick={() => {
                                                        setChargeUser(user.email);
                                                        setShowSuggestions(false);
                                                    }}
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{user.name}</p>
                                                        <p className="text-xs text-slate-400">{user.email}</p>
                                                    </div>
                                                    <span className="material-symbols-outlined text-slate-600 text-sm group-hover:text-emerald-500">add</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-[11px] text-slate-500 mt-1.5 ml-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">info</span>
                                        O usuário receberá um email com o link de pagamento.
                                    </p>
                                </div>

                                {/* Plan Selection Integration */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Preencher com Plano (Opcional)</label>
                                    <select
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!value) return;
                                            const [planId, type] = value.split('|');
                                            const plan = availablePlans.find(p => p.id === planId);

                                            if (plan) {
                                                if (type === 'MONTHLY') {
                                                    setChargeAmount(plan.priceMonthly.toString());
                                                    setChargeDesc(`Assinatura ${plan.name} - Mensal`);
                                                } else {
                                                    setChargeAmount(plan.priceAnnual.toString());
                                                    setChargeDesc(`Assinatura ${plan.name} - Anual`);
                                                }
                                            }
                                        }}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-300 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="" className="bg-[#1e293b] text-slate-300">Selecione para preencher...</option>
                                        {availablePlans.map(plan => (
                                            <React.Fragment key={plan.id}>
                                                <option value={`${plan.id}|MONTHLY`} className="bg-[#1e293b] text-white">
                                                    {plan.name} (Mensal) - R$ {parseFloat(plan.priceMonthly).toFixed(2).replace('.', ',')}
                                                </option>
                                                <option value={`${plan.id}|ANNUAL`} className="bg-[#1e293b] text-white">
                                                    {plan.name} (Anual) - R$ {parseFloat(plan.priceAnnual).toFixed(2).replace('.', ',')}
                                                </option>
                                            </React.Fragment>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Valor (R$)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R$</span>
                                            <input
                                                type="number"
                                                required
                                                step="0.01"
                                                value={chargeAmount}
                                                onChange={e => setChargeAmount(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                                                placeholder="0,00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Vencimento</label>
                                        <input
                                            type="date"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-emerald-500 outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Descrição</label>
                                    <input
                                        type="text"
                                        required
                                        value={chargeDesc}
                                        onChange={e => setChargeDesc(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="ex: Assinatura Anual"
                                    />
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsChargeModalOpen(false)}
                                        className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-bold transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 transition-all transform hover:scale-[1.02]"
                                    >
                                        Enviar Cobrança
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminFinance;
