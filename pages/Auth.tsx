import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

const AuthLayout: React.FC<{ children: React.ReactNode, title: string, subtitle: string }> = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#111621]">
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-500 mt-2">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session when entering login page
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use relative path - Vercel handles rewrite to backend, Vite proxy handles dev
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao autenticar');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Force navigation to ensure clean state and avoid potential React render crashes
      // related to "The string did not match the expected pattern" on mobile (likely atob in a dependency)
      window.location.href = '/app';

    } catch (err: any) {
      console.error(err);
      // If we have a token but some subsequent step failed (like navigate causing a render crash),
      // force redirect anyway.
      if (localStorage.getItem('token')) {
        window.location.href = '/app';
        return;
      }
      setError(err.message || 'Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-neutral-950 overflow-hidden relative">

      {/* Subtle Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/20 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse animation-delay-2000"></div>

      {/* Main Container with NEON GRADIENT BORDER */}
      <div className="relative w-full max-w-5xl h-auto md:h-[650px] rounded-[32px] bg-gradient-to-br from-purple-600 via-cyan-500 to-pink-500 p-[1px] shadow-2xl my-8 md:my-0">

        {/* Inner Content (Matte Black) */}
        <div className="w-full h-full bg-neutral-900 rounded-[31px] flex flex-col md:flex-row overflow-hidden">

          {/* LEFT COLUMN: FORM */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 py-12 md:py-0">

            <div className="w-full max-w-sm space-y-8">
              <div className="text-center flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">LOGIN</h1>
                <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full shadow-glow"></div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm px-4 py-3 rounded-xl text-center shadow-lg font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-400 tracking-widest uppercase ml-1">Email / Usuário</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                    placeholder="seu@email.com"
                    required
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-400 tracking-widest uppercase ml-1">Senha</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <Link to="/auth/recuperar" className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-wider transition-colors">
                      Esqueceu?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg rounded-xl hover:opacity-90 transform hover:scale-[1.01] transition-all shadow-lg shadow-purple-900/20 uppercase tracking-widest mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Entrando...' : 'ENTRAR'}
                </button>
              </form>

            </div>
          </div>

          {/* RIGHT COLUMN: DARK NEON DECORATION (Simplified to match unified style) */}
          <div className="hidden md:flex w-1/2 bg-neutral-900 items-center justify-center relative p-8 border-l border-neutral-800">

            {/* Inner Card Content (kept from previous step but cleaned up context) */}
            <div className="w-full h-full flex flex-col items-center justify-center relative p-6">

              {/* Background Glows */}
              <div className="absolute top-10 right-10 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl"></div>

              {/* Icon/Logo Container */}
              <div className="mb-8 relative z-10 w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 bg-neutral-800 rounded-2xl rotate-6 border border-neutral-700"></div>
                <div className="absolute inset-0 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800 shadow-xl p-5 z-20">
                  <img src="/logo-login.png" alt="Influetech Shield" className="w-full h-full object-contain" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-4 relative z-10 tracking-tight text-center">
                Bem-vindo de Volta
              </h2>

              <p className="text-slate-400 text-base leading-relaxed text-center px-8 relative z-10">
                Gerencie seu crescimento e parcerias com a melhor ferramenta para Digitais Influencers do mercado Brasileiro. Uma tecnologia <a href="https://www.pontedra.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-semibold hover:underline">Pontedra</a>.
              </p>

              <div className="mt-12 flex gap-4 opacity-40 relative z-10">
                <div className="w-8 h-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-purple-500/50"></div>
                </div>
                <div className="w-8 h-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-sm bg-cyan-500/50"></div>
                </div>
              </div>

              <div className="mt-auto pt-8 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] relative z-10">
                Plataforma Influetech
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Recover = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Link de recuperação enviado (simulação). Verifique seu console/email.');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-neutral-950 overflow-hidden relative">
      {/* Subtle Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/20 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse animation-delay-2000"></div>

      {/* Main Container with NEON GRADIENT BORDER */}
      <div className="relative w-full max-w-5xl h-auto md:h-[650px] rounded-[32px] bg-gradient-to-br from-purple-600 via-cyan-500 to-pink-500 p-[1px] shadow-2xl my-8 md:my-0">

        {/* Inner Content (Matte Black) */}
        <div className="w-full h-full bg-neutral-900 rounded-[31px] flex flex-col md:flex-row overflow-hidden">

          {/* LEFT COLUMN: FORM */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 py-12 md:py-0">

            <div className="w-full max-w-sm space-y-8">
              <div className="text-center flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">Recuperar</h1>
                <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full shadow-glow"></div>
                <p className="text-slate-400 mt-4 text-sm">Digite seu e-mail para receber um link de redefinição de senha.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-400 tracking-widest uppercase ml-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg rounded-xl hover:opacity-90 transform hover:scale-[1.01] transition-all shadow-lg shadow-purple-900/20 uppercase tracking-widest mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'ENVIAR LINK'}
                </button>
              </form>

              <div className="text-center mt-6">
                <Link to="/auth/login" className="text-sm text-cyan-400 font-bold hover:text-cyan-300 uppercase tracking-wider transition-colors">
                  Voltar para Login
                </Link>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: DARK NEON DECORATION */}
          <div className="hidden md:flex w-1/2 bg-neutral-900 items-center justify-center relative p-8 border-l border-neutral-800">

            {/* Inner Card Content */}
            <div className="w-full h-full flex flex-col items-center justify-center relative p-6">

              {/* Background Glows */}
              <div className="absolute top-10 right-10 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl"></div>

              {/* Icon/Logo Container */}
              <div className="mb-8 relative z-10 w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 bg-neutral-800 rounded-2xl rotate-6 border border-neutral-700"></div>
                <div className="absolute inset-0 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800 shadow-xl p-5 z-20">
                  <img src="/logo-login.png" alt="Influetech Shield" className="w-full h-full object-contain" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-4 relative z-10 tracking-tight text-center">
                Recupere seu Acesso
              </h2>

              <p className="text-slate-400 text-base leading-relaxed text-center px-8 relative z-10">
                Não se preocupe, acontece com os melhores. Vamos te ajudar a voltar para sua gestão num instante.
              </p>

              <div className="mt-12 flex gap-4 opacity-40 relative z-10">
                <div className="w-8 h-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-purple-500/50"></div>
                </div>
                <div className="w-8 h-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-sm bg-cyan-500/50"></div>
                </div>
              </div>

              <div className="mt-auto pt-8 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] relative z-10">
                Plataforma Influetech
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function Auth() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="recuperar" element={<Recover />} />
    </Routes>
  );
}