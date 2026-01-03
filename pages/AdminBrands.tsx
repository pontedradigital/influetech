
import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';

const AdminBrands: React.FC = () => {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<any | null>(null);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        tier: 'Tier C',
        categories: '',
        contactMethod: 'Email',
        difficulty: 'Médio',
        salesChannels: '',
        description: '',
        instagram: '',
        youtube: '',
        budget: 50,
        affinity: 50,
        matchScore: 70
    });

    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        fetchBrands();
    }, []);



    const fetchBrands = async () => {
        try {
            const { data, error } = await supabase
                .from('RadarBrand')
                .select('*')
                .order('name', { ascending: true });

            if (data) setBrands(data);
            if (error) console.error(error);
        } catch (error) {
            console.error('Error fetching brands', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        alert('Funcionalidade de Análise IA indisponível na versão atual. Por favor, preencha manualmente.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                categories: formData.categories.split(',').map(s => s.trim()).filter(Boolean),
                salesChannels: formData.salesChannels.split(',').map(s => s.trim()).filter(Boolean)
            };

            if (editingBrand) {
                // Update
                const { error } = await supabase
                    .from('RadarBrand')
                    .update(payload)
                    .eq('id', editingBrand.id);

                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('RadarBrand')
                    .insert([payload]);

                if (error) throw error;
            }

            setIsModalOpen(false);
            setEditingBrand(null);
            fetchBrands();
            resetForm();

        } catch (error) {
            console.error(error);
            alert('Erro ao salvar marca');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza?')) return;
        try {
            const { error } = await supabase
                .from('RadarBrand')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchBrands();
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            website: '',
            tier: 'Tier C',
            categories: '',
            contactMethod: 'Email',
            difficulty: 'Médio',
            salesChannels: '',
            description: '',
            instagram: '',
            youtube: '',
            budget: 50,
            affinity: 50,
            matchScore: 70
        });
    };

    const openEdit = (brand: any) => {
        setEditingBrand(brand);
        setFormData({
            name: brand.name,
            website: brand.website || '',
            tier: brand.tier,
            categories: Array.isArray(brand.categories) ? brand.categories.join(', ') : brand.categories || '',
            contactMethod: brand.contactMethod || 'Email',
            difficulty: brand.difficulty || 'Médio',
            salesChannels: Array.isArray(brand.salesChannels) ? brand.salesChannels.join(', ') : brand.salesChannels || '',
            description: brand.description || '',
            instagram: brand.instagram || '',
            youtube: brand.youtube || '',
            budget: brand.budget || 50,
            affinity: brand.affinity || 50,
            matchScore: brand.matchScore || 70
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Radar de Marcas
                    </h2>
                    <p className="text-slate-400 text-sm">Gerencie as marcas disponíveis no radar.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setEditingBrand(null); setIsModalOpen(true); }}
                    className="px-4 py-2 bg-gradient-to-r from-neon-green/80 to-emerald-500/80 text-white font-bold rounded-lg shadow-lg hover:shadow-neon-green/20 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Adicionar Marca
                </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-black/20 text-xs uppercase font-bold text-slate-400 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4">Marca</th>
                            <th className="px-6 py-4">Tier</th>
                            <th className="px-6 py-4">Categorias</th>
                            <th className="px-6 py-4">Links</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="p-6 text-center">Carregando...</td></tr>
                        ) : brands.length === 0 ? (
                            <tr><td colSpan={5} className="p-6 text-center text-slate-500">Nenhuma marca cadastrada.</td></tr>
                        ) : (
                            brands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{brand.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${brand.tier === 'Tier S' ? 'bg-purple-500/20 text-purple-300' :
                                            brand.tier === 'Tier A' ? 'bg-cyan-500/20 text-cyan-300' :
                                                brand.tier === 'Tier B' ? 'bg-green-500/20 text-green-300' :
                                                    'bg-slate-500/20 text-slate-300'
                                            }`}>
                                            {brand.tier}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {Array.isArray(brand.categories) ? brand.categories.slice(0, 3).join(', ') : brand.categories}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {brand.instagram && <span className="material-symbols-outlined text-pink-400 text-xs">photo_camera</span>}
                                            {brand.youtube && <span className="material-symbols-outlined text-red-500 text-xs">play_circle</span>}
                                            {brand.website && <span className="material-symbols-outlined text-blue-400 text-xs">public</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => openEdit(brand)} className="text-cyan-400 hover:text-cyan-300 mr-3">EDITAR</button>
                                        <button onClick={() => handleDelete(brand.id)} className="text-red-400 hover:text-red-300">EXCLUIR</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1e1e2e] w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-xl font-bold text-white">
                                {editingBrand ? 'Editar Marca' : 'Nova Marca'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="brandForm" onSubmit={handleSubmit} className="space-y-4">

                                {/* AI Tool Section */}
                                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 mb-6">
                                    <label className="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">
                                        <span className="material-symbols-outlined align-bottom text-sm mr-1">auto_awesome</span>
                                        Analista de IA
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Cole o site da marca (ex: razer.com) para preenchimento automático"
                                            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                            value={formData.website}
                                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAnalyze}
                                            disabled={analyzing}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 disabled:opacity-50 transition-all"
                                        >
                                            {analyzing ? (
                                                <span className="animate-spin material-symbols-outlined text-sm">refresh</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-sm">search_check</span>
                                            )}
                                            {analyzing ? 'Analisando...' : 'Analisar'}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2">
                                        O sistema irá buscar o logo, bio, redes sociais e sugerir um Tier automaticamente.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Nome da Marca</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Tier (Classificação)</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.tier}
                                            onChange={e => setFormData({ ...formData, tier: e.target.value })}
                                        >
                                            <option value="Tier S">Tier S (Gigante)</option>
                                            <option value="Tier A">Tier A (Premium)</option>
                                            <option value="Tier B">Tier B (Consolidada)</option>
                                            <option value="Tier C">Tier C (Nicho/Emergente)</option>
                                            <option value="Tier D">Tier D (Entrada)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Categorias (separadas por vírgula)</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                                        placeholder="Ex: Periféricos, Áudio, Setup"
                                        value={formData.categories}
                                        onChange={e => setFormData({ ...formData, categories: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Orçamento (0-100)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.budget}
                                            onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Afinidade (0-100)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.affinity}
                                            onChange={e => setFormData({ ...formData, affinity: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Match Score</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.matchScore}
                                            onChange={e => setFormData({ ...formData, matchScore: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Instagram (@usuario)</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.instagram}
                                            onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">YouTube (Canal)</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.youtube}
                                            onChange={e => setFormData({ ...formData, youtube: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Descrição</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                            </form>
                        </div>

                        <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="brandForm"
                                className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/20"
                            >
                                Salvar Marca
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBrands;
