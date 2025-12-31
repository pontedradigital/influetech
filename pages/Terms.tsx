import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-slate-300 font-sans selection:bg-purple-500/30">
            <SEO
                title="Termos de Uso"
                description="Termos de Uso da Plataforma Influetech. Leia sobre nossos serviços, responsabilidades e política de cancelamento."
                url="https://influetech.pontedra.com/termos"
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
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-display">Termos de Uso</h1>
                    <p className="text-lg text-slate-400">Última atualização: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="space-y-12 prose prose-invert prose-purple max-w-none">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
                        <p>
                            Ao acessar e utilizar a plataforma Influetech ("Plataforma"), desenvolvida e operada pela Pontedra ("Empresa"), você concorda integralmente com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, você não deve utilizar, acessar ou se cadastrar na Plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Serviços Oferecidos</h2>
                        <p>
                            A Influetech é uma ferramenta de gestão para influenciadores digitais (Creators) que oferece serviços de:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
                            <li>Gestão financeira e controle de fluxo de caixa;</li>
                            <li>Planejamento de campanhas e calendário editorial;</li>
                            <li>Geração de Mídia Kit automatizado;</li>
                            <li>Ferramentas de logística e controle de envios;</li>
                            <li>Análise de tendências de produtos e datas sazonais (Bazares).</li>
                        </ul>
                        <p className="mt-4">
                            A Empresa reserva-se o direito de modificar, suspender ou descontinuar qualquer aspecto dos serviços a qualquer momento, inclusive a disponibilidade de quaisquer recursos, bancos de dados ou conteúdo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Planos e Pagamentos</h2>
                        <p>
                            O acesso a determinadas funcionalidades da Plataforma exige a contratação de um plano de assinatura (Start ou Creator+). Os pagamentos são processados por gateways de pagamento seguros.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
                            <li><strong>Renovação Automática:</strong> As assinaturas são renovadas automaticamente ao final de cada período, a menos que canceladas pelo usuário.</li>
                            <li><strong>Cancelamento:</strong> O usuário pode cancelar a assinatura a qualquer momento. O cancelamento interromperá a cobrança futura, mas não haverá reembolso proporcional do período já pago, salvo garantia de 7 dias.</li>
                            <li><strong>Reajustes:</strong> Os preços podem ser reajustados anualmente ou conforme novas funcionalidades sejam adicionadas, mediante aviso prévio.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Responsabilidades do Usuário</h2>
                        <p>
                            Você é o único responsável pela segurança de sua conta e senha. A Influetech não se responsabiliza por perdas decorrentes do uso não autorizado de sua conta. Você concorda em não utilizar a Plataforma para fins ilegais ou não autorizados.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Propriedade Intelectual</h2>
                        <p>
                            Todo o design, textos, gráficos, interfaces e códigos da Influetech são propriedade da Pontedra e protegidos pelas leis de direitos autorais e propriedade intelectual. O Mídia Kit gerado pertence ao usuário, mas o layout e a tecnologia de geração são propriedade da Plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Limitação de Responsabilidade</h2>
                        <p>
                            A Influetech fornece as ferramentas "como estão". Não garantimos resultados específicos de lucro, engajamento ou sucesso em campanhas. As previsões de tendências e bazares são baseadas em dados históricos e de mercado, não constituindo garantia de venda futura.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Disposições Gerais</h2>
                        <p>
                            Estes termos serão regidos e interpretados de acordo com as leis do Brasil. Fica eleito o foro da comarca da sede da Empresa para dirimir quaisquer questões oriundas destes Termos.
                        </p>
                    </section>

                    <div className="pt-12 border-t border-white/10 mt-12">
                        <p className="text-sm text-slate-500">Dúvidas? Entre em contato: <a href="mailto:contato@pontedra.com" className="text-purple-400 hover:text-purple-300">contato@pontedra.com</a></p>
                    </div>
                </div>
            </main>

            <footer className="bg-neutral-950 py-12 border-t border-white/5 text-center text-slate-700 text-sm z-10 relative">
                <p className="mb-4">Influetech © 2026 - Feito para Creators, por <a href="https://www.pontedra.com" target="_blank" rel="noopener noreferrer" className="text-purple-900/50 hover:text-purple-400 transition-colors">Pontedra</a>.</p>
            </footer>
        </div>
    );
};

export default Terms;
