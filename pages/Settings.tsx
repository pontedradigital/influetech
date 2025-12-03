
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const loc = useLocation();
  const tabs = [
    { name: 'Perfil', path: '' },
    { name: 'Notificações', path: 'notificacoes' },
    { name: 'Segurança', path: 'seguranca' }
  ];

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
      {tabs.map(t => {
        const isActive = loc.pathname.endsWith(t.path) || (t.path === '' && loc.pathname.endsWith('configuracoes'));
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

const Profile = () => (
  <div className="space-y-8 max-w-4xl">
    {/* Informações Básicas */}
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Informações Básicas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo *</span>
          <input type="text" defaultValue="Ana Oliveira" className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail *</span>
          <div className="relative">
            <input type="email" defaultValue="ana.oliveira@email.com" disabled className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 h-12 px-4 text-gray-500" />
            <span className="material-symbols-outlined absolute right-3 top-3.5 text-gray-400 text-lg">lock</span>
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</span>
          <input type="tel" defaultValue="(11) 99999-9999" className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Localização</span>
          <input type="text" placeholder="São Paulo, Brasil" className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CEP</span>
          <input
            type="text"
            placeholder="00000-000"
            maxLength={9}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50"
          />
          <p className="text-xs text-gray-500 mt-1">Usado para cálculo de frete nos envios</p>
        </label>
      </div>
    </div>

    {/* Redes Sociais */}
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Redes Sociais *</h3>
      <p className="text-sm text-gray-500 mb-6">Conecte suas redes sociais para gerenciar parcerias e divulgações</p>
      <div className="space-y-4">
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 flex items-center border-r border-gray-300 dark:border-gray-700 text-gray-500 min-w-[160px]">
            <span className="material-symbols-outlined mr-2 text-pink-500">photo_camera</span>
            instagram.com/
          </div>
          <input type="text" className="flex-1 h-12 px-4 bg-white dark:bg-gray-800 border-none focus:ring-0" placeholder="usuario" />
        </div>
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 flex items-center border-r border-gray-300 dark:border-gray-700 text-gray-500 min-w-[160px]">
            <span className="material-symbols-outlined mr-2">music_note</span>
            tiktok.com/@
          </div>
          <input type="text" className="flex-1 h-12 px-4 bg-white dark:bg-gray-800 border-none focus:ring-0" placeholder="usuario" />
        </div>
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 flex items-center border-r border-gray-300 dark:border-gray-700 text-gray-500 min-w-[160px]">
            <span className="material-symbols-outlined mr-2 text-red-500">play_circle</span>
            youtube.com/@
          </div>
          <input type="text" className="flex-1 h-12 px-4 bg-white dark:bg-gray-800 border-none focus:ring-0" placeholder="canal" />
        </div>
      </div>
    </div>

    {/* Informações do Influenciador */}
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Perfil de Influenciador</h3>
      <p className="text-sm text-gray-500 mb-6">Informações sobre seu conteúdo e audiência</p>

      <div className="space-y-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nicho de Conteúdo *</span>
          <select className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50">
            <option value="">Selecione seu nicho principal</option>
            <option>Hardware e Componentes</option>
            <option>Periféricos (Mouse, Teclado, Headset)</option>
            <option>Setup Gamer</option>
            <option>Notebooks e Laptops</option>
            <option>Gadgets e Tecnologia</option>
            <option>Reviews de Produtos</option>
            <option>Unboxing</option>
            <option>Tech em Geral</option>
          </select>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total de Seguidores/Inscritos</span>
            <input type="number" placeholder="Ex: 50000" className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Taxa de Engajamento Média (%)</span>
            <input type="number" step="0.1" placeholder="Ex: 5.2" className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50" />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipos de Conteúdo que Produz</span>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Reviews', 'Unboxing', 'Tutoriais', 'Comparativos', 'Lives', 'Shorts/Reels'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
              </label>
            ))}
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio / Descrição</span>
          <textarea
            rows={4}
            placeholder="Conte um pouco sobre você e seu conteúdo..."
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-primary/50"
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
            {['Hardware', 'Periféricos', 'Notebooks', 'Monitores', 'Áudio', 'Cadeiras Gamer', 'Iluminação RGB', 'Webcams'].map(cat => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
              </label>
            ))}
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Parceria Preferida</span>
          <select className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50">
            <option>Produto para Review</option>
            <option>Parceria Paga</option>
            <option>Afiliação</option>
            <option>Todas as opções</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor Mínimo para Parcerias Pagas (R$)</span>
          <input type="number" placeholder="Ex: 500" className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50" />
        </label>
      </div>
    </div>

    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
      <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all">Salvar Alterações</button>
    </div>
  </div>
);

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

const Security = () => (
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
  </div>
);

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
      </Routes>
    </div>
  );
}
