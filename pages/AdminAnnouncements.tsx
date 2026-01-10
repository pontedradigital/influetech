import React, { useState, useEffect } from 'react';
import { SystemAnnouncement, SystemAnnouncementService } from '../services/SystemAnnouncementService';

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<SystemAnnouncement> | null>(null);

    // Form States
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('INFO');
    const [active, setActive] = useState(true);
    const [expiresAt, setExpiresAt] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await SystemAnnouncementService.getAll();
            setAnnouncements(data);
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar avisos');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: SystemAnnouncement) => {
        if (item) {
            setEditingItem(item);
            setTitle(item.title);
            setMessage(item.message);
            setType(item.type);
            setActive(item.active);
            setExpiresAt(item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : '');
        } else {
            setEditingItem(null);
            setTitle('');
            setMessage('');
            setType('INFO');
            setActive(true);
            setExpiresAt('');
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                title,
                message,
                type,
                active,
                expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
            };

            if (editingItem?.id) {
                await SystemAnnouncementService.update(editingItem.id, payload);
            } else {
                await SystemAnnouncementService.create(payload);
            }

            setIsModalOpen(false);
            loadData();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar aviso');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este aviso?')) return;
        try {
            await SystemAnnouncementService.delete(id);
            loadData();
        } catch (error) {
            console.error(error);
            alert('Erro ao excluir');
        }
    };

    const getTypeColor = (t: string) => {
        switch (t) {
            case 'WARNING': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'UPDATE': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
            case 'NEWS': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Avisos do Dashboard</h1>
                    <p className="text-slate-400 text-sm">Gerencie as novidades e alertas exibidos para todos os usuários.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold text-white hover:shadow-lg transition-all hover:scale-105"
                >
                    <span className="material-symbols-outlined">add</span>
                    Novo Aviso
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {announcements.map(item => (
                        <div key={item.id} className={`bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-4 ${!item.active ? 'opacity-50' : ''}`}>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getTypeColor(item.type)}`}>
                                        {item.type}
                                    </span>
                                    {item.expiresAt && new Date(item.expiresAt) < new Date() && (
                                        <span className="text-xs text-red-400 font-bold border border-red-400/20 bg-red-400/10 px-2 rounded">EXPIRADO</span>
                                    )}
                                    {!item.active && <span className="text-xs text-slate-500 uppercase font-bold">Inativo</span>}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-slate-300 text-sm whitespace-pre-wrap">{item.message}</p>
                                <div className="mt-4 flex gap-4 text-xs text-slate-500">
                                    <span>Criado em: {new Date(item.createdAt).toLocaleDateString()}</span>
                                    {item.expiresAt && <span>Expira em: {new Date(item.expiresAt).toLocaleDateString()}</span>}
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <button
                                    onClick={() => handleOpenModal(item)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                    title="Editar"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                    title="Excluir"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            <p className="text-slate-500">Nenhum aviso cadastrado.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1e1e2e] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-lg font-bold text-white">{editingItem ? 'Editar Aviso' : 'Novo Aviso'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
                                    placeholder="Ex: Manutenção Programada"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Tipo</label>
                                    <select
                                        value={type}
                                        onChange={e => setType(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
                                    >
                                        <option value="INFO">Informação</option>
                                        <option value="WARNING">Atenção</option>
                                        <option value="UPDATE">Atualização</option>
                                        <option value="NEWS">Novidade</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Validade (Opcional)</label>
                                    <input
                                        type="datetime-local"
                                        value={expiresAt}
                                        onChange={e => setExpiresAt(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Mensagem</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    rows={4}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none resize-none"
                                    placeholder="Digite a mensagem que aparecerá no dashboard..."
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={active}
                                    onChange={e => setActive(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-700"
                                />
                                <label htmlFor="active" className="text-sm font-medium text-white cursor-pointer select-none">
                                    Ativo (Visível no Dashboard)
                                </label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncements;
