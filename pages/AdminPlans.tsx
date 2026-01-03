import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../src/lib/supabase';
import { parseDatabaseArray } from '../src/utils/dbHelpers';

export default function AdminPlans() {
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);

    useEffect(() => {
        fetchPlans();
    }, []);



    const fetchPlans = async () => {
        try {
            const { data, error } = await supabase
                .from('Plan')
                .select('*')
                .order('priceMonthly', { ascending: true });

            if (error) throw error;
            if (data) setPlans(data);
        } catch (error) {
            console.error('Failed to fetch plans', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const features = (formData.get('features') as string).split('\n').filter(Boolean);

        const payload = {
            name: formData.get('name'),
            description: formData.get('description'),
            priceMonthly: parseFloat(formData.get('priceMonthly') as string),
            priceAnnual: parseFloat(formData.get('priceAnnual') as string),
            features: features, // Postgres Array (text[])
            recommended: formData.get('recommended') === 'on',
            active: true // Default active
        };

        try {
            const { error } = await supabase
                .from('Plan')
                .insert([payload]);

            if (error) throw error;

            alert('Plano criado com sucesso!');
            setIsCreateModalOpen(false);
            fetchPlans();
        } catch (error: any) {
            alert('Erro ao criar: ' + error.message);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) return;

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const features = (formData.get('features') as string).split('\n').filter(Boolean);

        const updates = {
            name: formData.get('name'),
            description: formData.get('description'),
            priceMonthly: parseFloat(formData.get('priceMonthly') as string),
            priceAnnual: parseFloat(formData.get('priceAnnual') as string),
            features: features,
            recommended: formData.get('recommended') === 'on',
            active: formData.get('active') === 'on'
        };

        try {
            const { error } = await supabase
                .from('Plan')
                .update(updates)
                .eq('id', selectedPlan.id);

            if (error) throw error;

            alert('Plano atualizado!');
            setIsEditModalOpen(false);
            fetchPlans();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza? Isso deletará o plano permanentemente.')) return;

        try {
            const { error } = await supabase
                .from('Plan')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchPlans();
        } catch (error: any) {
            alert(error.message);
        }
    };


    return (
        <div className="animate-fade-in space-y-8">
            <Helmet>
                <title>Planos e Valores | Admin Master</title>
            </Helmet>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Planos e Valores</h2>
                    <p className="text-slate-400 mt-1">Gerencie os preços e funcionalidades exibidos na Landing Page.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add_card</span>
                        Novo Plano
                    </button>
                </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-black/20 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="p-5">Nome</th>
                                <th className="p-5">Mensal</th>
                                <th className="p-5">Anual (Total)</th>
                                <th className="p-5">Destaque</th>
                                <th className="p-5">Features</th>
                                <th className="p-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-slate-500 animate-pulse">Carregando planos...</td></tr>
                            ) : plans.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-slate-500">Nenhum plano cadastrado.</td></tr>
                            ) : (
                                plans.map(plan => (
                                    <tr key={plan.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-5 font-bold text-white">{plan.name}</td>
                                        <td className="p-5 text-slate-300">R$ {parseFloat(plan.priceMonthly).toFixed(2).replace('.', ',')}</td>
                                        <td className="p-5 text-slate-300">R$ {parseFloat(plan.priceAnnual).toFixed(2).replace('.', ',')}</td>
                                        <td className="p-5">
                                            {plan.recommended ? (
                                                <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">Sim</span>
                                            ) : <span className="text-slate-600">-</span>}
                                        </td>
                                        <td className="p-5 text-slate-400 text-xs max-w-xs truncate">
                                            {parseDatabaseArray(plan.features).join(', ')}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setSelectedPlan(plan); setIsEditModalOpen(true); }} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors" title="Editar">
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(plan.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-300 hover:text-red-400 transition-colors" title="Deletar">
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

            {/* Create Modal */}
            {isCreateModalOpen && (
                <Modal title="Criar Novo Plano" onClose={() => setIsCreateModalOpen(false)}>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome do Plano</label>
                                <input name="name" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" placeholder="Ex: Premium" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrição Curta</label>
                                <input name="description" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" placeholder="Para quem busca..." />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Preço Mensal (R$)</label>
                                <input name="priceMonthly" type="number" step="0.01" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" placeholder="49.90" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Preço Anual Total (R$)</label>
                                <input name="priceAnnual" type="number" step="0.01" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" placeholder="478.80" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Funcionalidades (Uma por linha)</label>
                            <textarea name="features" required rows={5} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none" placeholder="Dashboard Geral&#10;Gestão Financeira&#10;..."></textarea>
                        </div>
                        <div className="flex items-center gap-3 px-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input name="recommended" type="checkbox" className="peer sr-only" />
                                <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 transition-colors"></div>
                                <span className="ml-3 text-white font-medium text-sm">Destacar este plano (Recomendado)</span>
                            </label>
                        </div>
                        <div className="pt-6 flex justify-end gap-3 border-t border-white/5 mt-2">
                            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium">Cancelar</button>
                            <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg">Criar Plano</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedPlan && (
                <Modal title="Editar Plano" onClose={() => setIsEditModalOpen(false)}>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome do Plano</label>
                                <input name="name" defaultValue={selectedPlan.name} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrição Curta</label>
                                <input name="description" defaultValue={selectedPlan.description} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Preço Mensal (R$)</label>
                                <input name="priceMonthly" type="number" step="0.01" defaultValue={selectedPlan.priceMonthly} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Preço Anual Total (R$)</label>
                                <input name="priceAnnual" type="number" step="0.01" defaultValue={selectedPlan.priceAnnual} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Funcionalidades (Uma por linha)</label>
                            <textarea name="features" defaultValue={parseDatabaseArray(selectedPlan.features).join('\n')} required rows={5} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none"></textarea>
                        </div>

                        <div className="flex flex-col gap-4 px-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input name="recommended" type="checkbox" defaultChecked={selectedPlan.recommended} className="peer sr-only" />
                                <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 transition-colors"></div>
                                <span className="ml-3 text-white font-medium text-sm">Destacar este plano</span>
                            </label>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input name="active" type="checkbox" defaultChecked={selectedPlan.active !== false} className="peer sr-only" />
                                <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 transition-colors"></div>
                                <span className="ml-3 text-white font-medium text-sm">Plano Ativo (Visível na Home)</span>
                            </label>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-white/5 mt-2">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium">Cancelar</button>
                            <button type="submit" className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg">Salvar Alterações</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050510]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-[#1a1b2e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500"></div>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </div>
    </div>
);
