import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/General';
import { Companies } from './pages/General';
import Agenda from './pages/Agenda';
import Bazar from './pages/Bazar';
import Finance from './pages/Finance';
import Logistics from './pages/Logistics';
import Settings from './pages/Settings';
import ProductPlanner from './pages/ProductPlanner';
import Auth from './pages/Auth';
import Sales from './pages/Sales';
import MediaKit from './pages/MediaKit';

import Networking from './pages/Networking';

const SidebarItem: React.FC<{ to: string; icon: string; label: string; active: boolean; onClick?: () => void }> = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
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
  // Check for saved theme preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Toggle Dark Mode & Persist
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // ...

  const navItems = [
    { to: '/app', icon: 'dashboard', label: 'Dashboard' },
    { to: '/app/meu-perfil', icon: 'person', label: 'Meu Perfil' },
    { to: '/app/empresas', icon: 'domain', label: 'Empresas' },
    { to: '/app/produtos', icon: 'package_2', label: 'Produtos' },
    { to: '/app/agenda', icon: 'calendar_today', label: 'Agenda' },
    { to: '/app/financeiro', icon: 'account_balance', label: 'Financeiro' },
    { to: '/app/vendas', icon: 'shopping_cart', label: 'Vendas' },

    { to: '/app/envios', icon: 'local_shipping', label: 'Envios' },
    { to: '/app/media-kit', icon: 'picture_as_pdf', label: 'Media Kit' },
    { to: '/app/networking', icon: 'hub', label: 'Networking' },
    { to: '/app/radar-marcas', icon: 'radar', label: 'Radar de Marcas' },
    { to: '/app/planejador-produtos', icon: 'trending_up', label: 'Planejador de Produtos' },
    { to: '/app/bazar', icon: 'auto_awesome', label: 'Planejador de Bazares' },
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
          } overflow-y-auto`}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center justify-center px-3 py-4">
              <div className="w-24">
                <Link to="/app">
                  <img src="/logo.png" alt="InflueTech Logo" className="w-full h-full object-contain" />
                </Link>
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
                  active={location.pathname === item.to || (item.to !== '/app' && location.pathname.startsWith(item.to))}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}

            </nav>
          </div>

          {/* Bottom Actions - Removed (moved to header) */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:w-auto flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 dark:bg-[#111621]/90 backdrop-blur-sm px-4 md:px-8 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            >
              <span className="material-symbols-outlined text-lg">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
              <span className="text-sm font-medium hidden md:inline">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>

            {/* Logout */}
            {/* Logout */}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/auth/login';
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              title="Sair"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="text-sm font-medium hidden md:inline">Sair</span>
            </button>
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

import { InfluencerProvider } from './context/InfluencerContext';
import BrandRadar from './pages/BrandRadar';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

import { HelmetProvider } from 'react-helmet-async';

const App: React.FC = () => {
  return (
    <InfluencerProvider>
      <HelmetProvider>
        <Router>
          <ScrollToTop />
          <CookieConsent />
          <Routes>


            {/* TSL at Root */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/privacidade" element={<Privacy />} />

            {/* Auth Pages */}
            <Route path="/auth/*" element={<Auth />} />

            {/* Protected Platform Routes at /app */}
            <Route path="/app/*" element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/meu-perfil/*" element={<Settings />} />
                    <Route path="/empresas/*" element={<Companies />} />
                    <Route path="/produtos" element={<Products />} />
                    <Route path="/agenda" element={<Agenda />} />
                    <Route path="/financeiro/*" element={<Finance />} />
                    <Route path="/vendas" element={<Sales />} />

                    <Route path="/envios/*" element={<Logistics />} />
                    <Route path="/media-kit" element={<MediaKit />} />
                    <Route path="/networking" element={<Networking />} />
                    <Route path="/radar-marcas" element={<BrandRadar />} />
                    <Route path="/planejador-produtos" element={<ProductPlanner />} />
                    <Route path="/bazar/*" element={<Bazar />} />
                    <Route path="*" element={<Navigate to="/app" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes >
        </Router>
      </HelmetProvider>
    </InfluencerProvider>
  );
};

export default App;