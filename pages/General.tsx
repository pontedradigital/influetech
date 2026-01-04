
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Product, Company } from '../types';
import { useInfluencer } from '../context/InfluencerContext';
import { CompanyService } from '../services/CompanyService';
import { compressImage, validateImage } from '../src/utils/imageCompression';
import { ProductService } from '../services/ProductService';
import { SaleService } from '../services/SaleService';
import { StatusBadge, StatusOption } from '../components/StatusBadge';


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

// Mapeamento de Status (Inglês Global -> Português Interface)
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  'RECEIVED': { label: 'Em análise', color: 'text-blue-800 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  'WAITING_ARRIVAL': { label: 'Aguardando Recebimento', color: 'text-gray-800 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-800' },
  'WAITING_SHIPMENT': { label: 'Aguardando Envio', color: 'text-purple-800 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  'SCHEDULED': { label: 'Post Agendado', color: 'text-indigo-800 dark:text-indigo-300', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  'PUBLISHED': { label: 'Publicado', color: 'text-yellow-800 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  'SOLD': { label: 'Vendido', color: 'text-green-800 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/30' },
  'SHIPPED': { label: 'Enviado', color: 'text-cyan-800 dark:text-cyan-300', bg: 'bg-cyan-100 dark:bg-cyan-900/30' }
};

const STATUS_OPTIONS: StatusOption[] = Object.entries(STATUS_MAP).map(([key, value]) => ({
  value: key,
  label: value.label,
  color: `${value.bg} ${value.color}`
}));

// Mapa de Cores (Nome PT -> Hex CSS)
const COLOR_MAP: Record<string, string> = {
  'Preto': '#000000',
  'Branco': '#FFFFFF',
  'Cinza': '#808080',
  'Vermelho': '#EF4444',
  'Azul': '#3B82F6',
  'Verde': '#22C55E',
  'Amarelo': '#EAB308',
  'Laranja': '#F97316',
  'Rosa': '#EC4899',
  'Roxo': '#A855F7',
  'Marrom': '#78350F',
  'Bege': '#F5F5DC',
  'Dourado': '#FFD700',
  'Prateado': '#C0C0C0'
};

// Helper to get user ID
const getUserId = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.id;
    } catch { return null; }
  }
  return null;
};

// Imagens por Categoria (Unsplash IDs)
const CATEGORY_IMAGES: Record<string, string> = {
  'Cadeiras': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&q=80',
  'Caixa de Som': 'https://images.unsplash.com/photo-1545459720-aac639a9192c?w=300&q=80',
  'Controles': 'https://images.unsplash.com/photo-1592840496073-61f264560e80?w=300&q=80',
  'Hardware': 'https://images.unsplash.com/photo-1555617981-d5a489297125?w=300&q=80',
  'Headset': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
  'Jogos': 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&q=80',
  'Kit Mouse + Teclado': 'https://images.unsplash.com/photo-1587829741301-30c00609557f?w=300&q=80',
  'Microfones': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&q=80',
  'Mochilas': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80',
  'Monitores': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80',
  'Mouse': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&q=80',
  'Mousepad': 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=300&q=80',
  'Notebook': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80',
  'Outros/Diversos': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&q=80',
  'Setup Completo': 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=300&q=80',
  'Teclado': 'https://images.unsplash.com/photo-1587829741301-30c00609557f?w=300&q=80'
};


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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
  const [category, setCategory] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<Product['status']>('Em análise');
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      CompanyService.getAll()
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
      setWeight(product.weight?.toString() || '');
      setHeight(product.height?.toString() || '');
      setWidth(product.width?.toString() || '');
      setLength(product.length?.toString() || '');
    }
  }, [product, companies]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await ProductService.update(product.id, {
        name,
        category,
        brand: companies.find(c => c.id === companyId)?.name || product.company,
        marketValue: parseFloat(price) || 0,
        condition: 'Novo',
        status: status === 'Em análise' ? 'RECEIVED' : status,
        weight: parseFloat(weight) || null,
        height: parseFloat(height) || null,
        width: parseFloat(width) || null,
        length: parseFloat(length) || null,
      } as any);

      onSave({
        ...product,
        name,
        category,
        company: companies.find(c => c.id === companyId)?.name || product.company,
        price: parseFloat(price) || 0,
        status
      });
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-[#1A202C] z-10 w-full">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Produto</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
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

          {(parseFloat(price) > 0) && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">price_check</span>
                Sugestão de Venda
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm text-center" title="50% do valor base">
                  <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Mínimo (50%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    R$ {(parseFloat(price) * 0.5).toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm text-center">
                  <span className="block text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 font-bold">Máximo (100%)</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300 text-lg">
                    R$ {(parseFloat(price) * 1.0).toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                  <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Valor Base</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    R$ {parseFloat(price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Dimensões e Peso (Opcional)</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Peso (kg)</label>
                <input type="number" step="0.001" value={weight} onChange={e => setWeight(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="0.500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Altura (cm)</label>
                <input type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="10.0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Largura (cm)</label>
                <input type="number" step="0.1" value={width} onChange={e => setWidth(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="20.0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Comprimento (cm)</label>
                <input type="number" step="0.1" value={length} onChange={e => setLength(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="30.0" />
              </div>
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
// Company Details Modal
const CompanyDetailsModal = ({ isOpen, onClose, company, onEdit, onDelete }: {
  isOpen: boolean;
  onClose: () => void;
  company: any | null;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes da Empresa</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Company Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">business</span>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{company.name}</h4>
              <p className="text-sm text-gray-500">{company.country || 'País não informado'}</p>
            </div>
          </div>

          {/* Company Information Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nome do Contato</label>
              <p className="text-gray-900 dark:text-white font-medium">{company.contactName || 'Não informado'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
              <p className="text-gray-900 dark:text-white font-medium">{company.email || 'Não informado'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Telefone</label>
              <p className="text-gray-900 dark:text-white font-medium">{company.phone || 'Não informado'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">País de Origem</label>
              <p className="text-gray-900 dark:text-white font-medium">{company.country || 'Não informado'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">URL do Site</label>
              <p className="text-gray-900 dark:text-white font-medium">{company.website || 'Não informado'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Status da Parceria</label>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${company.partnershipStatus === 'Aceita' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                company.partnershipStatus === 'Iniciada' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  company.partnershipStatus === 'Finalizada' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                    company.partnershipStatus === 'Rejeitada' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                } `}>
                {company.partnershipStatus || 'Solicitada'}
              </span>
            </div>
          </div>

          {/* Contact Method */}
          {company.contactMethod && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Forma de Contato</label>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-900 dark:text-white">
                  {company.contactMethod}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{company.contactValue}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-6 flex gap-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg bg-primary font-bold text-white hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Editar Empresa
            </button>
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg border-2 border-red-500 font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              Excluir
            </button>
          </div>
        </div>
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

const AVAILABLE_COLORS = [
  { value: '', label: 'Nenhuma' },
  { value: 'Preto', label: 'Preto' },
  { value: 'Branco', label: 'Branco' },
  { value: 'Cinza', label: 'Cinza' },
  { value: 'Vermelho', label: 'Vermelho' },
  { value: 'Azul', label: 'Azul' },
  { value: 'Verde', label: 'Verde' },
  { value: 'Amarelo', label: 'Amarelo' },
  { value: 'Laranja', label: 'Laranja' },
  { value: 'Rosa', label: 'Rosa' },
  { value: 'Roxo', label: 'Roxo' },
  { value: 'Marrom', label: 'Marrom' },
  { value: 'Bege', label: 'Bege' },
  { value: 'Dourado', label: 'Dourado' },
  { value: 'Prateado', label: 'Prateado' },
];

const NewProductModal = ({ isOpen, onClose, onSave, editingProduct }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingProduct?: any;
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<string>('RECEIVED');
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);

  // New fields
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');

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

  // Load editing data
  React.useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setCategory(editingProduct.category || PRODUCT_CATEGORIES[0]);
      setCompanyId(editingProduct.companyId || '');

      // Calculate base price from marketValue and shippingCost
      const marketValue = parseFloat(editingProduct.marketValue) || 0;
      const shipping = parseFloat(editingProduct.shippingCost) || 0;
      const basePrice = marketValue - shipping;

      setPrice(basePrice > 0 ? basePrice.toString() : marketValue.toString());
      setShippingCost(shipping > 0 ? shipping.toString() : '');
      setDate(editingProduct.createdAt ? new Date(editingProduct.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      // Ensure we use the valid status key, fallback to RECEIVED
      setStatus(STATUS_MAP[editingProduct.status] ? editingProduct.status : 'RECEIVED');
      setPrimaryColor(editingProduct.primaryColor || '');
      setSecondaryColor(editingProduct.secondaryColor || '');
      setWeight(editingProduct.weight?.toString() || '');
      setHeight(editingProduct.height?.toString() || '');
      setWidth(editingProduct.width?.toString() || '');
      setLength(editingProduct.length?.toString() || '');
    } else {
      // Reset form for new product
      setName('');
      setCategory('');
      setCompanyId('');
      setPrice('');
      setDate(new Date().toISOString().split('T')[0]);
      setStatus('RECEIVED');
      setPrimaryColor('');
      setSecondaryColor('');
      setShippingCost('');
      setWeight('');
      setHeight('');
      setWidth('');
      setLength('');
      setIsImported(false);
      setIsImported(false);
      setPriceUSD('');
      setShippingUSD('');
    }
  }, [editingProduct, isOpen]);

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

  const resetForm = () => {
    setName('');
    setCategory('');
    setCompanyId('');
    setPrice('');
    setDate(new Date().toISOString().split('T')[0]);
    setStatus('RECEIVED');
    setPrimaryColor('');
    setSecondaryColor('');
    setShippingCost('');
    setWeight('');
    setHeight('');
    setWidth('');
    setLength('');
    setIsImported(false);
    setPriceUSD('');
    setShippingUSD('');
    setCalculationResult(null);
  };

  // Fetch companies when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLoadingCompanies(true);
      CompanyService.getAll()
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
      const basePrice = parseFloat(price) || 0;
      const shipping = parseFloat(shippingCost) || 0;
      const totalPrice = basePrice + shipping;

      const productData = {
        name,
        category,
        brand: companies.find(c => c.id === companyId)?.name || '',
        marketValue: totalPrice,
        primaryColor: primaryColor || null,
        secondaryColor: secondaryColor || null,
        shippingCost: shipping || null,
        condition: 'Novo',
        status,
        companyId: companyId,
        weight: parseFloat(weight) || null,
        height: parseFloat(height) || null,
        width: parseFloat(width) || null,
        length: parseFloat(length) || null
      };

      if (editingProduct) {
        await ProductService.update(editingProduct.id, productData as any);
      } else {
        await ProductService.create(productData as any);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert(`Erro ao ${editingProduct ? 'atualizar' : 'criar'} produto`);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto transform transition-all scale-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-[#1A202C] z-10 w-full">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
          <button type="button" onClick={() => { if (!editingProduct) resetForm(); onClose(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
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
                <option value="" disabled>Selecione uma categoria</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preço Base (R$)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400" placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Frete (R$) <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="number"
                value={shippingCost}
                onChange={e => setShippingCost(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preço Total</label>
              <div className="w-full h-11 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center text-gray-900 dark:text-white font-bold">
                R$ {((parseFloat(price) || 0) + (parseFloat(shippingCost) || 0)).toFixed(2)}
              </div>
            </div>
          </div>

          {(parseFloat(price) > 0) && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">price_check</span>
                Sugestão de Venda
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm text-center" title="50% do valor base">
                  <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Mínimo (50%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    R$ {(parseFloat(price) * 0.5).toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm text-center">
                  <span className="block text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 font-bold">Máximo (100%)</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300 text-lg">
                    R$ {(parseFloat(price) * 1.0).toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                  <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Valor Base</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    R$ {parseFloat(price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Cor Primária <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <select
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
              >
                {AVAILABLE_COLORS.map(color => (
                  <option key={color.value} value={color.value}>{color.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Cor Secundária <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <select
                value={secondaryColor}
                onChange={e => setSecondaryColor(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
              >
                {AVAILABLE_COLORS.map(color => (
                  <option key={color.value} value={color.value}>{color.label}</option>
                ))}
              </select>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Data de Registro</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Dimensões e Peso</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Peso (kg)</label>
                <select
                  required
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                >
                  <option value="" disabled>Selecione o peso</option>
                  {/* Grams 100g - 900g */}
                  {Array.from({ length: 9 }, (_, i) => {
                    const val = (i + 1) / 10;
                    const label = val.toFixed(3).replace('.', ',');
                    return <option key={val} value={val}>{label}</option>;
                  })}
                  {/* Kilos 1kg - 30kg */}
                  {Array.from({ length: 30 }, (_, i) => {
                    const val = i + 1;
                    const label = val.toFixed(3).replace('.', ',');
                    return <option key={val} value={val}>{label}</option>;
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Altura (cm)</label>
                <input required type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="10.0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Largura (cm)</label>
                <input required type="number" step="0.1" value={width} onChange={e => setWidth(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="20.0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Comprimento (cm)</label>
                <input required type="number" step="0.1" value={length} onChange={e => setLength(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="30.0" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status Inicial</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white">
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => { if (!editingProduct) resetForm(); onClose(); }} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 h-11 rounded-lg bg-primary font-bold text-white hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">Salvar Produto</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Product Details Modal
const ProductDetailsModal = ({ isOpen, onClose, product, onEdit, onDelete, onStatusChange }: {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: string) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  React.useEffect(() => {
    if (product) {
      setSelectedStatus(product.status || 'RECEIVED');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleStatusChange = async (newStatus: string) => {
    setSelectedStatus(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes do Produto</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="h-20 w-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-gray-400">inventory_2</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{product.name}</h4>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Preço</p>
              <p className="text-2xl font-bold text-primary">
                {product.price ? `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Quick Status Change */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🚀 Alterar Status Rápido
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full h-11 px-4 rounded-lg bg-white dark:bg-gray-900 border border-blue-300 dark:border-blue-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Product Information Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Empresa</label>
              <p className="text-gray-900 dark:text-white font-medium">{product.company || 'Não informado'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Categoria</label>
              <p className="text-gray-900 dark:text-white font-medium">{product.category}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Data de Registro</label>
              <p className="text-gray-900 dark:text-white font-medium">{product.receiveDate}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Status Atual</label>
              {(() => {
                const statusInfo = STATUS_MAP[selectedStatus] || STATUS_MAP['RECEIVED'];
                return (
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Colors and Shipping (if available) */}
          {(product.primaryColor || product.secondaryColor || product.shippingCost) && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-3">Informações Adicionais</label>
              <div className="grid grid-cols-3 gap-4">
                {product.primaryColor && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Cor Primária</label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: COLOR_MAP[product.primaryColor] || product.primaryColor.toLowerCase() }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{product.primaryColor}</span>
                    </div>
                  </div>
                )}
                {product.secondaryColor && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Cor Secundária</label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: COLOR_MAP[product.secondaryColor] || product.secondaryColor.toLowerCase() }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{product.secondaryColor}</span>
                    </div>
                  </div>
                )}
                {product.shippingCost && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Custo de Frete</label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      R$ {parseFloat(product.shippingCost).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-6 flex gap-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg bg-primary font-bold text-white hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Editar Produto
            </button>
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg border-2 border-red-500 font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [viewingProduct, setViewingProduct] = useState<any | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const fetchProducts = async () => {
    try {
      const data = await ProductService.getAll();
      const mapped = data.map((p: any) => ({
        ...p,
        company: p.brand,
        receiveDate: new Date(p.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: p.status,
        price: p.marketValue,
        image: CATEGORY_IMAGES[p.category] || p.image || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&q=80'
      }));
      setProducts(mapped);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      // Ensure products is array
      setProducts([]);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const confirmDelete = async () => {
    if (!deletingProductId) return;
    try {
      await ProductService.delete(deletingProductId);
      fetchProducts();
      setViewingProduct(null);
    } catch (error) {
      console.error('Erro:', error);
    }
    setDeletingProductId(null);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setViewingProduct(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    fetchProducts();
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const response = await fetch(`/ api / products / ${productId} `, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          status: newStatus
        })
      });

      if (response.ok) {
        fetchProducts();
        if (viewingProduct && viewingProduct.id === productId) {
          setViewingProduct({ ...viewingProduct, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
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

      <ProductDetailsModal
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
        product={viewingProduct}
        onEdit={() => handleEdit(viewingProduct)}
        onDelete={() => {
          setDeletingProductId(viewingProduct?.id);
          setViewingProduct(null);
        }}
        onStatusChange={(newStatus) => handleStatusChange(viewingProduct?.id, newStatus)}
      />

      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        editingProduct={editingProduct}
      />
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Produtos</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
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
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                <th className="px-6 py-4 text-center">Sugestão (50% - 100%)</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4">Data de Registro</th>
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
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                    onClick={() => setViewingProduct(product)}
                  >
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
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          R$ {(parseFloat(product.price) * 0.5).toFixed(2)} - R$ {(parseFloat(product.price) * 1.0).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary">
                        {product.price ? `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{product.receiveDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        // Adaptação: caso statusOptions já esteja em formato correto de StatusOption[]
                        return (
                          <StatusBadge
                            status={product.status}
                            options={STATUS_OPTIONS}
                            onUpdate={(newStatus) => handleStatusChange(product.id, newStatus)}
                          />
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(product);
                          }}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingProductId(product.id);
                          }}
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

const NewCompanyModal = ({ isOpen, onClose, onSave, editingCompany }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingCompany?: any;
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [partnershipStatus, setPartnershipStatus] = useState('Solicitada');
  const [contactMethod, setContactMethod] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);


  // Load editing data
  React.useEffect(() => {
    if (editingCompany) {
      setName(editingCompany.name || '');
      setContact(editingCompany.contactName || '');
      setEmail(editingCompany.email || '');
      setPhone(editingCompany.phone || '');
      setCountry(editingCompany.country || '');
      setWebsite(editingCompany.website || '');
      setPartnershipStatus(editingCompany.partnershipStatus || 'Solicitada');
      setContactMethod(editingCompany.contactMethod || '');
      setContactValue(editingCompany.contactValue || '');
    } else {
      // Reset form for new company
      setName('');
      setContact('');
      setEmail('');
      setPhone('');
      setCountry('');
      setWebsite('');
      setPartnershipStatus('Solicitada');
      setContactMethod('');
      setContactValue('');
      setPhoneError('');
    }
  }, [editingCompany, isOpen]);

  const resetForm = () => {
    setName('');
    setContact('');
    setEmail('');
    setPhone('');
    setCountry('');
    setWebsite('');
    setPartnershipStatus('Solicitada');
    setContactMethod('');
    setContactValue('');
    setPhoneError('');
    setLogoFile(null);
    setLogoPreview(null);
    setIsCompressing(false);
  };

  if (!isOpen) return null;

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (value && !validatePhone(value)) {
      setPhoneError('Formato inválido. Use: +[DDI] ([DDD]) [Número]. Ex: +55 (11) 98765-4321');
    } else {
      setPhoneError('');
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (10MB)
    const validation = validateImage(file, 10 * 1024 * 1024);
    if (!validation.valid) {
      alert(validation.error);
      e.target.value = '';
      return;
    }

    setIsCompressing(true);
    try {
      // Comprimir imagem
      const compressedFile = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
        outputFormat: 'webp'
      });

      console.log(`Imagem otimizada: ${(file.size / 1024).toFixed(0)} KB -> ${(compressedFile.size / 1024).toFixed(0)} KB`);

      setLogoFile(compressedFile);

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar imagem. Tente outra.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone && !validatePhone(phone)) {
      setPhoneError('Formato de telefone inválido');
      return;
    }

    try {
      const companyData = {
        name,
        contactName: contact,
        email,
        phone,
        country,
        website,
        contactMethod,
        contactValue,
        partnershipStatus
      };

      if (editingCompany) {
        await CompanyService.update(editingCompany.id, companyData, logoFile || undefined);
      } else {
        await CompanyService.create(companyData, logoFile || undefined);
      }

      onSave();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : (typeof error === 'object' && error !== null
          ? JSON.stringify(error)
          : 'Erro desconhecido');

      alert(`Erro ao salvar empresa: ${errorMessage} `);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A202C] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col transform transition-all scale-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 flex-none bg-white dark:bg-[#1A202C] z-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{editingCompany ? 'Editar Empresa' : 'Nova Empresa'}</h3>
          <button onClick={() => { if (!editingCompany) resetForm(); onClose(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Content matches previous logic */}
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
                Forma de Contato <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <select
                value={contactMethod}
                onChange={(e) => {
                  setContactMethod(e.target.value);
                  setContactValue('');
                }}
                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
              >
                <option value="">Selecione uma forma de contato</option>
                <option value="Email">Email</option>
                <option value="Site">Diretamente do Site</option>
                <option value="Forms">Forms</option>
              </select>
            </div>

            {/* Campo condicional baseado na forma de contato */}
            {contactMethod === 'Email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email de Contato
                </label>
                <input
                  type="email"
                  value={contactValue}
                  onChange={e => setContactValue(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="contato@empresa.com"
                />
              </div>
            )}

            {contactMethod === 'Site' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  URL do Site de Contato
                </label>
                <input
                  type="url"
                  value={contactValue}
                  onChange={e => setContactValue(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="https://www.empresa.com/contato"
                />
              </div>
            )}

            {contactMethod === 'Forms' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Link do Formulário
                </label>
                <input
                  type="url"
                  value={contactValue}
                  onChange={e => setContactValue(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="https://forms.google.com/..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" placeholder="contato@empresa.com" />
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                URL do Site <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                placeholder="https://www.exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Logo da Empresa <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={isCompressing}
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary/10 file:text-primary
                  hover:file:bg-primary/20
                  dark:file:bg-primary/20 dark:file:text-primary
                "
                />

                {isCompressing && (
                  <div className="flex items-center gap-2 text-sm text-blue-500">
                    <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                    Otimizando imagem...
                  </div>
                )}

                {logoPreview && (
                  <div className="relative inline-block group">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-20 w-20 object-contain rounded-lg border border-gray-200 dark:border-gray-700 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                      title="Remover logo"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <p className="text-xs text-green-600 mt-1">✓ Imagem pronta</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Status da Parceria
              </label>
              <select
                value={partnershipStatus}
                onChange={e => setPartnershipStatus(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
              >
                <option value="Solicitada">Solicitada</option>
                <option value="Aceita">Aceita</option>
                <option value="Iniciada">Iniciada</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Rejeitada">Rejeitada</option>
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => { if (!editingCompany) resetForm(); onClose(); }} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
              <button type="submit" disabled={!!phoneError} className="flex-1 h-11 rounded-lg bg-primary font-bold text-white hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">Salvar Empresa</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


// Status constants for Companies
const COMPANY_STATUS_OPTIONS: StatusOption[] = [
  { value: 'Solicitada', label: 'Solicitada', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { value: 'Aceita', label: 'Aceita', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  { value: 'Iniciada', label: 'Iniciada', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'Finalizada', label: 'Finalizada', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { value: 'Rejeitada', label: 'Rejeitada', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
];

// CompanyStatusBadge removed in favor of generic StatusBadge component

export function Companies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [viewingCompany, setViewingCompany] = useState<any | null>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      const data = await CompanyService.getAll();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (err) {
      console.error('Erro ao buscar empresas:', err);
      setCompanies([]);
      setFilteredCompanies([]);
    }
  };

  React.useEffect(() => {
    fetchCompanies();
  }, []);

  // Search filter
  React.useEffect(() => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company =>
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.country?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  const confirmDelete = async () => {
    if (!deletingCompanyId) return;

    try {
      await CompanyService.delete(deletingCompanyId);
      // Success
      fetchCompanies();
      setViewingCompany(null);
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      alert('Erro ao excluir empresa');
    }
    setDeletingCompanyId(null);
  };

  const handleEdit = (company: any) => {
    setEditingCompany(company);
    setViewingCompany(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    fetchCompanies();
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const handleStatusUpdate = async (companyId: string, newStatus: string) => {
    try {
      // Optimistic update
      const updatedCompanies = companies.map(c =>
        c.id === companyId ? { ...c, partnershipStatus: newStatus } : c
      );
      setCompanies(updatedCompanies);
      setFilteredCompanies(prev => prev.map(c =>
        c.id === companyId ? { ...c, partnershipStatus: newStatus } : c
      ));

      await CompanyService.update(companyId, { partnershipStatus: newStatus });
    } catch (error) {
      console.error('Failed to update status', error);
      // Revert on failure
      fetchCompanies();
      alert('Erro ao atualizar status');
    }
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

      <CompanyDetailsModal
        isOpen={!!viewingCompany}
        onClose={() => setViewingCompany(null)}
        company={viewingCompany}
        onEdit={() => handleEdit(viewingCompany)}
        onDelete={() => {
          setDeletingCompanyId(viewingCompany?.id);
          setViewingCompany(null);
        }}
      />

      <NewCompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCompany(null);
        }}
        onSave={handleSave}
        editingCompany={editingCompany}
      />

      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Empresas</h1>
        <button
          onClick={() => {
            setEditingCompany(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg font-bold transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Adicionar Empresa
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        <input
          type="text"
          placeholder="Pesquisar empresas por nome, contato, email ou país..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">País</th>
                <th className="px-6 py-4">Status da Parceria</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
                  </td>
                </tr>
              ) : (
                filteredCompanies.map(company => (
                  <tr
                    key={company.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
                    onClick={() => setViewingCompany(company)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">business</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{company.contactName || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{company.country || '-'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={company.partnershipStatus}
                        options={COMPANY_STATUS_OPTIONS}
                        onUpdate={(newStatus) => handleStatusUpdate(company.id, newStatus)}
                      />
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(company);
                          }}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingCompanyId(company.id);
                          }}
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

// ==================== SALES COMPONENT ====================

const CONTACT_CHANNELS = [
  'WhatsApp',
  'Discord',
  'Instagram Direct',
  'TikTok',
  'Facebook Messenger'
];

const SALE_STATUSES = [
  'PENDING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

// New Sale Modal
const NewSaleModal = ({ isOpen, onClose, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customerName, setCustomerName] = useState('');
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
      // Fetch products
      fetch('http://localhost:3001/api/products')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error('Erro ao buscar produtos:', err));
    }
  }, [isOpen]);

  React.useEffect(() => {
    // Auto-fill price when product is selected
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      if (product && product.marketValue) {
        setSalePrice(product.marketValue.toString());
      }
    }
  }, [selectedProductId, products]);

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
    setCep(value);
    if (value.replace(/\D/g, '').length === 8) {
      fetchAddressByCEP(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId || !customerName || !contactValue) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      await SaleService.create({
        productId: selectedProductId,
        customerName,
        contactChannel,
        contactValue,
        cep: cep || null,
        street: street || null,
        number: number || null,
        complement: complement || null,
        neighborhood: neighborhood || null,
        city: city || null,
        state: state || null,
        salePrice: parseFloat(salePrice)
        // userId handled in service
      });

      onSave();
      // Reset form
      setSelectedProductId('');
      setCustomerName('');
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
      onClose();
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
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
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
              <p className="mt-1 text-sm text-gray-500">
                {selectedProduct.brand} | {selectedProduct.category}
              </p>
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
                onChange={(e) => setContactValue(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                placeholder={
                  contactChannel === 'WhatsApp' ? '+55 (11) 98765-4321' :
                    contactChannel === 'Discord' ? 'usuario#1234' :
                      '@usuario'
                }
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Endereço de Envio (Opcional)</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">CEP</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rua</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Número</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bairro</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cidade</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Estado</label>
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
            <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 h-11 rounded-lg bg-primary font-bold text-white hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all">
              Registrar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
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
              <p className="text-gray-900 dark:text-white font-medium">{sale.contactValue}</p>
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
export function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingSale, setViewingSale] = useState<any | null>(null);
  const [deletingSaleId, setDeletingSaleId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSales = () => {
    fetch(`http://localhost:3001/api/sales${searchTerm ? `?search=${searchTerm}` : ''}`)
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
      const response = await fetch(`http://localhost:3001/api/sales/${deletingSaleId}`, { method: 'DELETE' });
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
