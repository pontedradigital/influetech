
import React, { useState, useEffect } from 'react';
import { calculatePartnershipViability } from '../utils/partnershipCalculations';
import SuccessModal from '../components/SuccessModal';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CancelSubscriptionModal from '../components/CancelSubscriptionModal';
import { useInfluencer, SocialNetwork } from '../context/InfluencerContext';

const Nav = () => {
  const loc = useLocation();
  const tabs = [
    { name: 'Perfil', path: '/configuracoes' },
    { name: 'Notificações', path: '/configuracoes/notificacoes' },
    { name: 'Segurança', path: '/configuracoes/seguranca' },
    { name: 'Calculadora de Importação', path: '/configuracoes/importacao' }
  ];

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
      {tabs.map(t => {
        const isActive = loc.pathname === t.path;
        return (
          <Link
            key={t.name}
            to={t.path}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${isActive ? 'border-primary text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.name}
          </Link>
        )
      })}
    </div>
  );
};



// Helper for Social Icons
const getSocialIcon = (platform: string) => {
  const iconClass = "w-6 h-6";
  switch (platform) {
    case 'Instagram':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="url(#instagramGradient)" />
          <defs>
            <linearGradient id="instagramGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#833AB4" />
              <stop offset="0.5" stopColor="#FD1D1D" />
              <stop offset="1" stopColor="#FCB045" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'TikTok':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      );
    case 'YouTube':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'Twitter':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#1DA1F2" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      );
    case 'Twitch':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#9146FF" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
        </svg>
      );
    case 'LinkedIn':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return <span className="material-symbols-outlined text-gray-400">public</span>;
  }
};

// ... (Nav component remains the same)

const Profile = () => {
  const { data, updateProfile, updateSocials, updatePartnerships, totalFollowers } = useInfluencer();
  const [newSocialPlatform, setNewSocialPlatform] = useState<SocialNetwork['platform']>('Instagram');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [viabilityStatus, setViabilityStatus] = useState<{ isViable: boolean; message: string } | null>(null);

  // AI Value Warning Effect
  useEffect(() => {
    if (data.partnerships.productValueSuggestion > 0) {
      const result = calculatePartnershipViability(
        totalFollowers,
        data.profile.engagementRate,
        data.partnerships.productValueSuggestion,
        data.partnerships.currency
      );
      setViabilityStatus(result.isViable ? null : { isViable: false, message: result.message });
    } else {
      setViabilityStatus(null);
    }
  }, [data.partnerships.productValueSuggestion, data.partnerships.currency, totalFollowers, data.profile.engagementRate]);

  const handleSocialAdd = () => {
    const newSocial: SocialNetwork = {
      id: Date.now().toString(),
      platform: newSocialPlatform,
      handle: '',
      followers: 0,
      url: ''
    };
    updateSocials([...data.socials, newSocial]);
  };

  const handleSocialRemove = (id: string) => {
    updateSocials(data.socials.filter(s => s.id !== id));
  };

  const handleSocialChange = (id: string, field: keyof SocialNetwork, value: any) => {
    updateSocials(data.socials.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Informações Básicas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo *</span>
            <input
              type="text"
              value={data.profile.name}
              onChange={e => updateProfile({ name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail *</span>
            <div className="relative">
              <input
                type="email"
                value={data.profile.email}
                disabled
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 h-12 px-4 text-gray-500"
              />
              <span className="material-symbols-outlined absolute right-3 top-3.5 text-gray-400 text-lg">lock</span>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</span>
            <input
              type="tel"
              value={data.profile.phone}
              onChange={e => updateProfile({ phone: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Localização</span>
            <input
              type="text"
              value={data.profile.location}
              onChange={e => updateProfile({ location: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CEP</span>
            <input
              type="text"
              value={data.profile.cep}
              onChange={e => updateProfile({ cep: e.target.value })}
              placeholder="00000-000"
              maxLength={9}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-gray-500 mt-1">Usado para cálculo de frete nos envios</p>
          </label>
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Redes Sociais</h3>
            <p className="text-sm text-gray-500">Gerencie suas redes e métricas. Total de seguidores: <strong className="text-primary">{totalFollowers.toLocaleString()}</strong></p>
          </div>
          <div className="flex gap-2">
            <select
              value={newSocialPlatform}
              onChange={(e) => setNewSocialPlatform(e.target.value as any)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm h-10"
            >
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Twitter">Twitter</option>
              <option value="Twitch">Twitch</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Other">Outro</option>
            </select>
            <button
              onClick={handleSocialAdd}
              className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-primary-600 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Adicionar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {data.socials.map((social) => (
            <div key={social.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center gap-3 min-w-[140px]">
                {getSocialIcon(social.platform)}
                <span className="font-bold text-gray-700 dark:text-gray-300">{social.platform}</span>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Usuário / Handle (ex: @usuario)"
                  value={social.handle}
                  onChange={(e) => handleSocialChange(social.id, 'handle', e.target.value)}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-10 px-3 text-sm"
                />
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Seguidores"
                    value={social.followers}
                    onChange={(e) => handleSocialChange(social.id, 'followers', Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-10 px-3 text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">Seguidores</span>
                </div>
                {['Instagram', 'TikTok', 'YouTube', 'Twitch'].includes(social.platform) && (
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Média de Views"
                      value={social.averageViews || ''}
                      onChange={(e) => handleSocialChange(social.id, 'averageViews', Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-10 px-3 text-sm"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400">Views/Mês</span>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="URL do Perfil (opcional)"
                  value={social.url}
                  onChange={(e) => handleSocialChange(social.id, 'url', e.target.value)}
                  className="md:col-span-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-10 px-3 text-sm"
                />
              </div>
              <button
                onClick={() => handleSocialRemove(social.id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors self-start md:self-center"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
          {data.socials.length === 0 && (
            <p className="text-center text-gray-500 py-4">Nenhuma rede social adicionada.</p>
          )}
        </div>
      </div>

      {/* Informações do Influenciador */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Perfil de Influenciador</h3>
        <p className="text-sm text-gray-500 mb-6">Informações detalhadas para seu Media Kit</p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nicho de Conteúdo *</span>
              <select
                value={data.profile.niche}
                onChange={e => updateProfile({ niche: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Selecione seu nicho principal</option>
                <option>Hardware e Componentes</option>
                <option>Periféricos (Mouse, Teclado, Headset)</option>
                <option>Setup Gamer</option>
                <option>Notebooks e Laptops</option>
                <option>Gadgets e Tecnologia</option>
                <option>Reviews de Produtos</option>
                <option>Unboxing</option>
                <option>Tech em Geral</option>
                <option>Lifestyle</option>
                <option>Games</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Taxa de Engajamento Média (%)</span>
              <input
                type="number"
                step="0.1"
                value={data.profile.engagementRate}
                onChange={e => updateProfile({ engagementRate: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Faixa Etária do Público</span>
              <input
                type="text"
                placeholder="Ex: 18-34 anos"
                value={data.profile.audienceAge}
                onChange={e => updateProfile({ audienceAge: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Distribuição de Gênero</span>
              <input
                type="text"
                placeholder="Ex: 70% Masculino, 30% Feminino"
                value={data.profile.audienceGender}
                onChange={e => updateProfile({ audienceGender: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipos de Conteúdo que Produz</span>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Reviews', 'Unboxing', 'Tutoriais', 'Comparativos', 'Lives', 'Shorts/Reels', 'Vlogs', 'Setup Tours'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.profile.contentTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateProfile({ contentTypes: [...data.profile.contentTypes, type] });
                      } else {
                        updateProfile({ contentTypes: data.profile.contentTypes.filter(t => t !== type) });
                      }
                    }}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                </label>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio / Descrição</span>
            <textarea
              rows={4}
              value={data.profile.bio}
              onChange={e => updateProfile({ bio: e.target.value })}
              placeholder="Conte um pouco sobre você e seu conteúdo..."
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary/50"
            />
          </label>
        </div>
      </div>

      {/* Preferências de Parcerias */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Preferências de Parcerias</h3>
        <p className="text-sm text-gray-500 mb-6">Configure suas preferências para receber propostas de marcas</p>

        <div className="space-y-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categorias de Produtos de Interesse</span>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Hardware', 'Periféricos', 'Notebooks', 'Monitores', 'Áudio', 'Cadeiras Gamer', 'Iluminação RGB', 'Webcams', 'Smartphones', 'Consoles'].map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.partnerships.categories.includes(cat)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updatePartnerships({ categories: [...data.partnerships.categories, cat] });
                      } else {
                        updatePartnerships({ categories: data.partnerships.categories.filter(c => c !== cat) });
                      }
                    }}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                </label>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Parceria Preferida</span>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {['Produto para Review', 'Parceria Paga', 'Afiliação', 'Embaixador da Marca'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.partnerships.preferredTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updatePartnerships({ preferredTypes: [...data.partnerships.preferredTypes, type] });
                      } else {
                        updatePartnerships({ preferredTypes: data.partnerships.preferredTypes.filter(t => t !== type) });
                      }
                    }}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                </label>
              ))}
            </div>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sugestão de Valor em Produtos</span>
              <input
                type="number"
                value={data.partnerships.productValueSuggestion}
                onChange={e => updatePartnerships({ productValueSuggestion: Number(e.target.value) })}
                className={`mt-1 block w-full rounded-lg border h-12 px-4 focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white ${viabilityStatus ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'}`}
              />
              {viabilityStatus && (
                <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-start gap-3">
                  <span className="material-symbols-outlined text-orange-500 text-xl mt-0.5">warning</span>
                  <p className="text-sm text-orange-800 dark:text-orange-200">{viabilityStatus.message}</p>
                </div>
              )}
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Moeda Preferencial</span>
              <select
                value={data.partnerships.currency}
                onChange={e => updatePartnerships({ currency: e.target.value as 'BRL' | 'USD' })}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
              >
                <option value="BRL">Real (BRL)</option>
                <option value="USD">Dólar (USD)</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all"
        >
          Salvar Alterações
        </button>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

const Notifications = () => (
  <div className="max-w-3xl space-y-8">
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notificações por E-mail</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {['Novo produto recebido', 'Recomendação de bazar da IA', 'Venda confirmada'].map((item, i) => (
          <div key={i} className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{item}</p>
              <p className="text-sm text-gray-500">Receba atualizações importantes diretamente na sua caixa de entrada.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Security = () => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  return (
    <div className="max-w-3xl space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Alterar Senha</h3>
        <div className="space-y-4">
          <input type="password" placeholder="Senha Atual" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4" />
          <input type="password" placeholder="Nova Senha" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4" />
          <input type="password" placeholder="Confirmar Nova Senha" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4" />
          <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-600">Atualizar Senha</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Autenticação de Dois Fatores (2FA)</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>
        <p className="text-gray-500 text-sm">Adicione uma camada extra de segurança à sua conta.</p>
      </div>

      {/* Área de Perigo / Cancelamento */}
      <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Zona de Perigo</h4>
            <p className="text-xs text-gray-500 mt-1">Ações irreversíveis relacionadas à sua conta.</p>
          </div>
          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium transition-colors"
          >
            Cancelar assinatura
          </button>
        </div>
      </div>

      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
};

const ImportCalculatorSettings = () => {
  const { data, updateImportSettings } = useInfluencer();
  const [loadingRate, setLoadingRate] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchDollarRate = async (isAutomatic = false) => {
    if (!isAutomatic) setLoadingRate(true);
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
      const apiData = await response.json();
      if (apiData.USDBRL && apiData.USDBRL.ask) {
        const rate = parseFloat(apiData.USDBRL.ask);
        updateImportSettings({ dollarRate: parseFloat(rate.toFixed(2)) });
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Erro ao buscar cotação:', error);
      if (!isAutomatic) {
        alert('Erro ao buscar cotação do dólar. Verifique sua conexão.');
      }
    } finally {
      if (!isAutomatic) setLoadingRate(false);
    }
  };

  // Auto-update every hour
  React.useEffect(() => {
    // Fetch on mount
    fetchDollarRate(true);

    // Set up interval for hourly updates
    const interval = setInterval(() => {
      fetchDollarRate(true);
    }, 60 * 60 * 1000); // 1 hour in milliseconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Configurações de Importação</h3>
        <p className="text-sm text-gray-500 mb-6">Defina as taxas e cotações para o cálculo automático de produtos importados.</p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cotação do Dólar (R$)</span>
              <div className="relative mt-1 flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-3 text-gray-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={data.importSettings.dollarRate}
                    onChange={e => updateImportSettings({ dollarRate: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 pl-10 pr-4 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <button
                  onClick={fetchDollarRate}
                  disabled={loadingRate}
                  className="px-4 h-12 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  title="Atualizar com cotação atual"
                >
                  <span className={`material-symbols-outlined ${loadingRate ? 'animate-spin' : ''}`}>
                    {loadingRate ? 'refresh' : 'currency_exchange'}
                  </span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Atualização automática a cada 1 hora. {lastUpdate && `Última atualização: ${lastUpdate.toLocaleTimeString('pt-BR')}`}
              </p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ICMS Padrão (%)</span>
              <div className="relative mt-1">
                <input
                  type="number"
                  step="0.1"
                  value={data.importSettings.icmsRate}
                  onChange={e => updateImportSettings({ icmsRate: Number(e.target.value) })}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
                />
                <span className="absolute right-3 top-3 text-gray-500">%</span>
              </div>
            </label>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 mt-0.5">info</span>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Atenção ao ICMS:</strong> O valor de 17% é uma média nacional, mas cada estado brasileiro possui sua própria alíquota de ICMS. Recomendamos que cada usuário verifique a alíquota do seu estado para manter a calculadora precisa.
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Taxas de Importação (Remessa Conforme)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Abaixo de US$ 50,00</span>
                <div className="relative mt-1">
                  <input
                    type="number"
                    step="0.1"
                    value={data.importSettings.taxRateUnder50}
                    onChange={e => updateImportSettings({ taxRateUnder50: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Padrão: 20%</p>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Acima de US$ 50,00</span>
                <div className="relative mt-1">
                  <input
                    type="number"
                    step="0.1"
                    value={data.importSettings.taxRateOver50}
                    onChange={e => updateImportSettings({ taxRateOver50: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Padrão: 60%</p>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Configurações</h1>
      <p className="text-gray-500 mb-8">Gerencie seu perfil e preferências.</p>

      <Nav />

      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/notificacoes" element={<Notifications />} />
        <Route path="/seguranca" element={<Security />} />
        <Route path="/importacao" element={<ImportCalculatorSettings />} />
      </Routes>
    </div>
  );
}
