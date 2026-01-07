import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../src/lib/supabase';
import { parseDatabaseArray } from '../src/utils/dbHelpers';

export default function Home() {
    const [isAnnual, setIsAnnual] = useState(true);
    const heroRef = useRef<HTMLDivElement>(null);
    const circle1Ref = useRef<HTMLDivElement>(null);
    const circle2Ref = useRef<HTMLDivElement>(null);

    // Dynamic Plans State
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const { data, error } = await supabase
                    .from('Plan')
                    .select('*')
                    .eq('active', true)
                    .order('priceMonthly', { ascending: true });

                if (error) throw error;
                if (data) setPlans(data);
            } catch (error) {
                console.error("Failed to fetch plans", error);
            } finally {
                setIsLoadingPlans(false);
            }
        };
        fetchPlans();
    }, []);

    // Typewriter Effect Data
    const [typedText, setTypedText] = useState('');
    const fullText = "menos caos na vida do influenciador.";

    useEffect(() => {
        setTypedText(''); // Reset text when fullText changes
        let index = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.slice(0, index + 1));
            index++;
            if (index > fullText.length) clearInterval(interval);
        }, 80);
        return () => clearInterval(interval);
    }, [fullText]);

    // Scroll Reveal & Parallax Logic
    useEffect(() => {
        const handleScroll = () => {
            const reveals = document.querySelectorAll('.reveal');
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 150;
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add('active');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!heroRef.current) return;

        requestAnimationFrame(() => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
            const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1

            if (circle1Ref.current) {
                circle1Ref.current.style.transform = `translate(calc(-50% + ${x * -30}px), ${y * -30}px)`;
            }
            if (circle2Ref.current) {
                circle2Ref.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            }
        });
    };

    // Tilt Effect Logic
    const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const resetTilt = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };

    // Custom "Slow" Smooth Scroll
    const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (!target) return;

        const targetPosition = target.getBoundingClientRect().top + window.scrollY;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 200; // Ultra-fast response (0.2s)
        let startTime: number | null = null;

        const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);

            window.scrollTo(0, run);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        smoothScrollTo(e, `#${targetId}`);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-body selection:bg-purple-500/30 overflow-x-hidden">
            <SEO
                title="Home"
                description="Organize sua carreira de influenciador com a Influetech. Gestão financeira, mídia kit automático e planejador de conteúdo em um só lugar."
                url="https://influetech.pontedra.com"
            />

            {/* --- HEADER --- */}
            <header className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
                    {/* Logo (Increased by 100%) */}
                    <div className="flex-shrink-0 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-10 group-hover:opacity-25 transition-opacity"></div>
                        <img src="/logo-full.png" alt="Influetech Logo" className="h-10 md:h-14 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105" />
                    </div>

                    {/* Desktop Nav (Reordered + FAQ) */}
                    <nav className="hidden md:flex gap-8">
                        {[
                            { label: 'Benefícios', id: 'benefits' },
                            { label: 'Funcionalidades', id: 'features' },
                            { label: 'Planos', id: 'pricing' },
                            { label: 'FAQ', id: 'faq' }
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={`#${item.id}`}
                                onClick={(e) => handleNavClick(e, item.id)}
                                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors relative group"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    {/* CTA (Changed to 'Entrar') */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/auth/login"
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-full font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] shadow-md border border-white/10"
                        >
                            Entrar
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section
                id="hero"
                ref={heroRef}
                onMouseMove={handleMouseMove}
                className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden"
            >
                {/* Parallax Background Effects */}
                <div
                    ref={circle1Ref}
                    className="absolute top-0 left-1/2 w-[800px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] -z-10 transition-transform duration-100 ease-out will-change-transform"
                    style={{ transform: 'translate(-50%, 0)' }}
                ></div>
                <div
                    ref={circle2Ref}
                    className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[100px] -z-10 transition-transform duration-100 ease-out will-change-transform"
                    style={{ transform: 'translate(0, 0)' }}
                ></div>

                <div className="max-w-6xl mx-auto text-center relative z-10">

                    {/* Trusted Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/30 mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
                        <span className="text-xs font-bold text-purple-200 tracking-wider uppercase">Plataforma #1 para Creators</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.1] font-display drop-shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Mais controle, mais ganhos, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-gradient-x border-r-4 border-purple-500 pr-2" style={{ animation: 'gradient-x 3s ease infinite, blink 1s step-end infinite' }}>
                            {typedText}
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Pare de perder dinheiro com desorganização. Centralize ganhos, organize sua rotina e potencialize suas oportunidades em um plataforma feita para você.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <a
                            href="#features"
                            onClick={(e) => smoothScrollTo(e, '#features')}
                            className="w-full sm:w-auto px-10 py-5 glass rounded-full font-bold text-lg hover:bg-white/10 transition-all text-white border border-white/20"
                        >
                            Ver Funcionalidades
                        </a>
                    </div>

                    {/* HERO PREVIEW w/ 3D Tilt */}
                    <div
                        className="relative mx-auto max-w-6xl group perspective-1000 animate-fade-in-up"
                        style={{ animationDelay: '0.5s' }}
                        onMouseMove={handleTilt}
                        onMouseLeave={resetTilt}
                    >
                        {/* Glow Behind */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-1000"></div>

                        {/* Dashboard Container - Tiltable */}
                        <div className="relative rounded-xl bg-[#0f172a] border border-white/10 overflow-hidden shadow-2xl transition-transform duration-100 ease-out tilt-card">
                            {/* Browser Header */}
                            <div className="h-8 bg-[#1e293b] border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                </div>
                            </div>
                            {/* Image */}
                            <img
                                src="/dashboard-preview-v2.png"
                                alt="Influetech Dashboard"
                                className="w-full h-auto object-cover opacity-95 pointer-events-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TRUST TICKER (Social Platforms) --- */}
            <div className="w-full bg-black/30 border-y border-white/5 py-8 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10"></div>

                <div className="flex w-[200%] animate-ticker hover:pause">
                    {/* Integrate with Brands/Platforms */}
                    {[1, 2, 3].map((loop) => (
                        <div key={loop} className="flex justify-around items-center w-full px-10 gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Icons/Text for Platforms */}
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold font-display text-pink-500">Instagram</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold font-display text-white">TikTok</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold font-display text-red-600">YouTube</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold font-display text-orange-500">Shopee</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold font-display text-black bg-white px-2 rounded">SHEIN</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold font-display text-yellow-500">AliExpress</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold font-display text-blue-500">Kwai</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* --- PAIN POINTS --- */}
            <section id="benefits" className="py-24 bg-neutral-900 relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-900/10 to-transparent pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16 reveal">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 font-display">
                            Você é um Criador ou um <span className="text-purple-400">Amador?</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Marcas grandes não fecham com quem anota "publis" no caderno. Sem organização, você perde dinheiro, perde prazos e perde credibilidade.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: 'sentiment_very_dissatisfied', title: 'O Caos Financeiro', text: 'Você não sabe quanto vai ganhar no mês que vem e gasta tudo o que entra sem planejar impostos ou reinvestimento.', color: 'text-red-500' },
                            { icon: 'timer_off', title: 'Prazos Perdidos', text: 'Esquecer de postar um storie combinado pode queimar seu filme para sempre com uma agência.', color: 'text-orange-500' },
                            { icon: 'search_off', title: 'Caça às Cegas', text: 'Perder horas procurando parcerias e produtos sem saber o que funciona é jogar tempo e dinheiro fora.', color: 'text-red-500' },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="glass p-8 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all reveal hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                                style={{ transitionDelay: `${idx * 100}ms` }}
                                onMouseMove={handleTilt}
                                onMouseLeave={resetTilt}
                            >
                                <div className="tilt-content">
                                    <span className={`material-symbols-outlined text-5xl ${item.color} mb-6`}>{item.icon}</span>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FEATURES --- */}
            <section id="features" className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-32">
                    {/* ... (Features content omitted for brevity, keeping existing structure) ... */}
                    {/* Re-inserting features blocks same as before but truncated in thought for speed, but I will write FULL content in file tool */}
                    {/* Feature 1: Finance */}
                    <div className="grid md:grid-cols-2 gap-16 items-center reveal">
                        <div className="order-2 md:order-1 relative group w-full"
                            onMouseMove={handleTilt}
                            onMouseLeave={resetTilt}
                        >
                            <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl tilt-card aspect-video">
                                <div className="tilt-content h-full">
                                    <img
                                        src="/finance-preview.png"
                                        alt="Controle Financeiro"
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                                <span className="material-symbols-outlined text-green-400 text-2xl">attach_money</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black mb-6 font-display">Domine seu Dinheiro <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">De uma vez por todas.</span></h3>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Saiba exatamente quanto faturou com Adsense, Publis e Vendas. O sistema calcula automaticamente suas metas e te avisa se você está gastando mais do que deveria.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400">check_circle</span> Previsão de fluxo de caixa</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400">check_circle</span> Relatórios de Faturamento</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400">check_circle</span> Cálculo de ROI por campanha</li>
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2: Media Kit */}
                    <div className="grid md:grid-cols-2 gap-16 items-center reveal">
                        <div>
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                                <span className="material-symbols-outlined text-purple-400 text-2xl">picture_as_pdf</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black mb-6 font-display">Mídia Kit Profissional <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Em um clique.</span></h3>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Configure seu perfil uma vez e gere um PDF interativo, atualizado e absurdamente profissional para enviar para as marcas.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-purple-400">check_circle</span> Design Premium automático</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-purple-400">check_circle</span> Dados demográficos reais</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-purple-400">check_circle</span> Link para download direto</li>
                            </ul>
                        </div>
                        <div className="relative group w-full"
                            onMouseMove={handleTilt}
                            onMouseLeave={resetTilt}
                        >
                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            {/* Mockup of PDF REPLACED with Image */}
                            <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl tilt-card aspect-video">
                                <div className="tilt-content h-full">
                                    <img
                                        src="/mediakit-preview.png"
                                        alt="Mídia Kit Profissional"
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Agenda */}
                    <div className="grid md:grid-cols-2 gap-16 items-center reveal">
                        <div className="order-2 md:order-1 relative group w-full"
                            onMouseMove={handleTilt}
                            onMouseLeave={resetTilt}
                        >
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl tilt-card aspect-video">
                                {/* Abstract Contact List REPLACED with Agenda Image */}
                                <div className="tilt-content h-full">
                                    <img
                                        src="/agenda-preview.png"
                                        alt="Agenda Inteligente"
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                                <span className="material-symbols-outlined text-blue-400 text-2xl">calendar_month</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black mb-6 font-display">Agenda Inteligente <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Rotina sob Controle.</span></h3>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Organize seus posts, tarefas e compromissos em um só lugar. Visualize seu mês, não perca prazos e mantenha a consistência que as marcas procuram.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-400">check_circle</span> Calendário de Conteúdo Visual</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-400">check_circle</span> Gestão de Prazos e Tarefas</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-400">check_circle</span> Organização Completa</li>
                            </ul>
                        </div>
                    </div>

                    {/* Feature 4: Shipping Management */}
                    <div className="grid md:grid-cols-2 gap-16 items-center reveal">
                        <div>
                            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                                <span className="material-symbols-outlined text-orange-400 text-2xl">local_shipping</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black mb-6 font-display">Logística Simplificada <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Envios sob controle.</span></h3>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Gerencie todos os seus envios em um só lugar. Calcule fretes automaticamente e organize as mercadorias enviadas. O sistema encontra valores aproximados e otimiza sua operação logística.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-orange-400">check_circle</span> Cálculo automático de frete</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-orange-400">check_circle</span> Gerenciamento de Rastreios</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-orange-400">check_circle</span> Gestão centralizada de envios</li>
                            </ul>
                        </div>
                        <div className="relative group w-full"
                            onMouseMove={handleTilt}
                            onMouseLeave={resetTilt}
                        >
                            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl tilt-card aspect-video">
                                <div className="tilt-content h-full">
                                    <img
                                        src="/shipping-preview.png"
                                        alt="Gestão de Envios"
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 5: Bazaar Planner */}
                    <div className="grid md:grid-cols-2 gap-16 items-center reveal">
                        <div className="order-2 md:order-1 relative group w-full"
                            onMouseMove={handleTilt}
                            onMouseLeave={resetTilt}
                        >
                            <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl tilt-card aspect-video">
                                <div className="tilt-content h-full">
                                    <img
                                        src="/bazar-preview.png"
                                        alt="Planejador de Bazares"
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/20">
                                <span className="material-symbols-outlined text-pink-400 text-2xl">storefront</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black mb-6 font-display">Planejador de Bazares <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Venda no Momento Certo.</span></h3>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Não chute a data do seu bazar. Nossa inteligência analisa o mercado, feriados e tendências para te indicar os dias com maior potencial de lucro.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-pink-400">check_circle</span> Sugestão Inteligente de Datas</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-pink-400">check_circle</span> Previsão de Demanda</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-pink-400">check_circle</span> Insights de Tendências</li>
                            </ul>
                        </div>
                    </div>

                    {/* Feature 6: Product Planner */}
                    <div className="grid md:grid-cols-2 gap-16 items-center reveal">
                        <div>
                            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-6 border border-yellow-500/20">
                                <span className="material-symbols-outlined text-yellow-400 text-2xl">trending_up</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black mb-6 font-display">Planejador de Produtos <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">O Hype ao seu Favor.</span></h3>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Descubra produtos com tendências de busca explosivas antes de todo mundo. Nossa inteligência rastreia o que está em alta no AliExpress, Shein e Shopee para você focar no que vende.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-yellow-400">check_circle</span> Mineração de Produtos em Alta</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-yellow-400">check_circle</span> Análise de Volume de Busca</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-yellow-400">check_circle</span> Conecte-se com o que viraliza</li>
                            </ul>
                        </div>
                        <div className="relative group w-full"
                            onMouseMove={handleTilt}
                            onMouseLeave={resetTilt}
                        >
                            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl tilt-card aspect-video">
                                <div className="tilt-content h-full">
                                    <img
                                        src="/product-planner-preview.png"
                                        alt="Planejador de Produtos"
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SOCIAL PROOF --- */}
            <section className="py-24 bg-neutral-900 border-t border-white/5 reveal">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-black mb-16 font-display">Creators que já estão no <span className="text-purple-400">Próximo Nível</span></h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Julia M.", role: "Beauty Influencer", quote: "Antes eu perdia horas montando proposta. Com a Influetech, fechei 3 contratos só porque meu Mídia Kit parecia de agência.", score: "5.0" },
                            { name: "Lucas Tech", role: "Tech Reviewer", quote: "A gestão financeira mudou minha vida. Descobri que gastava 40% do meu lucro em besteira. Agora invisto em equipamento.", score: "5.0" },
                            { name: "Ana Fit", role: "Lifestyle", quote: "A melhor parte é o CRM. Tenho todos os contatos das marcas organizados e sei exatamente quando cobrar cada um.", score: "4.9" },
                        ].map((testim, idx) => (
                            <div key={idx} className="bg-black/40 p-8 rounded-2xl border border-white/10 relative text-left hover:border-purple-500/30 transition-colors">
                                <div className="flex gap-1 mb-4 text-yellow-500">
                                    {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-sm">star</span>)}
                                </div>
                                <p className="text-slate-300 mb-6 italic">"{testim.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold">{testim.name.charAt(0)}</div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{testim.name}</p>
                                        <p className="text-xs text-slate-500">{testim.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* --- PRICING SECTION --- */}
            <section id="pricing" className="py-24 px-6 relative bg-black/50 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-purple-900/10 rounded-full blur-[120px] -z-10"></div>

                <div className="max-w-5xl mx-auto reveal">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-black mb-8 font-display tracking-tight text-white">Investimento</h2>

                        {/* TOGGLE SWITCH */}
                        <div className="flex items-center justify-center gap-4">
                            <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Mensal</span>
                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className="w-16 h-8 bg-neutral-800 rounded-full relative border border-white/10 transition-colors hover:border-white/30 cursor-pointer"
                            >
                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 ${isAnnual ? 'left-8' : 'left-1'}`}></div>
                            </button>
                            <span className={`text-sm font-bold ${isAnnual ? 'text-white' : 'text-slate-500'}`}>Anual <span className="text-xs text-green-400 ml-1 font-normal bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">-20% OFF</span></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {isLoadingPlans ? (
                            <div className="col-span-2 text-center text-slate-400">Carregando planos...</div>
                        ) : plans.length === 0 ? (
                            <div className="col-span-2 text-center text-slate-400">Nenhum plano disponível no momento.</div>
                        ) : (
                            plans.map(plan => {
                                // Calculate/Display values
                                const monthly = parseFloat(plan.priceMonthly);
                                const annual = parseFloat(plan.priceAnnual);
                                const annualMonthlyDiv = annual / 12;

                                const currentPrice = isAnnual ? annualMonthlyDiv : monthly;
                                const isRecommended = plan.recommended;

                                return (
                                    <div
                                        key={plan.id}
                                        className={`relative p-[1px] rounded-[2.5rem] overflow-hidden group transition-all duration-500 hover:-translate-y-2 ${isRecommended ? 'md:-mt-8 shadow-[0_0_60px_-15px_rgba(168,85,247,0.3)] z-10' : 'hover:z-10 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)]'
                                            }`}
                                    >
                                        {/* Neon Border Gradient */}
                                        <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 opacity-100 ${isRecommended
                                            ? 'from-purple-600 via-cyan-500 to-purple-600 opacity-60'
                                            : 'from-white/10 via-white/5 to-transparent group-hover:from-purple-500 group-hover:via-cyan-500 group-hover:to-purple-500 group-hover:opacity-100'
                                            }`}></div>

                                        {/* Soft Moving Background Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-cyan-900/10 to-purple-900/10 bg-[length:200%_200%] animate-gradient-x opacity-30"></div>

                                        {/* Content Container */}
                                        <div className="relative h-full bg-[#0b0c15]/90 rounded-[2.4rem] p-10 flex flex-col backdrop-blur-xl">

                                            {/* Background Glow Spot */}
                                            <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] transition-all duration-500 ${isRecommended ? 'bg-purple-600/20' : 'bg-purple-600/0 group-hover:bg-purple-600/10'
                                                }`}></div>

                                            {isRecommended && (
                                                <div className="absolute top-8 right-8 z-20">
                                                    <div className="bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse-slow">
                                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Mais Escolhido</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mb-8 relative z-10">
                                                <h3 className={`text-3xl font-bold mb-4 font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${isRecommended ? 'from-purple-300 via-white to-cyan-300' : 'from-slate-400 via-slate-200 to-slate-400'}`}>
                                                    {plan.name}
                                                </h3>
                                                <div className="flex items-baseline gap-1">
                                                    <span className={`text-lg font-bold ${isRecommended ? 'text-purple-300' : 'text-slate-500'}`}>R$</span>
                                                    <span className={`text-6xl font-bold tracking-tighter ${isRecommended ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'text-white'}`}>
                                                        {isAnnual ? annualMonthlyDiv.toFixed(2).replace('.', ',') : monthly.toFixed(2).replace('.', ',')}
                                                    </span>
                                                    <span className={`font-medium ${isRecommended ? 'text-slate-400' : 'text-slate-500'}`}>/mês</span>
                                                </div>

                                                {isAnnual ? (
                                                    <div className="mt-4 space-y-1">
                                                        <div className={`text-sm font-medium ${isRecommended ? 'text-purple-200' : 'text-slate-400'}`}>
                                                            R$ {annual.toFixed(2).replace('.', ',')} à vista
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            Cobrado em uma única parcela anual
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-3 inline-flex items-center gap-1 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                                                        <span className="text-xs font-bold text-green-400">Economize 20% no anual</span>
                                                    </div>
                                                )}

                                                <p className={`text-sm mt-4 leading-relaxed ${isRecommended ? 'text-purple-200/80' : 'text-slate-500 group-hover:text-slate-400 transition-colors'}`}>
                                                    {plan.description}
                                                </p>
                                            </div>

                                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

                                            <ul className="space-y-4 mb-10 flex-1 relative z-10">
                                                {parseDatabaseArray(plan.features).map((item: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-4 group/item">
                                                        <div className={`mt-0.5 p-1 rounded-full ${isRecommended ? 'bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/20' : 'bg-white/5 group-hover/item:bg-purple-500/20 transition-colors'}`}>
                                                            <span className="material-symbols-outlined text-white text-[10px] font-bold block">check</span>
                                                        </div>
                                                        <span className={`text-sm font-medium ${isRecommended ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300 transition-colors'}`}>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <button className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 text-sm tracking-wide relative overflow-hidden group/btn ${isRecommended
                                                ? 'bg-white text-black hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                                : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
                                                }`}>
                                                <span className="relative z-10">Quero ser {plan.name}</span>
                                                {!isRecommended && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                                )}
                                            </button>

                                            <p className="text-[10px] text-slate-500 text-center mt-4 font-medium opacity-60">
                                                Cancele a qualquer momento. Sem taxas ocultas.
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 text-sm">Garantia de 7 dias incondicional. Cancele quando quiser.</p>
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section id="faq" className="py-24 px-6 relative bg-neutral-900/30">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black font-display mb-4">Perguntas Frequentes</h2>
                        <p className="text-slate-400">Tire suas dúvidas e comece hoje mesmo.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "A Influetech é só para quem tem muitos seguidores?", a: "Não! A plataforma foi desenhada para creators de todos os tamanhos. Se você quer organizar suas parcerias e crescer profissionalmente, a Influetech é para você, mesmo que esteja começando agora." },
                            { q: "Posso separar meus gastos pessoais dos profissionais?", a: "Sim! A Influetech permite classificar cada entrada e saída, para você saber exatamente quanto do seu dinheiro é lucro real e quanto é custo de vida." },
                            { q: "Como funciona o Planejador de Bazares?", a: "Nossa inteligência artificial analisa o mercado e seus dados para sugerir as melhores datas para realizar um bazar, maximizando suas chances de venda e lucro." },
                            { q: "O Planejador de Produtos encontra fornecedores?", a: "O sistema rastreia tendências em tempo real no AliExpress, Shopee e Shein para te mostrar quais produtos estão viralizando. Você vê o volume de busca e decide o que vender." },
                            { q: "Consigo gerenciar meus envios e fretes por aqui?", a: "Com certeza. O módulo de logística permite calcular fretes estimados e organizar, em um só lugar, todos os códigos de rastreio dos produtos que você enviou." },
                            { q: "O Mídia Kit é atualizado automaticamente?", a: "Sim. Diferente de um PDF estático feito no Canva, nosso Mídia Kit puxa seus dados reais. Você configura uma vez e ele fica sempre pronto para enviar para marcas." },
                            { q: "Meus dados financeiros estão seguros?", a: "Absolutamente. Utilizamos criptografia de ponta e não compartilhamos seus dados financeiros com ninguém. Eles são estritamente para sua gestão pessoal." },
                            { q: "Posso cancelar a qualquer momento?", a: "Com certeza. Nossos planos são sem fidelidade. Você pode cancelar sua assinatura mensal a qualquer momento nas configurações da sua conta, sem multas." }
                        ].map((faq, idx) => (
                            <details key={idx} className="group bg-black/40 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 open:bg-black/60 open:border-purple-500/30">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="font-bold text-lg text-slate-200 group-hover:text-white transition-colors">{faq.q}</span>
                                    <span className="material-symbols-outlined text-purple-500 transition-transform duration-300 group-open:rotate-180">expand_more</span>
                                </summary>
                                <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA FINAL --- */}
            <section className="py-24 px-6 relative overflow-hidden text-center">
                <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10 reveal">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 font-display">O Ecossistema Completo para Creators.</h2>
                    <p className="text-slate-300 text-xl mb-12">Deixe a burocracia com a gente. Financeiro, Logística, Mídia Kit e <br />Planejamento integrados para você focar apenas em criar.</p>

                    <a
                        href="#pricing"
                        onClick={(e) => smoothScrollTo(e, '#pricing')}
                        className="inline-block px-12 py-6 bg-white text-black rounded-full font-black text-xl hover:bg-slate-200 hover:scale-110 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] cursor-pointer"
                    >
                        COMEÇAR AGORA 🚀
                    </a>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-neutral-950 py-12 border-t border-white/5 text-center text-slate-700 text-sm z-10 relative">
                <div className="flex justify-center items-center mb-8 transition-all">
                    <img src="/logo.png" loading="lazy" className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" alt="Influetech" />
                </div>
                <p className="mb-4">Influetech © 2026 - Feito para Creators, por <a href="https://www.pontedra.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">Pontedra</a>.</p>
                <div className="flex justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
                    <Link to="/termos" className="hover:text-white transition-colors">Termos</Link>
                    <Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                </div>
            </footer>
        </div>
    );
}
