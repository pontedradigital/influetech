import React, { useState, useEffect } from 'react';
import { AffiliateProduct } from '../types';
import { AffiliateService } from '../services/AffiliateService';
import AffiliateProductModal from '../components/AffiliateProductModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const Affiliates: React.FC = () => {
    const [products, setProducts] = useState<AffiliateProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<AffiliateProduct[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<AffiliateProduct | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [analytics, setAnalytics] = useState({
        totalProducts: 0,
        totalClicks: 0,
        totalConversions: 0,
        totalRevenue: 0,
        conversionRate: 0,
        topPerformers: [] as AffiliateProduct[],
    });

    // Commission calculator state
    const [calcSales, setCalcSales] = useState(1);
    const [calcPrice, setCalcPrice] = useState(0);
    const [calcCommission, setCalcCommission] = useState(0);

    useEffect(() => {
        loadProducts();
        loadAnalytics();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, categoryFilter, showFavoritesOnly]);

    const loadProducts = async () => {
        const data = await AffiliateService.list();
        setProducts(data);
    };

    const loadAnalytics = async () => {
        const data = await AffiliateService.getAnalytics();
        setAnalytics(data);
    };

    const filterProducts = () => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        if (showFavoritesOnly) {
            filtered = filtered.filter(p => p.isFavorite);
        }

        setFilteredProducts(filtered);
    };

    const handleSaveProduct = async (productData: Omit<AffiliateProduct, 'id' | 'clicks' | 'conversions' | 'revenue' | 'createdAt'>) => {
        if (selectedProduct) {
            await AffiliateService.update(selectedProduct.id, productData);
        } else {
            await AffiliateService.create(productData);
        }
        await loadProducts();
        await loadAnalytics();
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = async () => {
        if (selectedProduct) {
            await AffiliateService.delete(selectedProduct.id);
            await loadProducts();
            await loadAnalytics();
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
        }
    };

    const handleToggleFavorite = async (product: AffiliateProduct) => {
        await AffiliateService.toggleFavorite(product.id);
        await loadProducts();
    };

    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link);
        alert('Link copiado para a área de transferência!');
    };

    const handleGenerateShortLink = async (product: AffiliateProduct) => {
        const shortLink = AffiliateService.generateShortLink(product.id, product.name);
        await AffiliateService.update(product.id, { shortLink });
        await loadProducts();
        handleCopyLink(shortLink);
    };

    const handleExportCSV = async () => {
        const csv = await AffiliateService.exportToCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `afiliados_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const categories = Array.from(new Set(products.map(p => p.category)));

    const calculatedEarnings = calcSales * calcPrice * (calcCommission / 100);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Afiliações de Produtos</h1>
                    <p className="text-gray-500 mt-1">Gerencie seus produtos afiliados e acompanhe o desempenho</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">download</span>
                        Exportar
                    </button>
                    <button
                        onClick={() => {
                            setSelectedProduct(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Novo Produto
                    </button>
                </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">inventory_2</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total de Produtos</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalProducts}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">touch_app</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total de Cliques</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalClicks}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400">shopping_cart</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Conversões</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalConversions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">payments</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Receita Total</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analytics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Commission Calculator */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-6 rounded-xl border border-primary/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">calculate</span>
                    Calculadora de Comissões
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Vendas</label>
                        <input
                            type="number"
                            min="1"
                            value={calcSales}
                            onChange={(e) => setCalcSales(parseInt(e.target.value) || 1)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Preço (R$)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={calcPrice}
                            onChange={(e) => setCalcPrice(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Comissão (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={calcCommission}
                            onChange={(e) => setCalcCommission(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        />
                    </div>
                    <div className="flex items-end">
                        <div className="w-full p-4 bg-primary/20 dark:bg-primary/30 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Ganho Estimado</p>
                            <p className="text-2xl font-bold text-primary">
                                {calculatedEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            />
                        </div>
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                        <option value="">Todas as categorias</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showFavoritesOnly
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <span className="material-symbols-outlined">{showFavoritesOnly ? 'star' : 'star_outline'}</span>
                        Favoritos
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {/* Product Image */}
                        {product.imageUrl && (
                            <div className="h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        <div className="p-4">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                        {product.category}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleToggleFavorite(product)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                >
                                    <span className={`material-symbols-outlined ${product.isFavorite ? 'fill text-yellow-500' : 'text-gray-400'}`}>
                                        star
                                    </span>
                                </button>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                    {product.description}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500">Cliques</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{product.clicks}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Vendas</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{product.conversions}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Receita</p>
                                    <p className="font-bold text-green-600 dark:text-green-400">
                                        {product.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </div>
                            </div>

                            {/* Price & Commission */}
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <p className="text-xs text-gray-500">Preço</p>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Comissão</p>
                                    <p className="font-bold text-primary">{product.commission}%</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleCopyLink(product.affiliateLink)}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
                                    title="Copiar link"
                                >
                                    <span className="material-symbols-outlined text-sm">link</span>
                                    Link
                                </button>
                                {!product.shortLink && (
                                    <button
                                        onClick={() => handleGenerateShortLink(product)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg text-sm font-medium transition-colors"
                                        title="Gerar link curto"
                                    >
                                        <span className="material-symbols-outlined text-sm">magic_button</span>
                                        Encurtar
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Editar"
                                >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                                    title="Excluir"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">inventory_2</span>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || categoryFilter || showFavoritesOnly
                            ? 'Nenhum produto encontrado com os filtros aplicados'
                            : 'Nenhum produto afiliado cadastrado'}
                    </p>
                    {!searchTerm && !categoryFilter && !showFavoritesOnly && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Adicionar Primeiro Produto
                        </button>
                    )}
                </div>
            )}

            {/* Modals */}
            <AffiliateProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                }}
                onSave={handleSaveProduct}
                initialData={selectedProduct || undefined}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedProduct(null);
                }}
                onConfirm={handleDeleteProduct}
                title="Excluir Produto Afiliado"
                message={`Tem certeza que deseja excluir "${selectedProduct?.name}"? Esta ação não pode ser desfeita.`}
            />
        </div>
    );
};

export default Affiliates;
