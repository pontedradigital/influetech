import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Privacy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-slate-300 font-sans selection:bg-purple-500/30">
            <SEO
                title="Política de Privacidade"
                description="Política de Privacidade da Influetech. Saiba como protegemos seus dados e garantimos sua conformidade com a LGPD."
                url="https://influetech.pontedra.com/privacidade"
            />
            {/* Header copy from Home.tsx for consistency */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <img src="/logo.png" className="h-8 md:h-10 relative z-10 w-auto" alt="Influetech" />
                        </div>
                    </Link>
                    <Link to="/" className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-bold text-white">
                        Voltar para Home
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-display">Política de Privacidade</h1>
                    <p className="text-lg text-slate-400">Em conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018)</p>
                </div>

                <div className="space-y-12 prose prose-invert prose-purple max-w-none">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introdução</h2>
                        <p>
                            A sua privacidade é fundamental para a Pontedra ("Nós"). Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais ao utilizar a plataforma Influetech.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Dados Coletados</h2>
                        <p>
                            Coletamos apenas os dados necessários para o fornecimento de nossos serviços:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
                            <li><strong>Dados de Identificação:</strong> Nome, e-mail, telefone, CPF/CNPJ (para emissão de notas fiscais).</li>
                            <li><strong>Dados Financeiros:</strong> Informações sobre receitas e despesas inseridas voluntariamente por você para gestão financeira (estes dados são criptografados).</li>
                            <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de dispositivo, navegador e páginas acessadas para fins de segurança e melhoria da experiência.</li>
                            <li><strong>Dados de Mídia:</strong> Informações públicas de suas redes sociais (seguidores, engajamento) caso você conecte suas contas para geração do Mídia Kit.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Finalidade do Tratamento</h2>
                        <p>
                            Seus dados são utilizados para:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
                            <li>Prover as funcionalidades da plataforma (ex: gerar relatórios, Mídia Kit);</li>
                            <li>Processar pagamentos de assinaturas;</li>
                            <li>Comunicar novidades, atualizações e suporte técnico;</li>
                            <li>Cumprir obrigações legais e regulatórias.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Compartilhamento de Dados</h2>
                        <p>
                            Não vendemos seus dados pessoais. O compartilhamento ocorre apenas com:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
                            <li><strong>Provedores de Serviço:</strong> Empresas que nos auxiliam na operação (hospedagem, processamento de pagamentos), sob estritos acordos de confidencialidade.</li>
                            <li><strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Segurança dos Dados</h2>
                        <p>
                            Adotamos medidas técnicas e organizacionais robustas para proteger seus dados, incluindo criptografia de ponta a ponta para dados sensíveis, controle de acesso rigoroso e monitoramento constante contra ameaças.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Seus Direitos (LGPD)</h2>
                        <p>
                            Você tem o direito de:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
                            <li>Confirmar a existência de tratamento de dados;</li>
                            <li>Acessar seus dados;</li>
                            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                            <li>Revogar seu consentimento a qualquer momento.</li>
                        </ul>
                        <p className="mt-4">
                            Para exercer seus direitos, entre em contato através do e-mail de suporte.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Cookies</h2>
                        <p>
                            Utilizamos cookies para melhorar sua experiência de navegação e personalizar o conteúdo. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
                        </p>
                    </section>

                    <div className="pt-12 border-t border-white/10 mt-12">
                        <p className="text-sm text-slate-500">Encarregado de Proteção de Dados (DPO): <a href="mailto:contato@pontedra.com" className="text-purple-400 hover:text-purple-300">contato@pontedra.com</a></p>
                    </div>
                </div>
            </main>

            <footer className="bg-neutral-950 py-12 border-t border-white/5 text-center text-slate-700 text-sm z-10 relative">
                <p className="mb-4">Influetech © 2026 - Feito para Creators, por <a href="https://www.pontedra.com" target="_blank" rel="noopener noreferrer" className="text-purple-900/50 hover:text-purple-400 transition-colors">Pontedra</a>.</p>
            </footer>
        </div>
    );
};

export default Privacy;
