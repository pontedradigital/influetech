import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        verifyEmail();
    }, []);

    const verifyEmail = async () => {
        try {
            const { supabase } = await import('../src/lib/supabase');

            // The token is automatically handled by Supabase from the URL
            // We just need to check the current session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                throw new Error(sessionError.message);
            }

            if (session) {
                setSuccess(true);
                // Redirect to app after 2 seconds
                setTimeout(() => {
                    navigate('/app');
                }, 2000);
            } else {
                throw new Error('Sessão não encontrada. O link pode ter expirado.');
            }

        } catch (err: any) {
            console.error('Error verifying email:', err);
            setError(err.message || 'Erro ao verificar email. O link pode ter expirado.');
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
                            Verificação de Email
                        </h1>
                        <p className="text-gray-400">
                            {loading ? 'Verificando seu email...' : success ? 'Email verificado!' : 'Erro na verificação'}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="text-center py-8">
                        {loading && (
                            <div>
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                                <p className="text-gray-400">Aguarde um momento...</p>
                            </div>
                        )}

                        {success && (
                            <div>
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">✅</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Email Verificado com Sucesso!</h3>
                                <p className="text-gray-400 mb-4">Sua conta está ativa.</p>
                                <p className="text-sm text-gray-500">Redirecionando para a plataforma...</p>
                            </div>
                        )}

                        {error && !loading && (
                            <div>
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">❌</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Erro na Verificação</h3>
                                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm mb-6">
                                    {error}
                                </div>
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="px-6 py-3 rounded-lg font-bold text-white transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, #9146FF, #00D4FF)',
                                        boxShadow: '0 8px 24px rgba(145, 70, 255, 0.3)'
                                    }}
                                >
                                    Ir para Login
                                </button>
                            </div>
                        )}
                    </div>
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

export default VerifyEmail;
