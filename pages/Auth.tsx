import React from 'react';
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
  const navigate = React.useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha no login');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Bem-vindo de volta!" subtitle="Faça login na sua conta para continuar">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
            <Link to="/auth/recuperar" className="text-sm text-primary font-medium hover:underline">Esqueceu a senha?</Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-center text-sm text-gray-500">
          Não tem uma conta? <Link to="/auth/registro" className="text-primary font-bold hover:underline">Criar Conta</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

const Register = () => (
  <AuthLayout title="Criar Conta" subtitle="Comece a gerenciar seus produtos com inteligência">
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
        <input type="text" className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input type="email" className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
        <input type="password" className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent" />
      </div>
      <button className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors mt-4">Criar Conta</button>
      <p className="text-center text-sm text-gray-500">
        Já tem uma conta? <Link to="/auth/login" className="text-primary font-bold hover:underline">Faça Login</Link>
      </p>
    </form>
  </AuthLayout>
);

const Recover = () => (
  <AuthLayout title="Recuperar Senha" subtitle="Digite seu e-mail para receber um link de recuperação">
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
        <input type="email" className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50" placeholder="seu@email.com" />
      </div>
      <button className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors">Enviar Link</button>
      <p className="text-center text-sm">
        <Link to="/auth/login" className="text-primary font-bold hover:underline">Voltar para Login</Link>
      </p>
    </form>
  </AuthLayout>
);

export default function Auth() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="registro" element={<Register />} />
      <Route path="recuperar" element={<Recover />} />
    </Routes>
  );
}