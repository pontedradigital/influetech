import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingProductService, TrendingProduct } from '../services/TrendingProductService';
import PremiumFeatureWrapper from '../components/PremiumFeatureWrapper';

interface Stats {
    overall: {
        total_products: number;
        avg_growth: number;
        avg_sentiment: number;
        high_hype_count: number;
    };
    byPlatform: Array<{
        platform: string;
        count: number;
        avg_growth: number;
        avg_sentiment: number;
    }>;
    byCategory: Array<{
        category: string;
        count: number;
        avg_growth: number;
    }>;
    topProducts: Array<{
        id: number;
        product_name: string;
        category: string;
        platform: string;
        growth_percentage: number;
        sentiment_score: number;
        hype_level: string;
    }>;
    lastUpdate: string;
}

interface Category {
    id: number;
    name: string;
    icon: string;
    description: string;
    product_count: number;
}

const ProductPlannerContent = () => {
    const [products, setProducts] = useState<TrendingProduct[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedHype, setSelectedHype] = useState('');
    const [sortBy, setSortBy] = useState('growth_percentage');
    const [selectedProduct, setSelectedProduct] = useState<TrendingProduct | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, [selectedPlatform, selectedCategory, selectedHype, sortBy]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Use TrendingProductService instead of API
            const params = {
                platform: selectedPlatform,
                sort_by: sortBy,
                limit: 50,
                ...(selectedCategory && { category: selectedCategory }),
                ...(selectedHype && { hype_level: selectedHype })
            };

            const [productsRes, statsRes, categoriesRes] = await Promise.all([
                TrendingProductService.getProducts(params),
                TrendingProductService.getStats(),
                TrendingProductService.getCategories()
            ]);

            if (productsRes.success) setProducts(productsRes.data);
            if (statsRes.success) setStats(statsRes.data);
            if (categoriesRes.success) setCategories(categoriesRes.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await TrendingProductService.refresh();
            await fetchData();
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const getPlatformColor = (platform: string) => {
        const colors: Record<string, string> = {
            aliexpress: '#FF6B00',
            temu: '#FF6F00',
            shein: '#000000',
            amazon: '#FF9900', // Amazon Orange
            shopee: '#EE4D2D'  // Shopee Red
        };
        return colors[platform] || '#6366F1';
    };

    const getHypeColor = (hype: string) => {
        const colors: Record<string, string> = {
            'Altíssimo': 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
            'Alto': 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
            'Médio': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
            'Baixo': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
        };
        return colors[hype] || 'bg-gray-100 text-gray-700';
    };

    const formatLastUpdate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `${diffMins} min atrás`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h atrás`;
        return `${Math.floor(diffHours / 24)}d atrás`;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Carregando produtos em tendência...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111621]">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-primary">trending_up</span>
                            Planejador de Produtos
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Descubra produtos em alta no AliExpress, Temu e Shein com dados em tempo real
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {stats && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Última atualização</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {formatLastUpdate(stats.lastUpdate)}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                        >
                            <span className={`material-symbols-outlined ${isRefreshing ? 'animate-spin' : ''}`}>
                                refresh
                            </span>
                            {isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total de Produtos</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                        {stats.overall.total_products}
                                    </h3>
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">Em tendência</p>
                                </div>
                                <span className="material-symbols-outlined text-5xl text-primary">inventory_2</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-sm text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/80">Crescimento Médio</p>
                                    <h3 className="text-3xl font-bold mt-1">
                                        +{stats.overall.avg_growth.toFixed(0)}%
                                    </h3>
                                    <p className="text-xs text-white/80 mt-1">Buscas no Google</p>
                                </div>
                                <span className="material-symbols-outlined text-5xl">trending_up</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-sm text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/80">Sentimento Médio</p>
                                    <h3 className="text-3xl font-bold mt-1">
                                        {stats.overall.avg_sentiment.toFixed(0)}%
                                    </h3>
                                    <p className="text-xs text-white/80 mt-1">Avaliação positiva</p>
                                </div>
                                <span className="material-symbols-outlined text-5xl">sentiment_satisfied</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl shadow-sm text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/80">Hype Altíssimo</p>
                                    <h3 className="text-3xl font-bold mt-1">
                                        {stats.overall.high_hype_count}
                                    </h3>
                                    <p className="text-xs text-white/80 mt-1">Produtos em destaque</p>
                                </div>
                                <span className="material-symbols-outlined text-5xl">local_fire_department</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">filter_list</span>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filtros</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Platform Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Plataforma
                            </label>
                            <select
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">Todas as Plataformas</option>
                                <option value="aliexpress">AliExpress</option>
                                <option value="temu">Temu</option>
                                <option value="shein">Shein</option>
                                <option value="amazon">Amazon</option>
                                <option value="shopee">Shopee</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Categoria
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Todas as Categorias</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name} ({cat.product_count})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Hype Level Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nível de Hype
                            </label>
                            <select
                                value={selectedHype}
                                onChange={(e) => setSelectedHype(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Todos os Níveis</option>
                                <option value="Altíssimo">Altíssimo 🔥</option>
                                <option value="Alto">Alto ⬆️</option>
                                <option value="Médio">Médio ➡️</option>
                                <option value="Baixo">Baixo ⬇️</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ordenar Por
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                            >
                                <option value="growth_percentage">Maior Crescimento</option>
                                <option value="sentiment_score">Melhor Sentimento</option>
                                <option value="search_volume">Mais Buscado</option>
                                <option value="price_min">Menor Preço</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">local_fire_department</span>
                            Produtos em Tendência
                            <span className="text-sm font-normal text-gray-500">({products.length} produtos)</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-gray-500">Carregando produtos...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">inventory_2</span>
                            <p className="text-gray-500">Nenhum produto encontrado com os filtros selecionados</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    {/* Product Image */}
                                    <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                        <img
                                            src={product.image_url}
                                            alt={product.product_name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getHypeColor(product.hype_level)}`}>
                                                {product.hype_level}
                                            </span>
                                        </div>
                                        <div className="absolute top-3 left-3">
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-bold text-white capitalize"
                                                style={{ backgroundColor: getPlatformColor(product.platform) }}
                                            >
                                                {product.platform}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                            {product.product_name}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 h-8">
                                            {product.description.length > 70
                                                ? product.description.substring(0, 70) + '...'
                                                : product.description}
                                        </p>

                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-sm text-gray-500">category</span>
                                            <span className="text-xs text-gray-500">{product.category}</span>
                                        </div>

                                        {/* Metrics */}
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Tendência de Alta</p>
                                                <p className="font-bold text-green-600 dark:text-green-400 text-sm">
                                                    +{product.growth_percentage.toFixed(0)}%
                                                </p>
                                            </div>
                                            <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Aprovação</p>
                                                <p className="font-bold text-purple-600 dark:text-purple-400 text-sm">
                                                    {Number(product.sentiment_score).toFixed(0)}%
                                                </p>
                                            </div>
                                            <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Vol. Buscas</p>
                                                <p className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                                                    {(product.search_volume / 1000).toFixed(0)}k
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Faixa de Preço</p>
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(product.price_min)} - {formatCurrency(product.price_max)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button className="flex-1 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-600 transition-colors">
                                                Ver Detalhes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Charts Section */}
                {stats && stats.byCategory.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Category Distribution */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">bar_chart</span>
                                Top Categorias por Crescimento
                            </h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.byCategory.slice(0, 8)}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                        <XAxis dataKey="category" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} fontSize={12} />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Bar dataKey="avg_growth" radius={[8, 8, 0, 0]}>
                                            {stats.byCategory.slice(0, 8).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Platform Comparison */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">pie_chart</span>
                                Comparação por Plataforma
                            </h3>
                            <div className="space-y-4">
                                {stats.byPlatform.map((platform) => (
                                    <div key={platform.platform} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-gray-900 dark:text-white capitalize">
                                                {platform.platform}
                                            </span>
                                            <span className="text-sm text-gray-500">{platform.count} produtos</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Crescimento Médio</p>
                                                <p className="font-bold text-green-600 dark:text-green-400">
                                                    +{platform.avg_growth.toFixed(1)}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Sentimento Médio</p>
                                                <p className="font-bold text-purple-600 dark:text-purple-400">
                                                    {platform.avg_sentiment.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detalhes do Produto</h2>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex gap-6 mb-6">
                                <img
                                    src={selectedProduct.image_url}
                                    alt={selectedProduct.product_name}
                                    className="w-48 h-48 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {selectedProduct.product_name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-bold text-white capitalize"
                                            style={{ backgroundColor: getPlatformColor(selectedProduct.platform) }}
                                        >
                                            {selectedProduct.platform}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getHypeColor(selectedProduct.hype_level)}`}>
                                            {selectedProduct.hype_level}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedProduct.description}</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Categoria</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{selectedProduct.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Faixa de Preço</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(selectedProduct.price_min)} - {formatCurrency(selectedProduct.price_max)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tendência de Alta</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        +{selectedProduct.growth_percentage.toFixed(0)}%
                                    </p>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Aprovação do Público</p>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {Number(selectedProduct.sentiment_score).toFixed(0)}%
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Volume de Buscas</p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {selectedProduct.search_volume.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keywords Relacionadas</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProduct.keywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <a
                                    href={selectedProduct.product_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors text-center"
                                >
                                    Ver no {selectedProduct.platform}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function ProductPlanner() {
    return (
        <PremiumFeatureWrapper featureName="Planejador de Produtos">
            <ProductPlannerContent />
        </PremiumFeatureWrapper>
    );
}
