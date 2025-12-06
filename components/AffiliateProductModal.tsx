import React, { useState, useEffect } from 'react';
import { AffiliateProduct } from '../types';

interface AffiliateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Omit<AffiliateProduct, 'id' | 'clicks' | 'conversions' | 'revenue' | 'createdAt'>) => void;
    initialData?: AffiliateProduct;
}

const AffiliateProductModal: React.FC<AffiliateProductModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        affiliateLink: '',
        commission: 0,
        price: 0,
        description: '',
        isFavorite: false,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                category: initialData.category,
                affiliateLink: initialData.affiliateLink,
                commission: initialData.commission,
                price: initialData.price,
                description: initialData.description || '',
                isFavorite: initialData.isFavorite,
            });
        } else {
            setFormData({
                name: '',
                category: '',
                affiliateLink: '',
                commission: 0,
                price: 0,
                description: '',
                isFavorite: false,
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {initialData ? 'Editar Produto Afiliado' : 'Novo Produto Afiliado'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Nome do Produto */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Nome do Produto *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50"
                            placeholder="Ex: Curso de Marketing Digital"
                        />
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Categoria *
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">Selecione uma categoria</option>
                            <option value="Cadeiras">Cadeiras</option>
                            <option value="Caixa de Som">Caixa de Som</option>
                            <option value="Celulares">Celulares</option>
                            <option value="Controles">Controles</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Headset">Headset</option>
                            <option value="Jogos">Jogos</option>
                            <option value="Kit mouse + Teclado">Kit mouse + Teclado</option>
                            <option value="Microfones">Microfones</option>
                            <option value="Mochilas">Mochilas</option>
                            <option value="Monitores">Monitores</option>
                            <option value="Mouse">Mouse</option>
                            <option value="Mousepad">Mousepad</option>
                            <option value="Notebook">Notebook</option>
                            <option value="Outros/Diversos">Outros/Diversos</option>
                            <option value="Setup Completo">Setup Completo</option>
                            <option value="Teclado">Teclado</option>
                        </select>
                    </div>

                    {/* Link de Afiliação */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Link de Afiliação *
                        </label>
                        <input
                            type="url"
                            required
                            value={formData.affiliateLink}
                            onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Comissão e Preço */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Comissão (%) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.commission}
                                onChange={(e) => setFormData({ ...formData, commission: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50"
                                placeholder="10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Preço (R$) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50"
                                placeholder="99.90"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Descrição
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50"
                            placeholder="Descrição do produto..."
                        />
                    </div>

                    {/* Favorito */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="favorite"
                            checked={formData.isFavorite}
                            onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="favorite" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Marcar como favorito
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg font-bold transition-colors"
                        >
                            {initialData ? 'Salvar Alterações' : 'Criar Produto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AffiliateProductModal;
