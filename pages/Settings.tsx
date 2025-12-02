
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
    <div className="flex items-center gap-6 pb-8 border-b border-gray-200 dark:border-gray-700">
      <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Foto de Perfil</h3>
        <p className="text-sm text-gray-500 mb-3">JPG ou PNG, max 2MB</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-bold rounded-lg hover:bg-gray-200">Alterar Foto</button>
          <button className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg">Remover</button>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <label className="block">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</span>
        <input type="text" defaultValue="Ana Oliveira" className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</span>
        <div className="relative">
          <input type="email" defaultValue="ana.oliveira@email.com" disabled className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 h-12 px-4 text-gray-500" />
          <span className="material-symbols-outlined absolute right-3 top-3.5 text-gray-400 text-lg">lock</span>
        </div>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</span>
        <input type="tel" defaultValue="(11) 99999-9999" className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/50" />
      </label>
    </div>

    <div className="pt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Redes Sociais</h3>
      <div className="space-y-4">
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 flex items-center border-r border-gray-300 dark:border-gray-700 text-gray-500">instagram.com/</div>
          <input type="text" className="flex-1 h-12 px-4 bg-white dark:bg-gray-800 border-none focus:ring-0" placeholder="usuario" />
        </div>
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 flex items-center border-r border-gray-300 dark:border-gray-700 text-gray-500">tiktok.com/@</div>
          <input type="text" className="flex-1 h-12 px-4 bg-white dark:bg-gray-800 border-none focus:ring-0" placeholder="usuario" />
        </div>
      </div>
    </div>

    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
      <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-600">Salvar Alterações</button>
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
