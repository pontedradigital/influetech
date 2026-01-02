import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Contexts
import { InfluencerProvider } from '../context/InfluencerContext';

// Components
import ScrollToTop from '../components/ScrollToTop';
import CookieConsent from '../components/CookieConsent';

// Pages
import Dashboard from '../pages/Dashboard';
import Products from '../pages/General';
import { Companies } from '../pages/General';
import Agenda from '../pages/Agenda';
import Bazar from '../pages/Bazar';
import Finance from '../pages/Finance';
import Logistics from '../pages/Logistics';
import Settings from '../pages/Settings';
import ProductPlanner from '../pages/ProductPlanner';
import Auth from '../pages/Auth';
import Sales from '../pages/Sales';
import MediaKit from '../pages/MediaKit';
import Networking from '../pages/Networking';
import BrandRadar from '../pages/BrandRadar';
import Home from '../pages/Home';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import AdminUsers from '../pages/AdminUsers';
import AdminFinance from '../pages/AdminFinance';
import AdminPlans from '../pages/AdminPlans';
import AdminBrands from '../pages/AdminBrands';

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


    // Get user from localStorage to check role
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user?.role === 'ADMIN';

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

        // Admin Link (Visible only to ADMIN)
        ...(isAdmin ? [{ to: '/area-administrativa/usuarios', icon: 'admin_panel_settings', label: 'Admin (Master)' }] : []),
    ];

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

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
            return {};
        }
    });

    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const markAsRead = async (id?: string) => {
        try {
            const token = localStorage.getItem('token');
            const url = id ? '/api/admin/notifications/read' : '/api/admin/notifications/read-all';
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id })
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchNotifications();
        // Poll every 30s
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);
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

    const navItems = [
        { to: '/area-administrativa/usuarios', icon: 'group', label: 'Gestão de Usuários' },
        { to: '/area-administrativa/financeiro', icon: 'payments', label: 'Gestão Financeira' },
        { to: '/area-administrativa/planos', icon: 'price_check', label: 'Planos e Valores' },
        { to: '/area-administrativa/marcas', icon: 'radar', label: 'Gestão de Marcas' },
        { to: '/app', icon: 'arrow_back', label: 'Voltar para Plataforma' },
    ];

    return (
        <div className="flex min-h-screen w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-sans text-gray-100 selection:bg-cyan-500/30">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none"></div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Glass) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } overflow-y-auto shadow-2xl relative`}
            >
                <div className="flex h-full flex-col justify-between p-6">
                    <div className="flex flex-col gap-10">
                        {/* Logo Area */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                            <div className="w-28 mb-3">
                                <Link to="/area-administrativa/usuarios">
                                    <img src="/logo.png" alt="InflueTech Admin" className="w-full h-full object-contain filter drop-shadow-lg" />
                                </Link>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-neon-green/20 to-emerald-500/20 border border-neon-green/30 backdrop-blur-md">
                                <span className="text-[10px] font-bold text-neon-green tracking-[0.2em] uppercase">Master Admin</span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                                            ? 'bg-gradient-to-r from-purple-600/80 to-cyan-600/80 text-white shadow-lg shadow-purple-900/20 border border-white/10'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-cyan-400'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow animate-pulse"></div>}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* User Profile Snippet (Bottom) */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3 px-2 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 p-[1px]">
                                <div className="w-full h-full rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                            </div>
                            <div className="text-xs">
                                <p className="text-white font-medium">{user?.name || 'Master Account'}</p>
                                <p className="text-slate-400 w-32 truncate" title={user?.email}>{user?.email || 'admin@sistema'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full md:w-auto flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header (Floating Glass) */}
                <header className="sticky top-4 z-30 mx-4 md:mx-8 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-between px-6 mt-4">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wide hidden md:block">
                            Dashboard Administrativo
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative p-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1a1b2e] animate-pulse"></span>
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50">
                                    <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/5">
                                        <h3 className="text-sm font-bold text-white">Notificações</h3>
                                        <button onClick={() => markAsRead()} className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider">
                                            Lidas
                                        </button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center text-slate-500 text-xs">
                                                Nenhuma notificação recente.
                                            </div>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n.id} className={`p-3 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-white/5' : ''}`} onClick={() => markAsRead(n.id)}>
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-cyan-500 shadow-glow' : 'bg-slate-600'}`}></div>
                                                        <div>
                                                            <h4 className={`text-xs font-bold ${!n.read ? 'text-white' : 'text-slate-400'}`}>{n.title}</h4>
                                                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                                                            <p className="text-[9px] text-slate-600 mt-2">{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString().slice(0, 5)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {/* Admin Quick Actions */}
                                    <div className="p-2 border-t border-white/5 bg-black/20 grid grid-cols-2 gap-2">
                                        <Link to="/area-administrativa/usuarios" className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors" onClick={() => setIsNotificationsOpen(false)}>
                                            <span className="material-symbols-outlined text-sm">group_add</span>
                                            <span>Novos Usuários</span>
                                        </Link>
                                        <Link to="/area-administrativa/financeiro" className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors" onClick={() => setIsNotificationsOpen(false)}>
                                            <span className="material-symbols-outlined text-sm">payments</span>
                                            <span>Financeiro</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Logout */}
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/auth/login';
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm font-semibold"
                            title="Sair"
                        >
                            <span className="material-symbols-outlined text-lg">logout</span>
                            <span className="hidden md:inline">Sair</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8 relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }
    return <>{children}</>;
};

const AppContent = () => {
    const location = useLocation();
    const showCookieConsent = location.pathname === '/';

    return (
        <>
            <ScrollToTop />
            {showCookieConsent && <CookieConsent />}
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
                                <Route path="/media-kit/*" element={<MediaKit />} />
                                <Route path="/networking" element={<Networking />} />
                                <Route path="/radar-marcas" element={<BrandRadar />} />
                                <Route path="/planejador-produtos" element={<ProductPlanner />} />
                                <Route path="/bazar/*" element={<Bazar />} />



                                <Route path="*" element={<Navigate to="/app" replace />} />
                            </Routes>
                        </Layout>
                    </PrivateRoute>
                } />

                {/* Admin Routes (Top Level) */}
                <Route path="/area-administrativa/*" element={
                    <PrivateRoute>
                        <AdminLayout>
                            <Routes>
                                <Route path="usuarios" element={<AdminUsers />} />
                                <Route path="financeiro" element={<AdminFinance />} />
                                <Route path="planos" element={<AdminPlans />} />
                                <Route path="marcas" element={<AdminBrands />} />
                            </Routes>
                        </AdminLayout>
                    </PrivateRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <InfluencerProvider>
            <HelmetProvider>
                <Router>
                    <AppContent />
                </Router>
            </HelmetProvider>
        </InfluencerProvider>
    );
};

export default App;
