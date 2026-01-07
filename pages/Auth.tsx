import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { translateAuthError } from '../src/lib/auth-errors';

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
  const [isDisabledModalOpen, setIsDisabledModalOpen] = React.useState(false);
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
      // Import Supabase client
      const { supabase } = await import('../src/lib/supabase');

      // Use Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(translateAuthError(authError.message));
      }

      if (!data.session) {
        throw new Error('Sessão não criada');
      }

      // Create/Update user in public.User table (only basic info, preserve role/plan)
      const { data: existingUser } = await supabase
        .from('User')
        .select('role, plan, active')
        .eq('id', data.user.id)
        .single();

      // STRICT CHECK: Active Status
      if (existingUser && existingUser.active === 0) {
        await supabase.auth.signOut();
        setIsDisabledModalOpen(true);
        setLoading(false);
        return;
      }

      const { error: userError } = await supabase
        .from('User')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          password: 'auth_managed',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuário',
          active: 1,
          updatedAt: new Date().toISOString()
        }, {
          onConflict: 'id',
          ignoreDuplicates: false // We want to update name/email/active, but careful with others
        });

      if (userError) {
        console.warn('Warning: Could not sync user to public.User table:', userError);
      }

      // Store session and userId
      localStorage.setItem('token', data.session.access_token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email,
        role: existingUser?.role || 'USER', // CRITICAL: Store role
        plan: existingUser?.plan || 'START'
      }));

      // Navigate to app
      window.location.href = '/app';

    } catch (err: any) {
      console.error(err);
      setError(translateAuthError(err.message));
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


      {/* Disabled Account Modal */}
      {
        isDisabledModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050510]/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-[#1a1b2e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Gradient Top */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500"></div>

              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <span className="material-symbols-outlined text-3xl text-red-500">block</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Acesso Suspenso</h3>
                <p className="text-red-400 font-medium text-sm uppercase tracking-widest mb-6">Conta Desativada</p>

                <p className="text-slate-300 leading-relaxed mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                  No momento sua conta está desativada.<br /><br />
                  Entre em contato via e-mail com o suporte no <span className="text-white font-bold select-all">contato@influetechapp.com.br</span> com o assunto <strong className="text-white">[Conta Desativada]</strong> e aguarde nosso retorno.
                </p>

                <button
                  onClick={() => setIsDisabledModalOpen(false)}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all w-full border border-white/10"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

const Recover = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { supabase } = await import('../src/lib/supabase');

      // 1. Verify if email exists
      const { data: user, error: userError } = await supabase
        .from('User')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !user) {
        alert('Este e-mail não está cadastrado em nossa base. Verifique se digitou corretamente.');
        setLoading(false);
        return;
      }

      // 2. Send Reset Link
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsSuccessModalOpen(true);
    } catch (error: any) {
      alert('Erro ao enviar link: ' + error.message);
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

      {/* SUCCESS MODAL */}
      {
        isSuccessModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050510]/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-[#1a1b2e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Gradient Top */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>

              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <span className="material-symbols-outlined text-3xl text-green-500">mark_email_read</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">E-mail Enviado!</h3>
                <p className="text-green-400 font-medium text-sm uppercase tracking-widest mb-6">Verifique sua caixa de entrada</p>

                <div className="text-slate-300 leading-relaxed mb-6 bg-white/5 p-4 rounded-xl border border-white/5 text-left text-sm space-y-2">
                  <p>Enviamos um link de recuperação para <strong>{email}</strong>.</p>
                  <p className="flex items-start gap-2 text-amber-200/80">
                    <span className="material-symbols-outlined text-lg">warning</span>
                    <span><strong>Importante:</strong> Se não encontrar na caixa de entrada, verifique sua pasta de <strong>SPAM</strong> ou <strong>Lixo Eletrônico</strong>.</span>
                  </p>
                </div>

                <button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all w-full border border-white/10"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )
      }

    </div>
  );
};

const SetPassword = () => {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if we have a session (handled by Supabase generic link verification on load)
    const checkSession = async () => {
      const { supabase } = await import('../src/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If coming from email link, supabase client usually handles the hash fragment and sets session.
        // If not set, maybe link expired or invalid.
        // Wait a bit for auto-refresh? Or just show UI.
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { supabase } = await import('../src/lib/supabase');
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      alert('Senha definida com sucesso!');
      navigate('/app');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-neutral-950 overflow-hidden relative">
      <div className="w-full max-w-lg bg-[#0f172a] rounded-2xl border border-white/5 shadow-2xl p-8 relative z-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Definir Senha</h2>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Nova Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Confirmar Senha</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl mt-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Definir Senha e Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Register = () => {
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  // Get params from URL
  const query = new URLSearchParams(window.location.search);
  const email = query.get('email') || '';
  const plan = query.get('plan') || 'START';
  const role = query.get('role') || 'USER'; // Allow admin invites too if needed?
  const planCycle = query.get('planCycle') || 'MONTHLY';
  const urlName = query.get('name') || '';

  const [hasCheckedSession, setHasCheckedSession] = React.useState(false);

  React.useEffect(() => {
    if (urlName) setName(urlName);
    // Logout any existing user to avoid confusion
    localStorage.removeItem('token');
  }, [urlName]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { supabase } = await import('../src/lib/supabase');

      // 1. Sign Up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Erro ao criar usuário');

      // 2. Create Public Profile with correct Plan/Role
      // We upsert to be safe, but since it's new auth user, it should be new key
      const { error: profileError } = await supabase
        .from('User')
        .upsert({
          id: data.user.id, // Link Auth ID
          email: data.user.email,
          name: name,
          plan: plan,
          planCycle: planCycle,
          role: role,
          active: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation failed', profileError);
        // Retry or warn?
        // If profile fails, Login flow *might* create a default one, causing loss of Plan data.
        // But Login only creates if not exists.
        alert('Conta criada, mas houve um erro ao configurar o plano. Contate o suporte.');
      }

      // 3. Auto Login or Redirect
      // SignUp might return session immediately if email confirmation is disabled.
      if (data.session) {
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id, email, name, role, plan
        }));
        window.location.href = '/app';
      } else {
        alert('Conta criada! Verifique seu e-mail para confirmar.');
        navigate('/auth/login');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Convite Inválido</h1>
          <p className="text-slate-400">Link incompleto. Peça um novo convite ao administrador.</p>
          <Link to="/auth/login" className="block mt-6 text-purple-400">Voltar para Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-neutral-950 overflow-hidden relative">
      <div className="w-full max-w-lg bg-[#0f172a] rounded-2xl border border-white/5 shadow-2xl p-8 relative z-20">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Aceitar Convite</h2>
        <p className="text-slate-400 text-sm text-center mb-8">Defina sua senha para acessar a <strong>Influetech</strong>.</p>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Seu E-mail</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Seu Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
              placeholder="Seu Nome Completo"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Criar Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mt-2">
            <p className="text-xs text-purple-200">
              <strong>Plano Selecionado:</strong> {plan === 'CREATOR_PLUS' ? 'Creator+' : plan} ({planCycle})
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl mt-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Criando Conta...' : 'Finalizar Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function Auth() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="recuperar" element={<Recover />} />
      <Route path="definir-senha" element={<SetPassword />} />
      <Route path="invite" element={<Register />} />
    </Routes>
  );
}