import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// Admin Page Component
import { supabase } from '../src/lib/supabase';

// Admin Page Component
export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ overdue: 0, dueThisWeek: 0, mrr: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [inviteLink, setInviteLink] = useState('');

    // Filter
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const calculateStats = (userData: any[]) => {
        const now = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(now.getDate() + 7);

        const mrr = userData.reduce((acc, user) => {
            if (user.paymentStatus !== 'ACTIVE' && user.paymentStatus !== 'FREE') return acc;
            if (user.plan === 'CREATOR_PLUS') return acc + (user.planCycle === 'MONTHLY' ? 99.90 : 83.25); // Estimativa
            if (user.plan === 'START') return acc + (user.planCycle === 'MONTHLY' ? 49.90 : 41.58);
            return acc;
        }, 0);

        const overdue = userData.filter(u => u.paymentStatus === 'OVERDUE').length;

        const dueThisWeek = userData.filter(u => {
            if (!u.nextPaymentDate) return false;
            const date = new Date(u.nextPaymentDate);
            return date >= now && date <= oneWeekFromNow;
        }).length;

        setStats({ mrr, overdue, dueThisWeek });
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('User')
                .select('*')
                .order('createdAt', { ascending: false });

            if (error) throw error;

            if (data) {
                setUsers(data);
                calculateStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
            // Fallback for demo if table doesn't exist or is empty
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Note: fetchStats is now internal to fetchUsers via calculateStats

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Reuse main loading or local loading state? Let's use local if poss but main is fine for blocking

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const email = formData.get('email') as string;
        const name = formData.get('name') as string;
        const plan = formData.get('plan') as string;
        const planCycle = formData.get('planCycle') as string;
        const nextPaymentDate = formData.get('nextPaymentDate') as string;
        const role = formData.get('role') as string || 'USER';

        try {
            const res = await fetch('/api/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, role, plan, planCycle, nextPaymentDate })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Falha ao enviar convite');

            alert('Convite enviado com sucesso para ' + email);
            setIsInviteModalOpen(false);
            fetchUsers(); // Refresh list
        } catch (error: any) {
            alert('Erro: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSync = async () => {
        const confirmSync = confirm('Isso irá buscar todos os usuários do sistema de login e criar perfis para eles se estiverem faltando. Continuar?');
        if (!confirmSync) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/sync-users', { method: 'POST' }); // or GET
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            alert(`Sincronização concluída! ${data.newlySynced} novos usuários adicionados.`);
            fetchUsers();
        } catch (error: any) {
            console.error(error);
            alert('Erro na sincronização: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const updates = {
            name: formData.get('name'),
            plan: formData.get('plan'),
            planCycle: formData.get('planCycle'),
            active: formData.get('active') === 'on' ? 1 : 0,
            paymentStatus: formData.get('paymentStatus')
        };

        try {
            const { error } = await supabase
                .from('User')
                .update(updates)
                .eq('id', selectedUser.id);

            if (error) throw error;

            alert('Usuário atualizado!');
            setIsEditModalOpen(false);
            fetchUsers();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza? Isso deletará a conta DE LOGIN e todos os dados permanentemente.')) return;

        try {
            // Use serverless function to delete from Auth + DB
            const res = await fetch('/api/delete-user', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Erro ao deletar usuário');

            alert('Usuário deletado com sucesso!');
            fetchUsers();
        } catch (error: any) {
            alert('Erro: ' + error.message);
        }
    };

    const handleToggleStatus = async (user: any) => {
        const newStatus = user.active ? 0 : 1;
        const actionName = user.active ? 'desativar' : 'reativar';

        if (!confirm(`Tem certeza que deseja ${actionName} o acesso deste usuário?`)) return;

        try {
            const { error } = await supabase
                .from('User')
                .update({ active: newStatus })
                .eq('id', user.id);

            if (error) throw error;

            // Optional: Also update 'active' in React state immediately for better UX
            setUsers(users.map(u => u.id === user.id ? { ...u, active: newStatus } : u));

            alert(`Usuário ${newStatus ? 'reativado' : 'desativado'} com sucesso!`);
        } catch (error: any) {
            alert('Erro ao atualizar status: ' + error.message);
            console.error(error);
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in space-y-8">
            <Helmet>
                <title>Gestão de Usuários | Admin Master</title>
            </Helmet>

            {/* Header Section with Glass Effect */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Gestão de Usuários</h2>
                    <p className="text-slate-400 mt-1">Administre acessos e assinaturas da plataforma.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSync}
                        disabled={isLoading}
                        className="px-6 py-3 bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900 hover:text-white rounded-xl font-medium transition-all flex items-center gap-2 border border-indigo-500/20"
                        title="Sincronizar usuários do Auth com o Banco de Dados"
                    >
                        <span className="material-symbols-outlined">sync</span>
                        <span className="hidden sm:inline">Sincronizar Banco</span>
                    </button>
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        Gerar Novo Usuário
                    </button>
                </div>
            </div>

            {/* Stats Cards (Glossy) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: MRR */}
                <div className="relative group p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden hover:bg-white/20 transition-all duration-300 shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-6xl">payments</span></div>
                    <div className="relative z-10">
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">Faturamento Mensal (Est.)</p>
                        <h3 className="text-3xl font-bold text-white tracking-tight">R$ {stats.mrr?.toFixed(2).replace('.', ',')}</h3>
                        <div className="h-1 w-12 bg-emerald-500 rounded-full mt-4 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                </div>

                {/* Card 2: Overdue */}
                <div className="relative group p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden hover:bg-white/20 transition-all duration-300 shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-6xl">warning</span></div>
                    <div className="relative z-10">
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">Pagamentos Atrasados</p>
                        <h3 className="text-3xl font-bold text-red-400 tracking-tight">{stats.overdue}</h3>
                        <div className="h-1 w-12 bg-red-500 rounded-full mt-4 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    </div>
                </div>

                {/* Card 3: Due This Week */}
                <div className="relative group p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden hover:bg-white/20 transition-all duration-300 shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-6xl">calendar_month</span></div>
                    <div className="relative z-10">
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">Vencendo essa Semana</p>
                        <h3 className="text-3xl font-bold text-cyan-400 tracking-tight">{stats.dueThisWeek}</h3>
                        <div className="h-1 w-12 bg-cyan-500 rounded-full mt-4 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                    type="text"
                    placeholder="Buscar usuário por nome, email ou plano..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all backdrop-blur-md shadow-lg"
                />
            </div>

            {/* Users Table (Glass Container) */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-black/20 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="p-5">Usuário</th>
                                <th className="p-5">Plano / Ciclo</th>
                                <th className="p-5">Status Pagto</th>
                                <th className="p-5">Criado em</th>
                                <th className="p-5">Vencimento</th>
                                <th className="p-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-12 text-center text-slate-500 animate-pulse">Carregando dados...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-slate-500">Nenhum usuário encontrado.</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg relative ${user.active ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                                                    {user.name?.charAt(0)}
                                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1e1e2e] ${user.active ? 'bg-emerald-500' : 'bg-red-500'} shadow`}></div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-base">{user.name}</div>
                                                    <div className="text-slate-400 text-xs">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${user.plan === 'CREATOR_PLUS' ? 'text-purple-300' : 'text-slate-300'}`}>
                                                    {user.plan === 'CREATOR_PLUS' ? 'Creator+' : 'Start'}
                                                </span>
                                                <span className="text-xs text-slate-500 lowercase bg-white/5 px-2 py-0.5 rounded-full w-fit mt-1 border border-white/5">{user.planCycle}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <Badge status={user.paymentStatus} />
                                        </td>
                                        <td className="p-5 text-slate-400 font-medium text-xs">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 text-slate-400 font-medium">
                                            {user.nextPaymentDate ? new Date(user.nextPaymentDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors border border-transparent hover:border-white/10" title="Editar">
                                                    <span className="material-symbols-outlined text-xl">edit_note</span>
                                                </button>
                                                <button onClick={() => handleToggleStatus(user)} className={`p-2 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10 ${user.active ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'}`} title={user.active ? "Desativar Acesso" : "Reativar Acesso"}>
                                                    <span className="material-symbols-outlined text-xl">{user.active ? 'block' : 'check_circle'}</span>
                                                </button>
                                                <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-300 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20" title="Deletar">
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal (New User) */}
            {isInviteModalOpen && (
                <Modal title="Criar Novo Usuário" onClose={() => setIsInviteModalOpen(false)}>
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome Completo</label>
                            <input name="name" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors" placeholder="Ex: Maria Silva" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">E-mail</label>
                            <input name="email" type="email" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors" placeholder="maria@exemplo.com" />
                            <p className="text-[10px] text-slate-500 mt-1 ml-1">Um e-mail de boas-vindas será enviado com instruções.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Plano</label>
                                <select name="plan" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none cursor-pointer">
                                    <option value="START" className="bg-neutral-900">Start</option>
                                    <option value="CREATOR_PLUS" className="bg-neutral-900">Creator+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ciclo</label>
                                <select name="planCycle" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none cursor-pointer">
                                    <option value="MONTHLY" className="bg-neutral-900">Mensal</option>
                                    <option value="ANNUAL" className="bg-neutral-900">Anual</option>
                                    <option value="LIFETIME" className="bg-neutral-900">Vitalício (Gratuito)</option>
                                    <option value="FREE" className="bg-neutral-900">Gratuito (Teste)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data de Cobrança (Opcional)</label>
                            <input name="nextPaymentDate" type="date" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors [color-scheme:dark]" />
                            <p className="text-[10px] text-slate-500 mt-1 ml-1">Se definido, será a próxima data de vencimento.</p>
                        </div>
                        <div className="pt-6 flex justify-end gap-3 border-t border-white/5 mt-2">
                            <button type="button" onClick={() => setIsInviteModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium transition-colors">Cancelar</button>
                            <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/20 disabled:opacity-50 flex items-center gap-2">
                                {isLoading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : null}
                                Enviar Convite por E-mail
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedUser && (
                <Modal title="Editar Usuário" onClose={() => setIsEditModalOpen(false)}>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome</label>
                            <input name="name" defaultValue={selectedUser.name} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Plano</label>
                                <select name="plan" defaultValue={selectedUser.plan} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none cursor-pointer">
                                    <option value="START" className="bg-neutral-900">Start</option>
                                    <option value="CREATOR_PLUS" className="bg-neutral-900">Creator+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ciclo</label>
                                <select name="planCycle" defaultValue={selectedUser.planCycle} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none cursor-pointer">
                                    <option value="MONTHLY" className="bg-neutral-900">Mensal</option>
                                    <option value="ANNUAL" className="bg-neutral-900">Anual</option>
                                    <option value="LIFETIME" className="bg-neutral-900">Vitalício</option>
                                    <option value="FREE" className="bg-neutral-900">Gratuito</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status Pagamento</label>
                                <select name="paymentStatus" defaultValue={selectedUser.paymentStatus} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none cursor-pointer">
                                    <option value="ACTIVE" className="bg-neutral-900">Em dia</option>
                                    <option value="OVERDUE" className="bg-neutral-900">Atrasado</option>
                                    <option value="CANCELLED" className="bg-neutral-900">Cancelado</option>
                                    <option value="FREE" className="bg-neutral-900">Isento</option>
                                </select>
                            </div>
                            <div className="flex items-center pt-6 px-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input name="active" type="checkbox" defaultChecked={!!selectedUser.active} className="peer sr-only" />
                                        <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </div>
                                    <span className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors">Conta Ativa</span>
                                </label>
                            </div>
                        </div>
                        <div className="pt-6 flex justify-end gap-3 border-t border-white/5 mt-2">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium transition-colors">Cancelar</button>
                            <button type="submit" className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20">Salvar Alterações</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

// Helpers
const Badge = ({ status }: { status: string }) => {
    let color = 'bg-slate-800 text-slate-400';
    let label = status;

    switch (status) {
        case 'ACTIVE': color = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'; label = 'Em dia'; break;
        case 'OVERDUE': color = 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'; label = 'Atrasado'; break;
        case 'FREE': color = 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'; label = 'Isento'; break;
        case 'CANCELLED': color = 'bg-gray-800/50 text-gray-500 border border-gray-700/50'; label = 'Cancelado'; break;
    }

    return <span className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase ${color}`}>{label}</span>;
}

const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050510]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-[#1a1b2e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Gradient Top */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500"></div>

            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);
