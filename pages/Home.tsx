import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [isAnnual, setIsAnnual] = useState(true);

    // Pricing Constants
    const PLAN_START_MONTHLY = 29.90;
    const PLAN_START_ANNUAL_TOTAL = 298.80; // (24.90 * 12)
    const PLAN_START_ANNUAL_MONTHLY = 24.90;

    const PLAN_CREATOR_MONTHLY = 49.90;
    const PLAN_CREATOR_ANNUAL_TOTAL = 478.80; // (39.90 * 12)
    const PLAN_CREATOR_ANNUAL_MONTHLY = 39.90;

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-display selection:bg-cyan-500/30 overflow-x-hidden">

            {/* --- HEADER --- */}
            <header className="fixed top-0 w-full z-50 bg-neutral-900/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img src="/logo-full.png" alt="Influetech Logo" className="h-12 object-contain" />
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hover:scale-105 transform">Funcionalidades</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hover:scale-105 transform">Planos</a>
                        <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hover:scale-105 transform">Dúvidas</a>
                    </nav>

                    {/* CTA */}
                    <Link
                        to="/auth/login"
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-full font-bold text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 shadow-md"
                    >
                        Acessar Plataforma
                    </Link>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section id="hero" className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse delay-75"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000"></div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up hover:bg-white/10 transition-colors cursor-default">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.7)]"></span>
                        <span className="text-sm font-medium text-cyan-300 tracking-wide font-display">A ferramenta #1 dos Influenciadores Profissionais</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] font-display drop-shadow-2xl">
                        Transforme sua Influência em um <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-white animate-gradient-x">Negócio Lucrativo.</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        Pare de perder tempo e dinheiro com desorganização. Foque no que importa: <strong className="text-white font-bold">Criar Conteúdo e Fazer Dinheiro.</strong>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                        <a
                            href="#pricing"
                            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:-translate-y-1 transform active:scale-95 font-display tracking-wide"
                        >
                            COMEÇAR AGORA
                        </a>
                        <p className="text-sm text-slate-400 flex items-center gap-2 group cursor-help">
                            <span className="material-symbols-outlined text-green-400 group-hover:scale-125 transition-transform">verified</span>
                            Teste grátis de 7 dias
                        </p>
                    </div>

                    {/* ACTIVE DASHBOARD SCREENSHOT */}
                    <div className="relative mx-auto max-w-5xl group perspective-1000">
                        {/* Glow Behind */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000 animate-pulse"></div>

                        {/* Dashboard Container */}
                        <div className="relative rounded-2xl bg-[#0f172a] border border-white/10 overflow-hidden shadow-2xl transform transition-transform duration-700 hover:rotate-x-2">
                            {/* Browser Bar */}
                            <div className="h-10 bg-[#1e293b] border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="mx-auto w-1/2 h-6 bg-[#0f172a] rounded-md flex items-center justify-center text-[10px] text-slate-500 font-mono">
                                    app.influetech.com/dashboard
                                </div>
                            </div>

                            {/* Image */}
                            <div className="aspect-[16/9] bg-[#0f172a] relative overflow-hidden">
                                <img
                                    src="/dashboard-screen.png"
                                    alt="Influetech Dashboard"
                                    className="w-full h-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity duration-500"
                                />
                                {/* Overlay gradient at bottom to blend if needed */}
                                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0f172a] to-transparent opacity-50"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PAIN POINTS SECTION --- */}
            <section className="py-24 bg-neutral-900 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="md:grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 font-display leading-tight">
                                Você não é apenas um criador, <br />
                                <span className="text-purple-400">você é uma empresa.</span>
                            </h2>
                            <p className="text-slate-400 mb-8 text-lg">
                                Se você ainda anota publis no caderno ou não sabe quanto vai entrar no fim do mês, você está perdendo dinheiro.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: 'Desorganização Financeira', text: 'Sem controle de fluxo de caixa, você nunca sabe seu lucro real e gasta mais do que pode.' },
                                    { title: 'Lack of Strategy (Falta de Estratégia)', text: 'Agenda bagunçada te impede de planejar o crescimento consistente do seu público.' },
                                    { title: 'Caos Operacional', text: 'Gerenciar envios, contratos e prazos manualmente drena toda sua energia criativa.' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-red-500">close</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white mb-1">{item.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 md:mt-0 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-500/20 rounded-full blur-[80px]"></div>
                            <div className="relative bg-neutral-800/50 backdrop-blur border border-white/5 p-8 rounded-3xl">
                                <div className="flex flex-col gap-4 opacity-50 blur-[1px]">
                                    <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                                    <div className="h-4 w-full bg-white/10 rounded"></div>
                                    <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-neutral-900 p-6 rounded-2xl border border-red-500/30 shadow-2xl flex flex-col items-center">
                                        <span className="text-4xl mb-2">😫</span>
                                        <span className="font-bold text-red-400">O Ciclo da Falência</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SOLUTION / FEATURES SECTION --- */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-6xl font-black mb-4 font-display">Tudo o que você precisa em <span className="text-cyan-400">um só lugar</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">Nosso assistente de inteligência de negócio centraliza sua carreira.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature Cards */}
                        {[
                            { icon: 'payments', title: 'Gestão Financeira', desc: 'Controle entradas, saídas e metas financeiras automaticamente.', gradient: 'from-purple-500 to-orange-500' },
                            { icon: 'inventory_2', title: 'Estoque Inteligente', desc: 'Saiba exatamente quais produtos você tem e o valor parado em casa.', gradient: 'from-blue-500 to-cyan-500' },
                            { icon: 'rocket_launch', title: 'Gestão de Envios', desc: 'Organize endereços e rastreios para press kits e recebidos.', gradient: 'from-pink-500 to-purple-500' },
                            { icon: 'calendar_month', title: 'Agenda Estratégica', desc: 'Planeje conteúdos e campanhas com visão de crescimento.', gradient: 'from-purple-500 to-orange-500' },
                            { icon: 'description', title: 'Media Kit Pro', desc: 'Gere um media kit atualizado e profissional em segundos.', gradient: 'from-blue-500 to-cyan-500' },
                            { icon: 'hub', title: 'Networking & Marcas', desc: 'Organize seus contatos e oportunidades de parceria em um CRM dedicado.', gradient: 'from-pink-500 to-purple-500' },
                        ].map((feature, idx) => (
                            <div key={idx} className="group relative">
                                {/* Gradient Border/Glow */}
                                <div className={`absolute -inset-[1px] bg-gradient-to-br ${feature.gradient} rounded-xl opacity-50 group-hover:opacity-100 blur-[2px] transition duration-500`}></div>

                                {/* Card Content */}
                                <div className="relative h-full bg-neutral-900 rounded-xl p-8 shadow-xl flex flex-col items-start gap-4">
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-white">{feature.icon}</span>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-white font-display mb-2">{feature.title}</h3>
                                        <p className="text-sm text-slate-300 font-body leading-relaxed opacity-90">{feature.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Special AI Card */}
                        <div className="md:col-span-2 lg:col-span-3 mt-8 group relative">
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 rounded-xl opacity-75 blur-sm animate-gradient-x"></div>

                            <div className="relative bg-neutral-900 w-full h-full rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/30 animate-pulse">
                                    <span className="material-symbols-outlined text-3xl text-white">auto_awesome</span>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-white mb-2 font-display">Assistente de Inteligência de Negócio</h3>
                                    <p className="text-slate-300 text-sm md:text-base font-body">
                                        Nosso analista inteligente monitora suas métricas, sugere produtos em alta para review, identifica as melhores datas para bazar e recomenda marcas compatíveis com seu perfil.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>                  </div>
            </section>

            {/* --- ROI / ANCHORING SECTION --- */}
            <section className="py-20 bg-neutral-900 relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute -left-20 top-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -right-20 top-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto px-6 text-center">

                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-black mb-8 font-display">Quanto vale o seu sucesso?</h2>

                        <div className="bg-neutral-800/50 backdrop-blur border border-white/5 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            {/* Anchor Item 1 */}
                            <div className="flex flex-col items-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <span className="text-6xl filter drop-shadow-lg">🍔</span>
                                <p className="text-sm font-medium text-slate-400">Um combo de Fast-food</p>
                                <p className="text-xl font-bold text-slate-300 line-through">R$ 50,00</p>
                            </div>

                            <div className="text-2xl font-bold text-purple-500">VS</div>

                            {/* Anchor Item 2 - Influetech */}
                            <div className="flex flex-col items-center gap-4 scale-110">
                                <img
                                    src="/logo-icon.png"
                                    alt="Influetech"
                                    className="w-24 h-24 object-contain filter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse"
                                />
                                <span className="sr-only">Influetech</span>
                                <p className="text-sm font-bold text-cyan-400">Gestão Completa de Carreira</p>
                                <p className="text-3xl font-extrabold text-white">R$ 39<span className="text-lg">,90</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 p-6 rounded-2xl">
                        <p className="text-green-400 font-bold text-lg md:text-xl">
                            <span className="material-symbols-outlined align-bottom mr-2">savings</span>
                            Pare de perder dinheiro! Com menos de <span className="text-white underline decoration-green-500 decoration-4 underline-offset-4">R$ 2,00 por dia</span>, você tem a ferramenta mais completa do mercado.
                        </p>
                    </div>

                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section id="pricing" className="py-24 px-6 relative bg-black/50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-black mb-8 font-display tracking-tight text-white">Preço</h2>

                        {/* TOGGLE SWITCH */}
                        <div className="flex items-center justify-center gap-4">
                            <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Mensal</span>
                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className="w-16 h-8 bg-neutral-800 rounded-full relative border border-white/10 transition-colors hover:border-white/30"
                            >
                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 ${isAnnual ? 'left-8' : 'left-1'}`}></div>
                            </button>
                            <span className={`text-sm font-bold ${isAnnual ? 'text-white' : 'text-slate-500'}`}>Anual <span className="text-xs text-green-400 ml-1 font-normal">(Economize 20%)</span></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                        {/* PLANO START */}
                        <div className="relative p-10 rounded-[2rem] bg-neutral-900 border border-white/5 backdrop-blur-sm flex flex-col transition-all duration-300 hover:border-white/10">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white mb-4 font-display">Start</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-bold text-slate-400">R$</span>
                                    <span className="text-5xl font-bold text-white tracking-tighter">
                                        {isAnnual ? PLAN_START_ANNUAL_MONTHLY.toFixed(2).replace('.', ',') : PLAN_START_MONTHLY.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="text-slate-500 font-medium">/mês</span>
                                </div>
                                {isAnnual && (
                                    <p className="text-sm text-slate-500 mt-2">
                                        R$ {PLAN_START_ANNUAL_TOTAL.toFixed(2).replace('.', ',')} por ano
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    'Dashboard Geral',
                                    'Gestão Financeira Básica',
                                    'Controle de Estoque',
                                    'Gestão de Vendas',
                                    'Gestão de Envios',
                                    'Agenda de Tarefas'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                                        <span className="text-sm font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-4 rounded-md bg-white text-black font-bold hover:bg-slate-200 transition-all text-sm tracking-wide">
                                Adquira Agora
                            </button>
                        </div>

                        {/* PLANO CREATOR+ */}
                        <div className="relative p-10 rounded-[2rem] bg-neutral-900 border border-white/10 backdrop-blur-sm flex flex-col shadow-[0_0_50px_rgba(255,255,255,0.07)] md:-mt-4">
                            <div className="absolute top-0 right-0 p-6">
                                <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Recomendado</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white mb-4 font-display">Creator+</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-bold text-slate-400">R$</span>
                                    <span className="text-5xl font-bold text-white tracking-tighter">
                                        {isAnnual ? PLAN_CREATOR_ANNUAL_MONTHLY.toFixed(2).replace('.', ',') : PLAN_CREATOR_MONTHLY.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="text-slate-500 font-medium">/mês</span>
                                </div>
                                {isAnnual && (
                                    <p className="text-sm text-slate-500 mt-2">
                                        R$ {PLAN_CREATOR_ANNUAL_TOTAL.toFixed(2).replace('.', ',')} por ano
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    'Dashboard Geral',
                                    'Gestão Financeira Básica',
                                    'Controle de Estoque',
                                    'Gestão de Vendas',
                                    'Gestão de Envios',
                                    'Agenda de Tarefas',
                                    'Ferramenta de Networking (CRM)',
                                    'Analista Inteligente de Parcerias',
                                    'Sugestão de Produtos (IA)',
                                    'Planejador de Bazares',
                                    'Media Kit Creator Pro',
                                    'Suporte Prioritário'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white">
                                        <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                                        <span className="text-sm font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-4 rounded-md bg-white text-black font-bold hover:bg-slate-200 transition-all text-sm tracking-wide shadow-lg shadow-white/10">
                                Adquira Agora
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section id="faq" className="py-24 px-6 bg-neutral-900 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4 font-display">Perguntas Frequentes</h2>
                        <p className="text-slate-400">Tire suas dúvidas sobre a Influetech.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "O que é o Assistente de Inteligência de Negócio?", a: "É uma ferramenta exclusiva que analisa seus dados para sugerir parcerias ideais, produtos em alta para review e as melhores datas para realizar bazares de desapego." },
                            { q: "Como funciona a Gestão Financeira?", a: "Você lança suas 'publis' e recebidos, e o sistema organiza tudo: o que já recebeu, o que está pendente, suas metas mensais e gera relatórios automáticos de lucro." },
                            { q: "O Media Kit é atualizado automaticamente?", a: "Sim! Você configura seu perfil uma vez e o sistema gera um PDF profissional e atualizado com seus números e informações para enviar às marcas." },
                            { q: "Vale a pena para quem está começando?", a: "Com certeza! O plano Start foi desenhado para organizar sua carreira desde o dia 1, evitando que você perca oportunidades por falta de organização." },
                            { q: "Posso cancelar quando quiser?", a: "Sim. No plano mensal você pode cancelar a qualquer momento sem multa. No plano anual, você tem o desconto especial pela fidelidade de 12 meses." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-black/20 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
                                <h3 className="text-lg font-bold text-white mb-2">{item.q}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-black py-12 border-t border-white/5 text-center text-slate-600 text-sm">
                <p className="mb-4">Influetech © {new Date().getFullYear()} - Todos os direitos reservados</p>
                <div className="flex justify-center gap-6 opacity-50">
                    <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                    <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                    <a href="#" className="hover:text-white transition-colors">Suporte</a>
                </div>
            </footer>

        </div>
    );
}
