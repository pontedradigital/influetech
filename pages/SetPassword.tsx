import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { translateAuthError } from '../src/lib/auth-errors';

const SetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Password strength indicators
    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    useEffect(() => {
        // Check password strength
        setPasswordStrength({
            hasMinLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    }, [password]);

    const isPasswordValid = () => {
        return Object.values(passwordStrength).every(v => v === true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid()) {
            setError('A senha não atende aos requisitos mínimos');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        setLoading(true);

        try {
            const { supabase } = await import('../src/lib/supabase');

            // Update password using the token from URL
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                throw new Error(updateError.message);
            }

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/auth/login');
            }, 2000);

        } catch (err: any) {
            console.error('Error setting password:', err);
            setError(translateAuthError(err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
            }}>
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2"
                            style={{
                                background: 'linear-gradient(135deg, #9146FF, #00D4FF)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                            Criar Senha
                        </h1>
                        <p className="text-gray-400">
                            Defina uma senha forte para sua conta
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">✅</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Senha Criada com Sucesso!</h3>
                            <p className="text-gray-400">Redirecionando para o login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nova Senha
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="Digite sua senha"
                                    required
                                />
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirmar Senha
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="Confirme sua senha"
                                    required
                                />
                            </div>

                            {/* Password Strength Indicators */}
                            {password && (
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                                    <p className="text-sm font-medium text-gray-300 mb-2">Requisitos da senha:</p>
                                    <div className="space-y-1 text-sm">
                                        <div className={`flex items-center gap-2 ${passwordStrength.hasMinLength ? 'text-green-400' : 'text-gray-500'}`}>
                                            <span>{passwordStrength.hasMinLength ? '✓' : '○'}</span>
                                            <span>Mínimo 8 caracteres</span>
                                        </div>
                                        <div className={`flex items-center gap-2 ${passwordStrength.hasUpperCase ? 'text-green-400' : 'text-gray-500'}`}>
                                            <span>{passwordStrength.hasUpperCase ? '✓' : '○'}</span>
                                            <span>Letra maiúscula</span>
                                        </div>
                                        <div className={`flex items-center gap-2 ${passwordStrength.hasLowerCase ? 'text-green-400' : 'text-gray-500'}`}>
                                            <span>{passwordStrength.hasLowerCase ? '✓' : '○'}</span>
                                            <span>Letra minúscula</span>
                                        </div>
                                        <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                                            <span>{passwordStrength.hasNumber ? '✓' : '○'}</span>
                                            <span>Número</span>
                                        </div>
                                        <div className={`flex items-center gap-2 ${passwordStrength.hasSpecialChar ? 'text-green-400' : 'text-gray-500'}`}>
                                            <span>{passwordStrength.hasSpecialChar ? '✓' : '○'}</span>
                                            <span>Caractere especial (!@#$%...)</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !isPasswordValid() || password !== confirmPassword}
                                className="w-full py-3 px-4 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: 'linear-gradient(135deg, #9146FF, #00D4FF)',
                                    boxShadow: '0 8px 24px rgba(145, 70, 255, 0.3)'
                                }}
                            >
                                {loading ? 'Criando senha...' : 'Criar Senha'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        © 2026 InflueTech. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SetPassword;
