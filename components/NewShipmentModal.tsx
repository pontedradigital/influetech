import React, { useState, useEffect } from 'react';
import { ProductService, Product } from '../services/ProductService';

interface NewShipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (shipmentData: any) => void;
    initialData?: any;
}

export default function NewShipmentModal({ isOpen, onClose, onSave, initialData }: NewShipmentModalProps) {
    const [formData, setFormData] = useState({
        buyerName: '',
        buyerCpf: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        productName: '',
        value: '',
        paymentMethod: 'Pix',
        weight: '',
        height: '',
        width: '',
        length: ''
    });

    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Carregar produtos disponíveis quando o modal abrir
    useEffect(() => {
        if (isOpen) {
            loadAvailableProducts();
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    buyerName: '',
                    buyerCpf: '',
                    cep: '',
                    street: '',
                    number: '',
                    complement: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    productName: '',
                    value: '',
                    paymentMethod: 'Pix',
                    weight: '',
                    height: '',
                    width: '',
                    length: ''
                });
                setSelectedProductId('');
            }
        }
    }, [isOpen, initialData]);

    const loadAvailableProducts = async () => {
        setLoadingProducts(true);
        try {
            const products = await ProductService.getAvailableForShipping();
            setAvailableProducts(products);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleProductSelect = (productId: string) => {
        setSelectedProductId(productId);
        const product = availableProducts.find(p => p.id === productId);
        if (product) {
            setFormData(prev => ({
                ...prev,
                productName: product.name,
                value: product.marketValue?.toString() || '',
                weight: product.weight?.toString() || '',
                height: product.height?.toString() || '',
                width: product.width?.toString() || '',
                length: product.length?.toString() || ''
            }));
        }
    };

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Se um produto foi selecionado, atualizar seu status para SHIPPED
        if (selectedProductId) {
            try {
                await ProductService.update(selectedProductId, { status: 'SHIPPED' });
            } catch (error) {
                console.error('Erro ao atualizar status do produto:', error);
            }
        }

        onSave({ ...formData, productId: selectedProductId });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {initialData ? 'Editar Envio' : 'Novo Envio'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Dados do Comprador */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Dados do Comprador</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    name="buyerName"
                                    value={formData.buyerName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPF/CNPJ</label>
                                <input
                                    type="text"
                                    name="buyerCpf"
                                    value={formData.buyerCpf}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length > 14) value = value.slice(0, 14);

                                        if (value.length <= 11) {
                                            value = value.replace(/(\d{3})(\d)/, '$1.$2');
                                            value = value.replace(/(\d{3})(\d)/, '$1.$2');
                                            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                                        } else {
                                            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                                            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                                            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                                            value = value.replace(/(\d{4})(\d)/, '$1-$2');
                                        }
                                        setFormData(prev => ({ ...prev, buyerCpf: value }));
                                    }}
                                    maxLength={18}
                                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Endereço de Entrega */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Endereço de Entrega</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="cep"
                                        value={formData.cep}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            const formatted = value.replace(/^(\d{5})(\d)/, '$1-$2').substr(0, 9);
                                            setFormData(prev => ({ ...prev, cep: formatted }));

                                            if (value.length === 8) {
                                                fetch(`https://viacep.com.br/ws/${value}/json/`)
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        if (!data.erro) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                street: data.logradouro,
                                                                neighborhood: data.bairro,
                                                                city: data.localidade,
                                                                state: data.uf,
                                                                complement: data.complemento || prev.complement
                                                            }));
                                                        }
                                                    })
                                                    .catch(err => console.error('Erro ao buscar CEP:', err));
                                            }
                                        }}
                                        required
                                        placeholder="00000-000"
                                        maxLength={9}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                    />
                                    {formData.cep.length === 9 && (
                                        <span className="absolute right-3 top-2.5 text-green-500 material-symbols-outlined text-lg">check_circle</span>
                                    )}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rua / Logradouro</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Complemento</label>
                                <input
                                    type="text"
                                    name="complement"
                                    value={formData.complement}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bairro</label>
                                <input
                                    type="text"
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dados do Pacote */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Dados do Pacote</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso (kg)</label>
                                <input
                                    type="number"
                                    step="0.001"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                    placeholder="0.000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Altura (cm)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                    placeholder="0.0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Largura (cm)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                    placeholder="0.0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comprimento (cm)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="length"
                                    value={formData.length}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                    placeholder="0.0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dados do Produto e Pagamento */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Produto e Pagamento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dropdown de Seleção de Produto */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Selecionar Produto Vendido
                                    {loadingProducts && <span className="ml-2 text-xs text-gray-500">(Carregando...)</span>}
                                </label>
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => handleProductSelect(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                    disabled={loadingProducts}
                                >
                                    <option value="">Selecione um produto...</option>
                                    {availableProducts.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} - {product.brand || ''} {product.model || ''}
                                            {product.marketValue ? ` - R$ ${Number(product.marketValue).toFixed(2)}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {availableProducts.length === 0 && !loadingProducts && (
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                        Nenhum produto vendido disponível para envio. Os produtos precisam ter status "SOLD" para aparecer aqui.
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Produto</label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                    readOnly={!!selectedProductId}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Pago (R$)</label>
                                <input
                                    type="number"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Forma de Pagamento</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="Pix">Pix</option>
                                    <option value="Débito">Débito</option>
                                    <option value="Crédito">Crédito</option>
                                    <option value="Boleto">Boleto</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 shadow-lg shadow-primary/20"
                        >
                            {initialData ? 'Salvar Alterações' : 'Criar Envio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
