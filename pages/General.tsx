
import React, { useState } from 'react';
import { Product, Company } from '../types';
import { useInfluencer } from '../context/InfluencerContext';

// Lista de países
const COUNTRIES = [
  'Brasil', 'Estados Unidos', 'China', 'Japão', 'Alemanha', 'Reino Unido',
  'França', 'Itália', 'Canadá', 'Coreia do Sul', 'Taiwan', 'Índia', 'México',
  'Espanha', 'Austrália', 'Holanda', 'Suíça', 'Suécia', 'Outro'
];

// Lista de categorias de produtos (em ordem alfabética)
const PRODUCT_CATEGORIES = [
  'Cadeiras',
  'Caixa de Som',
  'Controles',
  'Hardware',
  'Headset',
  'Jogos',
  'Kit Mouse + Teclado',
  'Microfones',
  'Mochilas',
  'Monitores',
  'Mouse',
  'Mousepad',
  'Notebook',
  'Outros/Diversos',
  'Setup Completo',
  'Teclado'
];

// Função para validar telefone internacional
const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Campo opcional
  const phonePattern = /^\+\d{1,3}\s?\(?\d{2,3}\)?\s?\d{4,5}-?\d{4}$/;
  return phonePattern.test(phone);
};

// Modal de Confirmação de Exclusão
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) => {
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
            <button onClick={onClose} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
            <button onClick={onConfirm} className="flex-1 h-11 rounded-lg bg-red-600 font-bold text-white hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de Editar Produto
const EditProductModal = ({ isOpen, onClose, onSave, product }: { isOpen: boolean; onClose: () => void; onSave: (product: Product) => void; product: Product | null }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [companyId, setCompanyId] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<Product['status']>('Em análise');
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);

  React.useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3001/api/companies')
        .then(res => res.json())
        .then(data => setCompanies(data.map((c: any) => ({ id: c.id, name: c.name }))))
        .catch(err => console.error('Erro ao carregar empresas:', err));
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price?.toString() || '');
      setStatus(product.status);

      if (companies.length > 0) {
        const found = companies.find(c => c.name === product.company);
        if (found) setCompanyId(found.id);
      }
    }
  }, [product, companies]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          brand: companies.find(c => c.id === companyId)?.name || product.company,
          marketValue: parseFloat(price) || 0,
          condition: 'Novo',
          status: status === 'Em análise' ? 'RECEIVED' : status
        })
      });

      if (response.ok) {
        onSave({
          ...product,
          name,
          category,
          company: companies.find(c => c.id === companyId)?.name || product.company,
          price: parseFloat(price) || 0,
          status
        });
        onClose();
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Produto</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome do Produto</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white">
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preço (R$)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Empresa</label>
            <select
              value={companyId}
              onChange={e => setCompanyId(e.target.value)}
              className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
            >
              <option value="">Selecione uma empresa</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as Product['status'])} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white">
              <option value="Em análise">Em análise</option>
              <option value="Aguardando Envio">Aguardando Envio</option>
              <option value="Post Agendado">Post Agendado</option>
              <option value="Publicado">Publicado</option>
              <option value="Vendido">Vendido</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 h-11 rounded-lg bg-primary font-bold text-white hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Editar Empresa
const EditCompanyModal = ({ isOpen, onClose, onSave, company }: { isOpen: boolean; onClose: () => void; onSave: (company: Company) => void; company: Company | null }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [phoneError, setPhoneError] = useState('');

  React.useEffect(() => {
    if (company) {
      setName(company.name);
      setContact(company.contact || '');
      setEmail(company.email || '');
    }
  }, [company]);

  if (!isOpen || !company) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/companies/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contactName: contact,
          email,
          phone,
          country,
          status: 'ACTIVE',
          rating: 0
        })
      });

      if (response.ok) {
        onSave({ ...company, name, contact, email });
        onClose();
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar empresa');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Empresa</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome da Empresa</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contato</label>
            <input required type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 h-11 rounded-lg bg-primary font-bold text-white hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// MOCK DATA
const initialProducts: Product[] = [
  { id: '1', name: 'Smartphone X Pro', category: 'Eletrônicos', company: 'Apple Inc.', receiveDate: '01 Nov, 2023', status: 'Vendido', price: 8999, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=300&q=80' },
  { id: '2', name: 'Laptop Gamer Z', category: 'Eletrônicos', company: 'Razer', receiveDate: '25 Out, 2023', status: 'Em análise', price: 12499, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&q=80' },
  { id: '3', name: 'Headset Pro 7.1', category: 'Acessórios', company: 'Logitech', receiveDate: '05 Nov, 2023', status: 'Publicado', price: 999, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&q=80' },
  { id: '4', name: 'Smartwatch Series 9', category: 'Acessórios', company: 'Samsung', receiveDate: '30 Out, 2023', status: 'Vendido', price: 3199, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&q=80' },
  { id: '5', name: 'Câmera Mirrorless A7', category: 'Eletrônicos', company: 'Sony', receiveDate: '20 Out, 2023', status: 'Enviado', price: 15299, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80' },
  { id: '6', name: 'Drone Air 3', category: 'Eletrônicos', company: 'DJI', receiveDate: '02 Nov, 2023', status: 'Aguardando Envio', price: 7899, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&q=80' },
];

const companies: Company[] = [
  { id: '1', name: 'Google', contact: 'Sundar Pichai', status: 'Ativo', email: 'contact@google.com' },
  { id: '2', name: 'Apple', contact: 'Tim Cook', status: 'Ativo', email: 'contact@apple.com' },
  { id: '3', name: 'Meta', contact: 'Mark Zuckerberg', status: 'Inativo', email: 'contact@meta.com' },
  { id: '4', name: 'Amazon', contact: 'Andy Jassy', status: 'Pendente', email: 'contact@amazon.com' },
];

const NewProductModal = ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (product: Product) => void }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [companyId, setCompanyId] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<Product['status']>('Em análise');
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);

  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Import Calculation State
  const { data: influencerData } = useInfluencer();
  const [isImported, setIsImported] = useState(false);
  const [priceUSD, setPriceUSD] = useState('');
  const [shippingUSD, setShippingUSD] = useState('');
  const [calculationResult, setCalculationResult] = useState<{
    priceBRL: number;
    shippingBRL: number;
    importTax: number;
    icms: number;
    total: number;
  } | null>(null);

  // Calculate Import Costs
  React.useEffect(() => {
    if (isImported && priceUSD) {
      const usd = parseFloat(priceUSD) || 0;
      const shipping = parseFloat(shippingUSD) || 0;
      const rate = influencerData.importSettings.dollarRate;

      const priceBRL = usd * rate;
      const shippingBRL = shipping * rate;
      const baseTotalBRL = priceBRL + shippingBRL;

      let importTaxRate = 0;
      if (usd <= 50) {
        importTaxRate = influencerData.importSettings.taxRateUnder50 / 100;
      } else {
        importTaxRate = influencerData.importSettings.taxRateOver50 / 100;
      }

      const importTax = baseTotalBRL * importTaxRate;

      // ICMS Calculation (Base + ImportTax) / (1 - ICMS Rate)
      // Standard formula: Total = (Base + ImportTax) / (1 - ICMS)
      // ICMS Amount = Total * ICMS Rate
      const icmsRate = influencerData.importSettings.icmsRate / 100;
      const totalWithICMS = (baseTotalBRL + importTax) / (1 - icmsRate);
      const icmsAmount = totalWithICMS * icmsRate;

      setCalculationResult({
        priceBRL,
        shippingBRL,
        importTax,
        icms: icmsAmount,
        total: totalWithICMS
      });

      // Auto-fill price field with calculated total
      setPrice(totalWithICMS.toFixed(2));
    } else {
      setCalculationResult(null);
    }
  }, [isImported, priceUSD, shippingUSD, influencerData.importSettings]);

  // Fetch companies when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLoadingCompanies(true);
      fetch('http://localhost:3001/api/companies')
        .then(res => res.json())
        .then(data => {
          setCompanies(data.map((c: any) => ({ id: c.id, name: c.name })));
          setLoadingCompanies(false);
        })
        .catch(err => {
          console.error('Erro ao carregar empresas:', err);
          setLoadingCompanies(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      alert('Por favor, selecione uma empresa');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          brand: companies.find(c => c.id === companyId)?.name || '',
          marketValue: parseFloat(price) || 0,
          condition: 'Novo',
          userId: 'mock-id',
          companyId: companyId
        })
      });

      if (response.ok) {
        const newProduct = await response.json();
        const selectedCompany = companies.find(c => c.id === companyId);
        onSave({
          id: newProduct.id,
          name: newProduct.name,
          category: newProduct.category,
          company: selectedCompany?.name || '',
          price: parseFloat(price) || 0,
          receiveDate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Em análise',
          image: `https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&q=80`
        });
        setName('');
        setCompanyId('');
        setPrice('');
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert('Erro ao criar produto');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Novo Produto</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome do Produto</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400" placeholder="Ex: Headphone Bluetooth" />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isImported}
                onChange={e => setIsImported(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Produto Importado?</span>
            </label>

            {isImported && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preço (USD)</label>
                    <input
                      type="number"
                      value={priceUSD}
                      onChange={e => setPriceUSD(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Frete (USD)</label>
                    <input
                      type="number"
                      value={shippingUSD}
                      onChange={e => setShippingUSD(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {calculationResult && (
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm space-y-1">
                    <div className="flex justify-between text-gray-500">
                      <span>Conversão (R$ {influencerData.importSettings.dollarRate.toFixed(2)})</span>
                      <span>R$ {(calculationResult.priceBRL + calculationResult.shippingBRL).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Imposto Importação ({parseFloat(priceUSD) <= 50 ? influencerData.importSettings.taxRateUnder50 : influencerData.importSettings.taxRateOver50}%)</span>
                      <span>R$ {calculationResult.importTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>ICMS ({influencerData.importSettings.icmsRate}%)</span>
                      <span>R$ {calculationResult.icms.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span>Custo Total Estimado</span>
                      <span className="text-primary">R$ {calculationResult.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white">
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preço (R$)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400" placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Empresa</label>
              <select
                required
                value={companyId}
                onChange={e => setCompanyId(e.target.value)}
                disabled={loadingCompanies}
                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingCompanies ? 'Carregando...' : 'Selecione uma empresa'}
                </option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Data Recebimento</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status Inicial</label>
            <select value={status} onChange={e => setStatus(e.target.value as Product['status'])} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white">
              <option value="Em análise">Em análise</option>
              <option value="Aguardando Envio">Aguardando Envio</option>
              <option value="Post Agendado">Post Agendado</option>
              <option value="Publicado">Publicado</option>
              <option value="Vendido">Vendido</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 h-11 rounded-lg bg-primary font-bold text-white hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">Salvar Produto</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  React.useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          company: p.brand,
          receiveDate: new Date(p.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: p.status === 'RECEIVED' ? 'Em análise' : p.status,
          price: p.marketValue,
          image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&q=80'
        }));
        setProducts(mapped);
      })
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  const confirmDelete = async () => {
    if (!deletingProductId) return;
    try {
      const response = await fetch(`http://localhost:3001/api/products/${deletingProductId}`, { method: 'DELETE' });
      if (response.ok) setProducts(products.filter(p => p.id !== deletingProductId));
    } catch (error) {
      console.error('Erro:', error);
    }
    setDeletingProductId(null);
  };

  // Get unique values for filters
  const categories = Array.from(new Set(products.map(p => p.category))).sort();
  const statuses = Array.from(new Set(products.map(p => p.status))).sort();
  const companies = Array.from(new Set(products.map(p => p.company))).filter(Boolean).sort();

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    const matchesCompany = !selectedCompany || product.company === selectedCompany;

    return matchesSearch && matchesCategory && matchesStatus && matchesCompany;
  });

  return (
    <div className="flex flex-col gap-6">
      <DeleteConfirmModal isOpen={!!deletingProductId} onClose={() => setDeletingProductId(null)} onConfirm={confirmDelete} title="Excluir Produto" message="Tem certeza que deseja excluir este produto?" />
      <EditProductModal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} onSave={(u) => { setProducts(products.map(p => p.id === u.id ? u : p)); setEditingProduct(null); }} product={editingProduct} />
      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(product) => {
          setProducts([product, ...products]);
          setIsModalOpen(false);
        }}
      />
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Produtos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg font-bold transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Cadastrar Produto
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
            placeholder="Pesquisar produto..."
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Todas Categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Todos Status</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        {/* Company Filter */}
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="px-4 h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Todas Empresas</option>
          {companies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
      </div>

      {/* Products List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4">Data Recebimento</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || selectedCategory || selectedStatus || selectedCompany
                      ? 'Nenhum produto encontrado com os filtros aplicados.'
                      : 'Nenhum produto cadastrado ainda.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{product.company || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary">
                        {product.price ? `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{product.receiveDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${product.status === 'Vendido' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          product.status === 'Enviado' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                            product.status === 'Publicado' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingProductId(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Excluir"
                        >
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

      {/* Results count */}
      {filteredProducts.length > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {filteredProducts.length} de {products.length} produto{products.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

const NewCompanyModal = ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (company: Company) => void }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [phoneError, setPhoneError] = useState('');

  if (!isOpen) return null;

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (value && !validatePhone(value)) {
      setPhoneError('Formato inválido. Use: +[DDI] ([DDD]) [Número]. Ex: +55 (11) 98765-4321');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone && !validatePhone(phone)) {
      setPhoneError('Formato de telefone inválido');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contactName: contact,
          email,
          phone,
          country,
          userId: 'mock-id'
        })
      });

      if (response.ok) {
        const newCompany = await response.json();
        onSave({
          id: newCompany.id,
          name: newCompany.name,
          contact: newCompany.contactName,
          email: newCompany.email,
          status: 'Ativo'
        });
        setName('');
        setContact('');
        setEmail('');
        setPhone('');
        setCountry('');
        setPhoneError('');
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        console.error('Erro na resposta:', response.status, errorData);
        alert(`Erro ao criar empresa: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      alert(`Erro ao criar empresa: ${error instanceof Error ? error.message : 'Erro de conexão com o servidor'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nova Empresa</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome da Empresa</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="Ex: Fifine" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome do Contato</label>
            <input required type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="Ex: João Silva" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="contato@empresa.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">País de Origem</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white">
              <option value="">Selecione um país</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Telefone <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => handlePhoneChange(e.target.value)}
              className={`w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border ${phoneError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white`}
              placeholder="+55 (11) 98765-4321"
            />
            {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
            <p className="text-gray-400 text-xs mt-1">Formato: +[DDI] ([DDD]) [Número]</p>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
            <button type="submit" disabled={!!phoneError} className="flex-1 h-11 rounded-lg bg-primary font-bold text-white hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">Salvar Empresa</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);

  React.useEffect(() => {
    fetch('http://localhost:3001/api/companies')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          contact: c.contactName,
          status: c.status === 'ACTIVE' ? 'Ativo' : 'Inativo',
          email: c.email
        }));
        setCompanies(mapped);
      })
      .catch(err => console.error('Erro ao buscar empresas:', err));
  }, []);

  const confirmDelete = async () => {
    if (!deletingCompanyId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/companies/${deletingCompanyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCompanies(companies.filter(c => c.id !== deletingCompanyId));
      } else {
        alert('Erro ao excluir empresa');
      }
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      alert('Erro ao excluir empresa');
    }
    setDeletingCompanyId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <DeleteConfirmModal
        isOpen={!!deletingCompanyId}
        onClose={() => setDeletingCompanyId(null)}
        onConfirm={confirmDelete}
        title="Excluir Empresa"
        message="Tem certeza que deseja excluir esta empresa?"
      />
      <EditCompanyModal
        isOpen={!!editingCompany}
        onClose={() => setEditingCompany(null)}
        onSave={(updatedCompany) => {
          setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
          setEditingCompany(null);
        }}
        company={editingCompany}
      />
      <NewCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(c) => {
          setCompanies([c, ...companies]);
          setIsModalOpen(false);
        }}
      />
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Empresas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg font-bold transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Adicionar Empresa
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {companies.map(company => (
                <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center p-2">
                        <span className="material-symbols-outlined text-gray-500">business</span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{company.contact}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                      ${company.status === 'Ativo' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        company.status === 'Inativo' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingCompany(company)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingCompanyId(company.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Agenda() {
  const days = Array.from({ length: 35 }, (_, i) => i + 1); // Mock calendar days

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Agenda</h1>
          <p className="text-gray-500">Gerencie suas postagens e cronogramas.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg font-bold">
          <span className="material-symbols-outlined">add</span>
          Agendar Post
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-gray-100 rounded-full"><span className="material-symbols-outlined">chevron_left</span></button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Novembro 2023</h2>
            <button className="p-1 hover:bg-gray-100 rounded-full"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500"></div> Instagram</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-black dark:bg-white"></div> TikTok</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600"></div> YouTube</span>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} className="py-3 text-center text-sm font-semibold text-gray-500">{d}</div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {days.map((day) => {
            const isToday = day === 15; // Mock today
            return (
              <div key={day} className={`border-b border-r border-gray-200 dark:border-gray-700 p-2 min-h-[100px] relative ${day > 30 ? 'bg-gray-50/50 dark:bg-gray-900/30' : ''}`}>
                <span className={`text-sm font-medium ${isToday ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700 dark:text-gray-300'}`}>
                  {day > 30 ? day - 30 : day}
                </span>

                {day === 3 && (
                  <div className="mt-2 p-1.5 bg-pink-100 text-pink-700 text-xs rounded border-l-2 border-pink-500 truncate cursor-pointer hover:opacity-80">
                    Review Headphone
                  </div>
                )}
                {day === 8 && (
                  <div className="mt-2 p-1.5 bg-blue-100 text-blue-700 text-xs rounded border-l-2 border-blue-500 truncate cursor-pointer hover:opacity-80">
                    Artigo Blog
                  </div>
                )}
                {day === 15 && (
                  <div className="mt-2 p-1.5 bg-red-100 text-red-700 text-xs rounded border-l-2 border-red-500 truncate cursor-pointer hover:opacity-80">
                    Vídeo YouTube
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
