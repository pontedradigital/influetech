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

import { supabase } from '../src/lib/supabase';

const AdminFinance = () => {
    const [stats, setStats] = useState<any>({ overdue: 0, dueThisWeek: 0, mrr: 0 });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Users to simulate "Transactions" (Active Subscriptions)
            // Now we read directly from User table as requested
            const { data: users, error } = await supabase
                .from('User')
                .select('id, name, plan, planCycle, paymentStatus, createdAt, nextPaymentDate')
                .order('createdAt', { ascending: false })
                .limit(50);

            if (users) {
                const formattedTxs = users.map(user => {
                    // Determine amount based on plan
                    let amount = 0;
                    if (user.plan === 'CREATOR_PLUS') amount = user.planCycle === 'MONTHLY' ? 99.90 : 83.25;
                    else if (user.plan === 'START') amount = user.planCycle === 'MONTHLY' ? 49.90 : 41.58;

                    // If lifetime or free, amount is 0 (or one-time for lifetime, but let's keep it simple as MRR view)
                    if (user.planCycle === 'LIFETIME' || user.planCycle === 'FREE' || user.plan === 'FREE') amount = 0;

                    return {
                        id: user.id,
                        user: user.name || 'Usuário',
                        description: `Assinatura ${user.plan} (${user.planCycle == 'MONTHLY' ? 'Mensal' : user.planCycle == 'ANNUAL' ? 'Anual' : 'Vitalício'})`, // Friendly cycle name
                        date: user.createdAt, // Showing when they joined/started
                        status: user.paymentStatus || 'PENDING',
                        amount: amount
                    };
                });
                // Filter out non-paying if desired, but user wants "manage finance", so seeing Free users might be relevant? 
                // The prompt implies "sum values... as they are registered". showing 0 values is fine for clarity.
                // Let's filter out completely invalid ones if needed, but showing all recent signups is good for "New Sale" visibility.
                setTransactions(formattedTxs);


                // Stats Logic
                const now = new Date();
                const oneWeekFromNow = new Date();
                oneWeekFromNow.setDate(now.getDate() + 7);

                const mrr = users.reduce((acc, user) => {
                    // Same MRR logic as before, but iterating over the fetched list (or we could fetch all if pagination becomes an issue)
                    // NOTE: The previous query fetched ALL users for stats. The limit(50) above might break MRR if we only use those 50.
                    // We should do a separate fetch for stats if we want total accuracy, or remove limit if user base is small.
                    // IMPORTANT: To keep it consistent with previous logic, I'll do a separate light fetch for stats or just standard fetch.
                    return acc; // We'll recalculate MRR properly below
                }, 0);
            }

            // Separate Fetch for Full Stats (to account for all users, not just last 50)
            const { data: allUsers } = await supabase
                .from('User')
                .select('paymentStatus, nextPaymentDate, plan, planCycle');

            if (allUsers) {
                const now = new Date();
                const oneWeekFromNow = new Date();
                oneWeekFromNow.setDate(now.getDate() + 7);

                const mrr = allUsers.reduce((acc, user) => {
                    if (user.paymentStatus === 'FREE' || user.paymentStatus === 'CANCELLED' || user.paymentStatus === 'OVERDUE') return acc;
                    if (user.planCycle === 'LIFETIME' || user.planCycle === 'FREE') return acc;
                    if (user.plan === 'FREE') return acc;
                    if (user.paymentStatus === 'ACTIVE') {
                        if (user.plan === 'CREATOR_PLUS') return acc + (user.planCycle === 'MONTHLY' ? 99.90 : 83.25);
                        if (user.plan === 'START') return acc + (user.planCycle === 'MONTHLY' ? 49.90 : 41.58);
                    }
                    return acc;
                }, 0);

                const overdue = allUsers.filter(u => u.paymentStatus === 'OVERDUE').length;
                const dueThisWeek = allUsers.filter(u => {
                    if (!u.nextPaymentDate) return false;
                    const date = new Date(u.nextPaymentDate);
                    return date >= now && date <= oneWeekFromNow;
                }).length;

                setStats({ mrr, overdue, dueThisWeek });
            }

        } catch (error) {
            console.error('Failed to fetch finance data', error);
        } finally {
            setIsLoading(false);
        }
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
                        <p className="text-slate-300 mt-1">Visão geral automática baseada em assinaturas ativas.</p>
                    </div>
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

                {/* Recent 'Transactions' (Users) Table */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="text-lg font-bold text-white">Últimas Assinaturas / Renovações</h3>
                        <button className="text-sm text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider">Ver Todas</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black/20">
                                <tr>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Usuário</th>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Plano</th>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Início</th>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-right text-xs font-bold text-slate-300 uppercase tracking-wider">Valor Mensal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-400 animate-pulse">Carregando dados...</td></tr>
                                ) : transactions.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-400">Nenhum usuário pagante encontrado.</td></tr>
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
        </>
    );
};

export default AdminFinance;
