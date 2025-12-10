import React, { useState } from 'react';

const CONTACT_CHANNELS = [
    'WhatsApp',
    'Discord',
    'Instagram Direct',
    'TikTok',
    'Facebook Messenger'
];

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Cancelar
                        </button>
                        <button onClick={onConfirm} className="flex-1 h-11 rounded-lg bg-red-600 font-bold text-white hover:bg-red-700 transition-colors">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// New Sale Modal
const NewSaleModal = ({ isOpen, onClose, onSave }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}) => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerCpf, setCustomerCpf] = useState('');
    const [contactChannel, setContactChannel] = useState(CONTACT_CHANNELS[0]);
    const [contactValue, setContactValue] = useState('');
    const [cep, setCep] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [loadingCep, setLoadingCep] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            fetch('/api/products')
                .then(res => res.json())
                .then(data => setProducts(data))
                .catch(err => console.error('Erro ao buscar produtos:', err));
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (selectedProductId) {
            const product = products.find(p => p.id === selectedProductId);
            if (product && product.marketValue) {
                setSalePrice(product.marketValue.toString());
            }
        }
    }, [selectedProductId, products]);

    const resetForm = () => {
        setSelectedProductId('');
        setCustomerName('');
        setCustomerCpf('');
        setContactChannel(CONTACT_CHANNELS[0]);
        setContactValue('');
        setCep('');
        setStreet('');
        setNumber('');
        setComplement('');
        setNeighborhood('');
        setCity('');
        setState('');
        setSalePrice('');
    };

    const fetchAddressByCEP = async (cepValue: string) => {
        const cleanCep = cepValue.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        setLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setStreet(data.logradouro || '');
                setNeighborhood(data.bairro || '');
                setCity(data.localidade || '');
                setState(data.uf || '');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        } finally {
            setLoadingCep(false);
        }
    };

    const handleCepChange = (value: string) => {
        // Remove all non-numeric characters
        const numbers = value.replace(/\D/g, '');

        // Format as 00000-000
        let formatted = numbers;
        if (numbers.length > 5) {
            formatted = `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
        }

        setCep(formatted);

        // Trigger CEP lookup when we have 8 digits
        if (numbers.length === 8) {
            fetchAddressByCEP(numbers);
        }
    };

    const [contactError, setContactError] = useState('');

    const handleContactValueChange = (value: string) => {
        setContactValue(value);
        setContactError('');

        if (contactChannel === 'WhatsApp') {
            // ... WhatsApp logic (omitted for brevity, assume keeping existing logic if needed, but here I'm replacing the function)
            // Re-implementing WhatsApp masking for completeness since I'm replacing the block
            const numbers = value.replace(/\D/g, '');
            let formatted = numbers;
            if (numbers.length > 0) {
                if (numbers.length <= 2) formatted = `(${numbers}`;
                else if (numbers.length <= 6) formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
                else if (numbers.length <= 10) formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
                else formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
            }
            setContactValue(formatted);
        } else if (contactChannel === 'Instagram Direct') {
            if (value && !value.startsWith('https://instagram.com/') && !value.startsWith('https://www.instagram.com/')) {
                setContactError('O link deve começar com https://instagram.com/');
            }
        } else if (contactChannel === 'Facebook Messenger') {
            if (value && !value.startsWith('https://m.me/') && !value.startsWith('https://facebook.com/')) {
                setContactError('O link deve ser válido (https://m.me/ ou https://facebook.com/)');
            }
        }
    };

    const handleCpfChange = (value: string) => {
        // Remove all non-numeric characters
        const numbers = value.replace(/\D/g, '');
        let formatted = numbers;

        // Format as 000.000.000-00
        if (numbers.length > 3 && numbers.length <= 6) {
            formatted = `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
        } else if (numbers.length > 6 && numbers.length <= 9) {
            formatted = `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
        } else if (numbers.length > 9) {
            formatted = `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
        }

        setCustomerCpf(formatted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProductId || !customerName || !contactValue) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        if (contactError) {
            alert('Por favor, corrija os erros de contato antes de salvar.');
            return;
        }

        // Validate mandatory address fields
        if (!cep || !street || !number || !neighborhood || !city || !state) {
            alert('Por favor, preencha todos os campos do endereço de envio.');
            return;
        }

        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: selectedProductId,
                    customerName,
                    customerCpf: customerCpf || null,
                    contactChannel,
                    contactValue,
                    cep: cep || null,
                    street: street || null,
                    number: number || null,
                    complement: complement || null,
                    neighborhood: neighborhood || null,
                    city: city || null,
                    state: state || null,
                    salePrice: parseFloat(salePrice),
                    userId: 'mock-id'
                })
            });

            if (response.ok) {
                onSave();
                resetForm();
                onClose();
            } else {
                alert('Erro ao criar venda');
            }
        } catch (error) {
            console.error('Erro ao criar venda:', error);
            alert('Erro ao criar venda');
        }
    };

    if (!isOpen) return null;

    const selectedProduct = products.find(p => p.id === selectedProductId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-[#1A202C] z-10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nova Venda</h3>
                    <button onClick={() => { resetForm(); onClose(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Product Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Produto <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            required
                            className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                        >
                            <option value="">Selecione um produto</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - {product.category} - R$ {parseFloat(product.marketValue || 0).toFixed(2)}
                                </option>
                            ))}
                        </select>
                        {selectedProduct && (
                            <div className="mt-2 space-y-3">
                                <p className="text-sm text-gray-500">
                                    {selectedProduct.brand} | {selectedProduct.category}
                                </p>

                                {/* Dimensions Display */}
                                {(selectedProduct.weight || selectedProduct.height || selectedProduct.width || selectedProduct.length) && (
                                    <div className="grid grid-cols-4 gap-2 text-xs bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700">
                                        <div title="Peso">
                                            <span className="block text-gray-400">Peso</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{selectedProduct.weight} kg</span>
                                        </div>
                                        <div title="Altura">
                                            <span className="block text-gray-400">Alt.</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{selectedProduct.height} cm</span>
                                        </div>
                                        <div title="Largura">
                                            <span className="block text-gray-400">Larg.</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{selectedProduct.width} cm</span>
                                        </div>
                                        <div title="Comp.">
                                            <span className="block text-gray-400">Comp.</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{selectedProduct.length} cm</span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">price_check</span>
                                        Sugestão de Preços
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm text-center group hover:border-red-200 transition-colors cursor-help" title="50% do valor base">
                                            <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Mínimo (50%)</span>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                R$ {(parseFloat(selectedProduct.marketValue) * 0.5).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm text-center group hover:border-blue-300 transition-colors cursor-help" title="100% do valor base">
                                            <span className="block text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 font-bold">Máximo (100%)</span>
                                            <span className="font-bold text-blue-700 dark:text-blue-300 text-lg">
                                                R$ {(parseFloat(selectedProduct.marketValue) * 1.0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                                            <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Valor Base</span>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                R$ {parseFloat(selectedProduct.marketValue).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Nome do Cliente <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                                placeholder="João Silva"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                CPF do Cliente
                            </label>
                            <input
                                type="text"
                                value={customerCpf}
                                onChange={(e) => handleCpfChange(e.target.value)}
                                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                                placeholder="000.000.000-00"
                                maxLength={14}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Preço de Venda <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={salePrice}
                                onChange={(e) => setSalePrice(e.target.value)}
                                required
                                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                                placeholder="299.99"
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Canal de Contato <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={contactChannel}
                                onChange={(e) => setContactChannel(e.target.value)}
                                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                            >
                                {CONTACT_CHANNELS.map(channel => (
                                    <option key={channel} value={channel}>{channel}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {contactChannel === 'WhatsApp' ? 'Telefone' :
                                    contactChannel === 'Discord' ? 'Username' :
                                        contactChannel === 'Instagram Direct' ? '@Username' :
                                            contactChannel === 'TikTok' ? '@Username' :
                                                'Nome/Username'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={contactValue}
                                onChange={(e) => handleContactValueChange(e.target.value)}
                                required
                                className={`w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border ${contactError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary/20 focus:border-primary'} outline-none transition-all text-gray-900 dark:text-white`}
                                placeholder={
                                    contactChannel === 'WhatsApp' ? '(11) 98765-4321' :
                                        contactChannel === 'Discord' ? 'usuario#1234' :
                                            contactChannel === 'Instagram Direct' ? 'https://instagram.com/usuario' :
                                                contactChannel === 'TikTok' ? '@usuario' :
                                                    contactChannel === 'Facebook Messenger' ? 'https://m.me/usuario' :
                                                        '@usuario'
                                }
                                maxLength={contactChannel === 'WhatsApp' ? 15 : undefined}
                            />
                            {contactError && <p className="text-xs text-red-500 mt-1">{contactError}</p>}
                        </div>
                    </div>


                    {/* Shipping Address */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Endereço de Envio</h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">CEP <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={cep}
                                    onChange={(e) => handleCepChange(e.target.value)}
                                    className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="12345-678"
                                    maxLength={9}
                                />
                                {loadingCep && <p className="text-xs text-primary mt-1">Buscando...</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rua <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="Rua das Flores"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Número <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="123"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Complemento</label>
                                <input
                                    type="text"
                                    value={complement}
                                    onChange={(e) => setComplement(e.target.value)}
                                    className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="Apto 45"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bairro <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={neighborhood}
                                    onChange={(e) => setNeighborhood(e.target.value)}
                                    className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="Centro"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cidade <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="São Paulo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Estado <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="SP"
                                    maxLength={2}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" onClick={() => { resetForm(); onClose(); }} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="flex-1 h-11 rounded-lg bg-primary font-bold text-white hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all">
                            Registrar Venda
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

// Sale Details Modal
const SaleDetailsModal = ({ isOpen, onClose, sale, onDelete }: {
    isOpen: boolean;
    onClose: () => void;
    sale: any | null;
    onDelete: () => void;
}) => {
    if (!isOpen || !sale) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes da Venda</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Product Info */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Produto</label>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{sale.productName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{sale.productCategory} • {sale.productBrand}</p>
                    </div>

                    {/* Customer & Sale Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Cliente</label>
                            <p className="text-gray-900 dark:text-white font-medium">{sale.customerName}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Preço de Venda</label>
                            <p className="text-2xl font-bold text-primary">R$ {parseFloat(sale.salePrice).toFixed(2)}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Canal de Contato</label>
                            <p className="text-gray-900 dark:text-white font-medium">{sale.contactChannel}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Contato</label>
                            {sale.contactValue.startsWith('http') ? (
                                <a href={sale.contactValue} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all">
                                    {sale.contactValue}
                                </a>
                            ) : (
                                <p className="text-gray-900 dark:text-white font-medium">{sale.contactValue}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Data da Venda</label>
                            <p className="text-gray-900 dark:text-white font-medium">
                                {new Date(sale.saleDate).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Status</label>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sale.status)}`}>
                                {sale.status}
                            </span>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {sale.cep && (
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-3">Endereço de Envio</label>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">CEP:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white font-medium">{sale.cep}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Rua:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white font-medium">{sale.street}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Número:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white font-medium">{sale.number}</span>
                                </div>
                                {sale.complement && (
                                    <div>
                                        <span className="text-gray-500">Complemento:</span>
                                        <span className="ml-2 text-gray-900 dark:text-white font-medium">{sale.complement}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-gray-500">Bairro:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white font-medium">{sale.neighborhood}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Cidade/UF:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white font-medium">{sale.city}/{sale.state}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-6 flex gap-3 border-t border-gray-100 dark:border-gray-700">
                        <button
                            onClick={onDelete}
                            className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg border-2 border-red-500 font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            Excluir Venda
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sales Page Component
export default function Sales() {
    const [sales, setSales] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingSale, setViewingSale] = useState<any | null>(null);
    const [deletingSaleId, setDeletingSaleId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSales = () => {
        fetch(`/api/sales${searchTerm ? `?search=${searchTerm}` : ''}`)
            .then(res => res.json())
            .then(data => setSales(data))
            .catch(err => console.error('Erro ao buscar vendas:', err));
    };

    React.useEffect(() => {
        fetchSales();
    }, [searchTerm]);

    const handleSave = () => {
        fetchSales();
        setIsModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!deletingSaleId) return;
        try {
            const response = await fetch(`/api/sales/${deletingSaleId}`, { method: 'DELETE' });
            if (response.ok) {
                fetchSales();
                setViewingSale(null);
            }
        } catch (error) {
            console.error('Erro:', error);
        }
        setDeletingSaleId(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <DeleteConfirmModal
                isOpen={!!deletingSaleId}
                onClose={() => setDeletingSaleId(null)}
                onConfirm={confirmDelete}
                title="Excluir Venda"
                message="Tem certeza que deseja excluir esta venda?"
            />

            <SaleDetailsModal
                isOpen={!!viewingSale}
                onClose={() => setViewingSale(null)}
                sale={viewingSale}
                onDelete={() => {
                    setDeletingSaleId(viewingSale?.id);
                    setViewingSale(null);
                }}
            />

            <NewSaleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />

            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">Vendas</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg font-bold transition-all"
                >
                    <span className="material-symbols-outlined">add</span>
                    Nova Venda
                </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                    placeholder="Pesquisar vendas..."
                />
            </div>

            {/* Sales Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Produto</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Contato</th>
                                <th className="px-6 py-4">Preço</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        {searchTerm ? 'Nenhuma venda encontrada.' : 'Nenhuma venda registrada ainda.'}
                                    </td>
                                </tr>
                            ) : (
                                sales.map(sale => (
                                    <tr
                                        key={sale.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                                        onClick={() => setViewingSale(sale)}
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{sale.productName}</p>
                                                <p className="text-sm text-gray-500">{sale.productCategory}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">{sale.customerName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{sale.contactChannel}</p>
                                                <p className="text-xs text-gray-500">{sale.contactValue}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-primary">
                                                R$ {parseFloat(sale.salePrice).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {new Date(sale.saleDate).toLocaleDateString('pt-BR')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(sale.status)}`}>
                                                {sale.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeletingSaleId(sale.id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Results count */}
            {sales.length > 0 && (
                <div className="text-sm text-gray-500">
                    Mostrando {sales.length} venda{sales.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
}
