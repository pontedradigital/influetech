import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/General';
import { Companies } from './pages/General';
import { Agenda } from './pages/General';
import Bazar from './pages/Bazar';
import Finance from './pages/Finance';
import Logistics from './pages/Logistics';
import Settings from './pages/Settings';
import ProductPlanner from './pages/ProductPlanner';
import Auth from './pages/Auth';
import Sales from './pages/Sales';

const SidebarItem: React.FC<{ to: string; icon: string; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active
      ? 'bg-primary/10 text-primary'
      : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
      }`}
  >
    <span className={`material-symbols-outlined text-lg ${active ? 'fill' : ''}`}>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode (Basic implementation)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // ...

  const navItems = [
    { to: '/', icon: 'dashboard', label: 'Dashboard' },
    { to: '/configuracoes', icon: 'settings', label: 'Configurações' },
    { to: '/empresas', icon: 'domain', label: 'Empresas' },
    { to: '/produtos', icon: 'package_2', label: 'Produtos' },
    { to: '/agenda', icon: 'calendar_today', label: 'Agenda' },
    { to: '/financeiro', icon: 'account_balance', label: 'Financeiro' },
    { to: '/vendas', icon: 'shopping_cart', label: 'Vendas' },
    { to: '/envios', icon: 'local_shipping', label: 'Envios' },
    { to: '/planejador-produtos', icon: 'trending_up', label: 'Planejador de Produtos' },
    { to: '/bazar', icon: 'auto_awesome', label: 'Planejador de Bazares' },
  ];

  // ...

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#111621] border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center justify-center px-3 py-4">
              <div className="w-24">
                <img src="/logo.png" alt="InflueTech Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))}
                />
              ))}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-lg">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
              <span className="text-sm font-medium">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
            <Link to="/auth/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="text-sm font-medium">Sair</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 dark:bg-[#111621]/90 backdrop-blur-sm px-4 md:px-8 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden md:block relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Pesquisar..."
                className="h-10 w-64 rounded-lg bg-gray-100 dark:bg-gray-800 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">notifications</span>
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[#111621]"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-cover bg-center cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")' }}></div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/configuracoes/*" element={<Settings />} />
              <Route path="/empresas/*" element={<Companies />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/financeiro/*" element={<Finance />} />
              <Route path="/vendas" element={<Sales />} />
              <Route path="/envios/*" element={<Logistics />} />
              <Route path="/planejador-produtos" element={<ProductPlanner />} />
              <Route path="/bazar/*" element={<Bazar />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;