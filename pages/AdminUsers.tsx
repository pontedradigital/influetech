import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Admin Page Component
export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ overdue: 0, dueThisWeek: 0, mrr: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Filter
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/payments/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const payload = {
            email: formData.get('email'),
            name: formData.get('name'),
            plan: formData.get('plan'),
            planCycle: formData.get('planCycle'),
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao convidar');

            alert('Convite enviado com sucesso! O usuário receberá um e-mail para definir a senha.');
            setIsInviteModalOpen(false);
            fetchUsers();
            fetchStats();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const payload = {
            name: formData.get('name'),
            plan: formData.get('plan'),
            planCycle: formData.get('planCycle'),
            active: formData.get('active') === 'on' ? 1 : 0,
            paymentStatus: formData.get('paymentStatus')
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Erro ao atualizar');

            alert('Usuário atualizado!');
            setIsEditModalOpen(false);
            fetchUsers();
            fetchStats();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza? Isso deletará a conta e todos os dados.')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Erro ao deletar');
            fetchUsers();
            fetchStats();
        } catch (error: any) {
            alert(error.message);
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-purple-500/30">

            {/* Header / Nav similar to Landing Page */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <span className="material-symbols-outlined text-white text-sm">admin_panel_settings</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">Área Administrativa</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* 1. Payment Dashboard (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: MRR */}
                    <div className="relative group p-6 rounded-2xl bg-[#0f172a] border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-50"><span className="material-symbols-outlined text-4xl text-purple-500/20">payments</span></div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Faturamento Mensal (Est.)</p>
                        <h3 className="text-3xl font-black text-white">R$ {stats.mrr?.toFixed(2).replace('.', ',')}</h3>
                    </div>

                    {/* Card 2: Overdue */}
                    <div className="relative group p-6 rounded-2xl bg-[#0f172a] border border-white/10 overflow-hidden hover:border-red-500/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-50"><span className="material-symbols-outlined text-4xl text-red-500/20">warning</span></div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Pagamentos Atrasados</p>
                        <h3 className="text-3xl font-black text-red-400">{stats.overdue}</h3>
                    </div>

                    {/* Card 3: Due This Week */}
                    <div className="relative group p-6 rounded-2xl bg-[#0f172a] border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-50"><span className="material-symbols-outlined text-4xl text-cyan-500/20">calendar_clock</span></div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Vencendo essa Semana</p>
                        <h3 className="text-3xl font-black text-cyan-400">{stats.dueThisWeek}</h3>
                    </div>
                </div>

                {/* 2. Actions & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                        <input
                            type="text"
                            placeholder="Buscar usuário por nome ou email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-10 pr-4 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Convidar Usuário
                    </button>
                </div>

                {/* 3. Users Table list */}
                <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-medium">Usuário</th>
                                    <th className="p-4 font-medium">Plano / Ciclo</th>
                                    <th className="p-4 font-medium">Status Pagto</th>
                                    <th className="p-4 font-medium">Vencimento</th>
                                    <th className="p-4 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Carregando usuários...</td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum usuário encontrado.</td></tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative ${user.active ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-red-900/20 text-red-500'}`}>
                                                        {user.name?.charAt(0)}
                                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0f172a] ${user.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{user.name}</div>
                                                        <div className="text-slate-500 text-xs">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className={`font-bold ${user.plan === 'CREATOR_PLUS' ? 'text-purple-400' : 'text-slate-300'}`}>
                                                        {user.plan === 'CREATOR_PLUS' ? 'Creator+' : 'Start'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 lowercase">{user.planCycle}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge status={user.paymentStatus} />
                                            </td>
                                            <td className="p-4 text-slate-400">
                                                {user.nextPaymentDate ? new Date(user.nextPaymentDate).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Editar">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Deletar">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
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
            </main>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <Modal title="Convidar Novo Usuário" onClose={() => setIsInviteModalOpen(false)}>
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome Completo</label>
                            <input name="name" required className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" placeholder="Ex: Maria Silva" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">E-mail</label>
                            <input name="email" type="email" required className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" placeholder="maria@exemplo.com" />
                            <p className="text-xs text-slate-500 mt-1">O link para definir senha será enviado para este e-mail.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Plano</label>
                                <select name="plan" className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none">
                                    <option value="START">Start</option>
                                    <option value="CREATOR_PLUS">Creator+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ciclo</label>
                                <select name="planCycle" className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none">
                                    <option value="MONTHLY">Mensal</option>
                                    <option value="ANNUAL">Anual</option>
                                    <option value="LIFETIME">Vitalício (Gratuito)</option>
                                    <option value="FREE">Gratuito (Teste)</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsInviteModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-lg shadow-purple-500/20">Enviar Convite</button>
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
                            <input name="name" defaultValue={selectedUser.name} className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Plano</label>
                                <select name="plan" defaultValue={selectedUser.plan} className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none">
                                    <option value="START">Start</option>
                                    <option value="CREATOR_PLUS">Creator+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ciclo</label>
                                <select name="planCycle" defaultValue={selectedUser.planCycle} className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none">
                                    <option value="MONTHLY">Mensal</option>
                                    <option value="ANNUAL">Anual</option>
                                    <option value="LIFETIME">Vitalício</option>
                                    <option value="FREE">Gratuito</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status Pagamento</label>
                                <select name="paymentStatus" defaultValue={selectedUser.paymentStatus} className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none">
                                    <option value="ACTIVE">Em dia</option>
                                    <option value="OVERDUE">Atrasado</option>
                                    <option value="CANCELLED">Cancelado</option>
                                    <option value="FREE">Isento</option>
                                </select>
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input name="active" type="checkbox" defaultChecked={!!selectedUser.active} className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-neutral-800" />
                                    <span className="text-white font-medium">Conta Ativa</span>
                                </label>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/20">Salvar Alterações</button>
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
        case 'ACTIVE': color = 'bg-green-500/10 text-green-400 border border-green-500/20'; label = 'Em dia'; break;
        case 'OVERDUE': color = 'bg-red-500/10 text-red-400 border border-red-500/20'; label = 'Atrasado'; break;
        case 'FREE': color = 'bg-blue-500/10 text-blue-400 border border-blue-500/20'; label = 'Isento'; break;
        case 'CANCELLED': color = 'bg-gray-800 text-gray-500'; label = 'Cancelado'; break;
    }

    return <span className={`px-2 py-1 rounded-md text-xs font-bold ${color}`}>{label}</span>;
}

const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
                <h3 className="text-xl font-bold text-white font-display">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);
