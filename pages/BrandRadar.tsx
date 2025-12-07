import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// --- Tipos Refinados ---
interface Brand {
    id: string;
    name: string;
    logo: string;
    origin: string; // País de Origem
    website: string;
    tier: 'Tier S' | 'Tier A' | 'Tier B' | 'Tier C' | 'Tier D';
    categories: string[]; // Mouse, Teclado, GPU, etc.
    contactMethod: 'Email' | 'Formulário' | 'Afiliado' | 'Agência' | 'Ambassador';
    difficulty: 'Fácil' | 'Médio' | 'Difícil';
    salesChannels: string[]; // Amazon, Kabum, etc.
    lastActive: string;
    matchScore: number;
    email?: string;
    budget: number;
    affinity: number;
    description: string;
    whyContact: string; // "Por que contatar"
}

// --- Dados de Hardware/Tech (Lista Completa 25 Brands) ---
const MOCK_BRANDS: Brand[] = [
    // TIER S: MAIS ACESSÍVEIS (1K-10K)
    {
        id: '1', name: 'YUNZII', logo: 'YZ', origin: 'China', website: 'yunzii.com',
        tier: 'Tier S', categories: ['Teclado', 'Acessórios'], contactMethod: 'Formulário', difficulty: 'Fácil',
        salesChannels: ['Site Próprio', 'Amazon', 'AliExpress'], lastActive: 'Ao vivo agora', matchScore: 98,
        email: 'marketing@yunzii.com', budget: 45, affinity: 95,
        description: 'Teclados mecânicos estéticos e acessíveis.', whyContact: 'Programa aberto para creators de todos os tamanhos, responde em 48h.'
    },
    {
        id: '2', name: 'Epomaker', logo: 'EP', origin: 'China', website: 'epomaker.com',
        tier: 'Tier S', categories: ['Teclado', 'Switches', 'Keycaps'], contactMethod: 'Ambassador', difficulty: 'Fácil',
        salesChannels: ['Site Próprio', 'AliExpress', 'Amazon', 'Newegg'], lastActive: '5 min atrás', matchScore: 96,
        email: 'support@epomaker.com', budget: 50, affinity: 98,
        description: 'Plataforma de fabricantes com enorme variedade.', whyContact: 'Ambassador program com produtos gratuitos, muito receptivos.'
    },
    {
        id: '3', name: 'Royal Kludge (RK)', logo: 'RK', origin: 'China', website: 'rkgaming.com',
        tier: 'Tier S', categories: ['Teclado'], contactMethod: 'Email', difficulty: 'Fácil',
        salesChannels: ['Site Próprio', 'AliExpress', 'Amazon', 'Banggood'], lastActive: '1h atrás', matchScore: 94,
        email: 'sales@rkgaming.com', budget: 40, affinity: 90,
        description: 'Teclados de entrada mais populares do mercado.', whyContact: 'Budget-friendly, hot-swap, muito popular, aceita reviews.'
    },
    {
        id: '4', name: 'Redragon', logo: 'RD', origin: 'China', website: 'redragon.com.br',
        tier: 'Tier S', categories: ['Teclado', 'Mouse', 'Headset'], contactMethod: 'Email', difficulty: 'Fácil',
        salesChannels: ['Site Próprio', 'Amazon', 'Distribuidores'], lastActive: 'Online', matchScore: 92,
        email: 'marketing@redragon.com.br', budget: 35, affinity: 92,
        description: 'Gigante do custo-benefício gamer.', whyContact: 'Ultra budget, ótimo para iniciantes, alta visibilidade.'
    },
    {
        id: '5', name: 'VGN', logo: 'VG', origin: 'China', website: 'vgnlab.com',
        tier: 'Tier S', categories: ['Mouse', 'Teclado'], contactMethod: 'Email', difficulty: 'Médio',
        salesChannels: ['Site Próprio', 'Distribuidores'], lastActive: '3h atrás', matchScore: 88,
        email: 'business@vgnlab.com', budget: 60, affinity: 85,
        description: 'Marca emergente com foco em performance.', whyContact: 'Magnetic switches acessíveis, marca em crescimento.'
    },

    // TIER A: EXCELENTES OPORTUNIDADES (5K-50K)
    {
        id: '6', name: 'Keychron', logo: 'KC', origin: 'China', website: 'keychron.com',
        tier: 'Tier A', categories: ['Teclado'], contactMethod: 'Afiliado', difficulty: 'Médio',
        salesChannels: ['Site Próprio', 'Amazon', 'AliExpress'], lastActive: '2 min atrás', matchScore: 90,
        email: 'support@keychron.com', budget: 75, affinity: 90,
        description: 'Referência mundial em teclados mecânicos office/gamer.', whyContact: 'Líder de mercado, $90M em vendas anuais.'
    },
    {
        id: '7', name: 'NuPhy', logo: 'NP', origin: 'China', website: 'nuphy.com',
        tier: 'Tier A', categories: ['Teclado', 'Low-Profile'], contactMethod: 'Afiliado', difficulty: 'Médio',
        salesChannels: ['Site Próprio', 'Amazon'], lastActive: '10 min atrás', matchScore: 89,
        email: 'service@nuphy.com', budget: 70, affinity: 88,
        description: 'Design moderno e teclados low-profile de elite.', whyContact: 'Crescimento rápido, receptivos a reviews.'
    },
    {
        id: '8', name: 'Akko / MonsGeek', logo: 'AK', origin: 'China', website: 'en.akkogear.com',
        tier: 'Tier A', categories: ['Teclado', 'Keycaps', 'Switches'], contactMethod: 'Email', difficulty: 'Médio',
        salesChannels: ['Site Próprio', 'Amazon', 'AliExpress', 'Newegg'], lastActive: '12h atrás', matchScore: 87,
        email: 'support@akkogear.com', budget: 65, affinity: 85,
        description: 'Designs temáticos e colaborações (Anime/IPs).', whyContact: 'Fábrica própria, designs únicos.'
    },
    {
        id: '9', name: 'Womier', logo: 'WO', origin: 'China', website: 'womierkeyboard.com',
        tier: 'Tier A', categories: ['Teclado'], contactMethod: 'Email', difficulty: 'Fácil',
        salesChannels: ['Site Próprio', 'Amazon'], lastActive: '1d atrás', matchScore: 85,
        email: 'info@womierkeyboard.com', budget: 60, affinity: 82,
        description: 'Teclados acrílicos com muito RGB (Pudding).', whyContact: 'Custom keyboards, VIA compatible, preços acessíveis.'
    },
    {
        id: '10', name: 'Lemokey', logo: 'LK', origin: 'China', website: 'lemokey.com',
        tier: 'Tier A', categories: ['Teclado Gamer'], contactMethod: 'Afiliado', difficulty: 'Médio',
        salesChannels: ['Site Próprio', 'Amazon'], lastActive: '2d atrás', matchScore: 84,
        email: 'support@lemokey.com', budget: 80, affinity: 80,
        description: 'Sub-marca gamer da Keychron.', whyContact: 'Gaming focus, parte da Keychron, preços competitivos.'
    },

    // TIER B: MARCAS CONSOLIDADAS (20K-100K)
    {
        id: '11', name: 'Razer', logo: 'RZ', origin: 'USA / SG', website: 'razer.com',
        tier: 'Tier B', categories: ['Periféricos', 'Notebooks'], contactMethod: 'Ambassador', difficulty: 'Difícil',
        salesChannels: ['Site Próprio', 'Varejo Global', 'Amazon'], lastActive: 'Agora', matchScore: 80,
        email: 'partnerships@razer.com', budget: 95, affinity: 75,
        description: 'A maior marca de lifestyle gamer do mundo.', whyContact: 'Programa estruturado, até 8% comissão, Bounties.'
    },
    {
        id: '12', name: 'Logitech', logo: 'LG', origin: 'Suiça / USA', website: 'logitechg.com',
        tier: 'Tier B', categories: ['Periféricos'], contactMethod: 'Ambassador', difficulty: 'Difícil',
        salesChannels: ['Site Próprio', 'Varejo Global'], lastActive: '30 min atrás', matchScore: 78,
        email: 'creators@logitech.com', budget: 100, affinity: 70,
        description: 'Padrão da indústria para ratos e teclados.', whyContact: 'Marca premium, programa "Castle", aceita todos tamanhos.'
    },
    {
        id: '13', name: 'SteelSeries', logo: 'SS', origin: 'Dinamarca', website: 'steelseries.com',
        tier: 'Tier B', categories: ['Headset', 'Mousepad'], contactMethod: 'Afiliado', difficulty: 'Difícil',
        salesChannels: ['Site Próprio', 'Varejo Global'], lastActive: '2h atrás', matchScore: 76,
        email: 'affiliate@steelseries.com', budget: 90, affinity: 72,
        description: 'Inventores do mousepad gamer moderno.', whyContact: '4-8% comissão, gaming focus, marca estabelecida.'
    },
    {
        id: '14', name: 'Corsair', logo: 'CS', origin: 'USA', website: 'corsair.com',
        tier: 'Tier B', categories: ['Components', 'Periféricos'], contactMethod: 'Afiliado', difficulty: 'Difícil',
        salesChannels: ['Site Próprio', 'Varejo Global'], lastActive: '4h atrás', matchScore: 75,
        email: 'creators@corsair.com', budget: 92, affinity: 70,
        description: 'Ecossistema completo de PC gaming.', whyContact: '8% comissão, marca premium, forte em gaming.'
    },
    {
        id: '15', name: 'Ducky', logo: 'DK', origin: 'Taiwan', website: 'ducky.global',
        tier: 'Tier B', categories: ['Teclado'], contactMethod: 'Email', difficulty: 'Médio',
        salesChannels: ['Distribuidores'], lastActive: '1d atrás', matchScore: 74,
        email: 'support@duckychannel.com.tw', budget: 70, affinity: 85,
        description: 'Qualidade lendária em teclados mecânicos.', whyContact: 'Colaborações premium (Bethesda, hololive), colecionáveis.'
    },

    // TIER C: MARCAS BOUTIQUE / CUSTOM (10K-100K)
    {
        id: '16', name: 'KBDfans', logo: 'KB', origin: 'China', website: 'kbdfans.com',
        tier: 'Tier C', categories: ['Custom Keyboard', 'DIY'], contactMethod: 'Formulário', difficulty: 'Médio',
        salesChannels: ['Site Próprio'], lastActive: '5h atrás', matchScore: 88,
        email: 'support@kbdfans.com', budget: 60, affinity: 95,
        description: 'O maior marketplace de teclados custom DIY.', whyContact: 'DIY kits, comunidade forte, produtos em estoque.'
    },
    {
        id: '17', name: 'Qwertykeys', logo: 'QK', origin: 'China', website: 'qwertykeys.com',
        tier: 'Tier C', categories: ['Custom Keyboard'], contactMethod: 'Formulário', difficulty: 'Difícil',
        salesChannels: ['Site Próprio', 'Distribuidores'], lastActive: '6h atrás', matchScore: 85,
        email: 'support@qwertykeys.com', budget: 55, affinity: 90,
        description: 'Irmã acessível da Owlab. Qualidade premium.', whyContact: 'Designs inovadores (Neo), qualidade premium.'
    },
    {
        id: '18', name: 'Meletrix', logo: 'MX', origin: 'China', website: 'meletrix.com',
        tier: 'Tier C', categories: ['Custom Keyboard'], contactMethod: 'Email', difficulty: 'Médio',
        salesChannels: ['Distribuidores'], lastActive: '1d atrás', matchScore: 82,
        email: 'service@meletrix.com', budget: 50, affinity: 88,
        description: 'Criadores do Zoom65/75. Entusiasta entry-level.', whyContact: 'Zoom series popular, gasket mount.'
    },
    {
        id: '19', name: 'Mode Designs', logo: 'MD', origin: 'USA', website: 'modedesigns.com',
        tier: 'Tier C', categories: ['Custom Keyboard'], contactMethod: 'Email', difficulty: 'Difícil',
        salesChannels: ['Site Próprio'], lastActive: '2d atrás', matchScore: 80,
        email: 'partners@modedesigns.com', budget: 85, affinity: 85,
        description: 'Teclados custom de luxo com design minimalista.', whyContact: 'High-end custom, mounting inovador.'
    },
    {
        id: '20', name: 'Higround', logo: 'HG', origin: 'USA', website: 'higround.co',
        tier: 'Tier C', categories: ['Teclado', 'Lifestyle'], contactMethod: 'Formulário', difficulty: 'Médio',
        salesChannels: ['Site Próprio (Drops)'], lastActive: '12h atrás', matchScore: 90,
        email: 'team@higround.co', budget: 90, affinity: 95,
        description: 'Lifestyle brand da 100 Thieves.', whyContact: 'Colaborações icônicas (Pokémon, Naruto), hype.'
    },

    // TIER D: EMERGENTES (1K-20K)
    {
        id: '21', name: 'Ajazz', logo: 'AJ', origin: 'China', website: 'ajazzbrand.com',
        tier: 'Tier D', categories: ['Teclado', 'Mouse'], contactMethod: 'Email', difficulty: 'Fácil',
        salesChannels: ['Site Próprio', 'AliExpress', 'Amazon'], lastActive: '10 min atrás', matchScore: 85,
        email: 'marketing@ajazz.com', budget: 30, affinity: 80,
        description: 'Periféricos baratos com features modernas (HE).', whyContact: 'Budget-friendly, HE keyboards.'
    },
    {
        id: '22', name: 'Skyloong', logo: 'SK', origin: 'China', website: 'skyloong.com.cn',
        tier: 'Tier D', categories: ['Teclado'], contactMethod: 'Email', difficulty: 'Fácil',
        salesChannels: ['AliExpress', 'WhatGeek', 'Amazon'], lastActive: '30 min atrás', matchScore: 82,
        email: 'support@skyloong.com.cn', budget: 35, affinity: 78,
        description: 'Fabricante original dos switches ópticos GK.', whyContact: 'Budget custom keyboards, hot-swap.'
    },
    {
        id: '23', name: 'MageGee', logo: 'MG', origin: 'China', website: 'magegee.com',
        tier: 'Tier D', categories: ['Teclado'], contactMethod: 'Email', difficulty: 'Fácil',
        salesChannels: ['Amazon'], lastActive: '1h atrás', matchScore: 80,
        email: 'support@magegee.com', budget: 20, affinity: 75,
        description: 'Rei da categoria budget na Amazon.', whyContact: 'Ultra budget (<$30), RGB, alta visibilidade.'
    },
    {
        id: '24', name: 'Tecware', logo: 'TW', origin: 'Singapore', website: 'tecware.co',
        tier: 'Tier D', categories: ['Teclado', 'Gabinete'], contactMethod: 'Formulário', difficulty: 'Fácil',
        salesChannels: ['Site Próprio', 'Distribuidores'], lastActive: '2h atrás', matchScore: 84,
        email: 'support@tecware.co', budget: 40, affinity: 82,
        description: 'Forte presença no sudeste asiático.', whyContact: 'Phantom series popular, boa qualidade/preço.'
    },
    {
        id: '25', name: 'Leobog', logo: 'LB', origin: 'China', website: 'leobog.com',
        tier: 'Tier D', categories: ['Switches', 'Teclado'], contactMethod: 'Email', difficulty: 'Fácil',
        salesChannels: ['Amazon', 'AliExpress'], lastActive: '3h atrás', matchScore: 83,
        email: 'marketing@leobog.com', budget: 35, affinity: 85,
        description: 'Famosa pelos switches Graywood e Hi75.', whyContact: 'Budget switches e keyboards, gasket mount acessível.'
    },

    // --- MARCAS RESTAURADAS/ADICIONAIS --- (Tier ajustado para novo sistema)
    {
        id: '26', name: 'HyperX', logo: 'HX', origin: 'EUA', website: 'hyperxgaming.com',
        tier: 'Tier B', categories: ['Headset', 'Teclado', 'Mouse', 'Microfone'], contactMethod: 'Agência', difficulty: 'Médio',
        salesChannels: ['Kabum', 'Amazon', 'Mercado Livre'], lastActive: '2 min atrás', matchScore: 92,
        email: 'parcerias.br@hyperx.com', budget: 85, affinity: 90,
        description: 'Referência mundial em headsets e periféricos de alta performance.', whyContact: 'Marca consolidada, excelente para portfólio.'
    },
    {
        id: '27', name: 'Pichau Gaming', logo: 'PG', origin: 'Brasil', website: 'pichau.com.br',
        tier: 'Tier C', categories: ['Monitor', 'Gabinete', 'Cadeira', 'Periféricos'], contactMethod: 'Email', difficulty: 'Fácil',
        salesChannels: ['Site Próprio'], lastActive: '1h atrás', matchScore: 85,
        email: 'parceria@pichau.com.br', budget: 60, affinity: 88,
        description: 'Marca própria da gigante do hardware, focada em produtos acessíveis.', whyContact: 'Alta aceitação no Brasil, fácil de lidar.'
    },
    {
        id: '28', name: 'NVIDIA (GeForce)', logo: 'NV', origin: 'EUA', website: 'nvidia.com',
        tier: 'Tier S', categories: ['Placas de Vídeo (GPU)'], contactMethod: 'Agência', difficulty: 'Difícil',
        salesChannels: ['Kabum', 'Terabyte', 'Pichau'], lastActive: '3d atrás', matchScore: 99,
        email: 'pr-latam@nvidia.com', budget: 100, affinity: 70,
        description: 'A força motriz por trás dos gráficos modernos e IA.', whyContact: 'Líder absoluta, parcerias de alto nível.'
    },
    {
        id: '29', name: 'Rise Mode', logo: 'RM', origin: 'Brasil', website: 'risemode.com.br',
        tier: 'Tier D', categories: ['Water Cooler', 'Gabinete', 'Fans', 'Teclado'], contactMethod: 'Email', difficulty: 'Fácil',
        salesChannels: ['Kabum', 'Amazon', 'Shopee'], lastActive: '5 min atrás', matchScore: 80,
        email: 'mkt@risemode.com.br', budget: 45, affinity: 85,
        description: 'Estética gamer agressiva e preços competitivos.', whyContact: 'Focada em visual, cresce rápido no Brasil.'
    },
    {
        id: '30', name: 'JBL', logo: 'JBL', origin: 'EUA', website: 'jbl.com.br',
        tier: 'Tier B', categories: ['Caixas Bluetooth', 'Fone Sem Fio', 'Headset'], contactMethod: 'Agência', difficulty: 'Médio',
        salesChannels: ['Amazon', 'Magalu', 'Site Oficial'], lastActive: '1d atrás', matchScore: 78,
        email: 'influenciadores@harman.com', budget: 80, affinity: 75,
        description: 'Som lendário. Focada em lifestyle e música.', whyContact: 'Linha Quantum focada em gamers.'
    },
    {
        id: '31', name: 'Kingston / Fury', logo: 'KS', origin: 'EUA', website: 'kingston.com',
        tier: 'Tier B', categories: ['Memória RAM', 'SSD'], contactMethod: 'Email', difficulty: 'Médio',
        salesChannels: ['Kabum', 'Terabyte', 'Amazon'], lastActive: '4h atrás', matchScore: 82,
        email: 'br_marketing@kingston.com', budget: 70, affinity: 80,
        description: 'Sinônimo de memória e armazenamento confiável.', whyContact: 'Líder em memória, essencial para tech.'
    },
    {
        id: '32', name: 'Husky Gaming', logo: 'HG', origin: 'Brasil', website: 'kabum.com.br',
        tier: 'Tier D', categories: ['Monitor', 'Cadeira', 'Periféricos'], contactMethod: 'Email', difficulty: 'Fácil',
        salesChannels: ['Kabum'], lastActive: '10 min atrás', matchScore: 88,
        email: 'mkt.husky@kabum.com.br', budget: 55, affinity: 90,
        description: 'Marca exclusiva Kabum! focada em trazer o melhor do pro-player.', whyContact: 'Marca própria Kabum, alta disponibilidade.'
    }
];


const RadarChartComponent = ({ brand }: { brand: Brand }) => {
    const data = [
        { subject: 'Verba', A: brand.budget, fullMark: 100 },
        { subject: 'Afinidade', A: brand.affinity, fullMark: 100 },
        { subject: 'Facilidade', A: brand.difficulty === 'Fácil' ? 90 : brand.difficulty === 'Médio' ? 50 : 20, fullMark: 100 },
        { subject: 'Alcance', A: brand.matchScore, fullMark: 100 },
        { subject: 'Hype', A: Math.random() * 40 + 60, fullMark: 100 },
    ];

    return (
        <div className="h-40 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 9 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name={brand.name}
                        dataKey="A"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="#3b82f6"
                        fillOpacity={0.2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

const BrandRadar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTier, setSelectedTier] = useState<string>('');
    const [brands] = useState<Brand[]>(MOCK_BRANDS);
    const [scanning, setScanning] = useState(false);
    const [unlockedContacts, setUnlockedContacts] = useState<string[]>([]);
    const [isDecrypting, setIsDecrypting] = useState<string | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.length > 2) {
            setScanning(true);
            setTimeout(() => setScanning(false), 800);
        }
    };

    const filteredBrands = brands.filter(b =>
        (searchTerm === '' || b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.categories.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (selectedTier === '' || b.tier === selectedTier)
    );

    const handleUnlock = (id: string) => {
        setIsDecrypting(id);
        setTimeout(() => {
            setUnlockedContacts(prev => [...prev, id]);
            setIsDecrypting(null);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 font-sans overflow-hidden relative">
            <div className="flex flex-col h-screen">

                {/* Hero / Painel */}
                <div className="p-6 md:p-8 flex-shrink-0">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter uppercase">
                                    Radar de Marcas <span className="text-primary text-lg align-top">/// GLOBAL</span>
                                </h1>
                                <p className="text-gray-500 font-medium text-sm border-l-4 border-primary pl-4">
                                    INTELIGÊNCIA DE PARCERIAS <br />
                                    <span className="text-xs text-gray-400">MONITORANDO 25 FABRICANTES GLOBAIS</span>
                                </p>
                            </div>

                            <div className="w-full md:w-1/2 lg:w-1/3 relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-400 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                <div className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1 flex items-center shadow-lg">
                                    <span className="material-symbols-outlined text-primary mx-3 animate-pulse">radar</span>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        placeholder="BUSCAR: Marca, Produto, Tier..."
                                        className="w-full bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 placeholder-gray-400 font-medium text-sm py-3"
                                    />
                                    {scanning && <span className="text-xs text-primary font-bold animate-pulse mr-3">ESCANEANDO...</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide text-xs">
                            {['Tier S', 'Tier A', 'Tier B', 'Tier C', 'Tier D', 'Todos'].map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => setSelectedTier(tier === 'Todos' ? '' : tier)}
                                    className={`px-4 py-2 border rounded-full font-bold transition-all uppercase whitespace-nowrap ${selectedTier === tier || (selectedTier === '' && tier === 'Todos')
                                        ? 'border-primary bg-primary text-white shadow-md'
                                        : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {tier === 'Todos' ? 'TODOS' : tier}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-20 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredBrands.map(brand => (
                            <div key={brand.id} className="relative group perspective-1000">
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 to-blue-400/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm" />

                                <div className="relative h-full bg-white dark:bg-[#111621] border border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl p-5 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl overflow-hidden flex flex-col justify-between">

                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 font-black text-lg text-gray-400 group-hover:text-primary group-hover:border-primary/50 transition-colors">
                                                {brand.logo}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                                                    {brand.name}
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${brand.tier === 'Tier S' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                                        brand.tier === 'Tier A' ? 'bg-green-100 text-green-700 border-green-200' :
                                                            brand.tier === 'Tier B' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                                brand.tier === 'Tier C' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                                        }`}>
                                                        {brand.tier}
                                                    </span>
                                                </h3>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium mt-0.5">
                                                    <span className="uppercase">{brand.origin}</span>
                                                    <span>•</span>
                                                    <a href={`https://${brand.website}`} target="_blank" rel="noreferrer" className="hover:text-primary truncate max-w-[100px]">
                                                        {brand.website}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-black text-primary">{brand.matchScore}%</div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{brand.description}</p>

                                        {/* Why Contact */}
                                        <div className="bg-primary/5 rounded p-2 border border-primary/10 mb-3">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">💡 Por que contatar:</p>
                                            <p className="text-xs text-primary font-medium leading-tight">{brand.whyContact}</p>
                                        </div>

                                        {/* Produtos */}
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {brand.categories.map(c => (
                                                <span key={c} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] text-gray-700 dark:text-gray-300 font-semibold cursor-default">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Canais de Venda */}
                                        <div className="mb-2">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Canais:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {brand.salesChannels?.slice(0, 3).map(channel => ( // Limit to 3
                                                    <span key={channel} className="text-[10px] text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-700 flex items-center gap-1">
                                                        {channel}
                                                    </span>
                                                ))}
                                                {brand.salesChannels.length > 3 && <span className="text-[10px] text-gray-400">+{brand.salesChannels.length - 3}</span>}
                                            </div>
                                        </div>

                                        {/* Radar */}
                                        {brand.tier !== 'Tier D' && ( // Ocultar radar para tier D para economizar espaço visual se quiser, ou manter
                                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-1 border border-gray-100 dark:border-gray-800 mb-2 h-24 relative opacity-80 hover:opacity-100 transition-opacity">
                                                <RadarChartComponent brand={brand} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Acesso</span>
                                            <span className={`text-[10px] font-bold ${brand.difficulty === 'Fácil' ? 'text-green-600' : brand.difficulty === 'Médio' ? 'text-yellow-600' : 'text-red-500'}`}>
                                                {brand.difficulty.toUpperCase()}
                                            </span>
                                        </div>

                                        {!unlockedContacts.includes(brand.id) ? (
                                            <button
                                                onClick={() => handleUnlock(brand.id)}
                                                disabled={isDecrypting === brand.id}
                                                className={`
                                                    px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-wider transition-all
                                                    ${isDecrypting === brand.id
                                                        ? 'bg-yellow-100 text-yellow-600 cursor-wait'
                                                        : 'bg-primary hover:bg-blue-600 text-white hover:shadow-lg hover:shadow-primary/30'
                                                    }
                                                `}
                                            >
                                                {isDecrypting === brand.id ? '...' : 'DESBLOQUEAR'}
                                            </button>
                                        ) : (
                                            <div className="text-right">
                                                <a href={`mailto:${brand.email}`} className="text-xs font-bold text-primary hover:underline block">
                                                    {brand.email}
                                                </a>
                                                <span className="text-[10px] text-gray-400">{brand.contactMethod}</span>
                                            </div>
                                        )}
                                    </div>

                                    {unlockedContacts.includes(brand.id) && !isDecrypting && isDecrypting !== brand.id && (
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary animate-pulse" />
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
            `}</style>
        </div>
    );
};

export default BrandRadar;
