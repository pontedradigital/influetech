import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// --- Tipos Refinados ---
interface Brand {
    id: string;
    name: string;
    logo: string;
    origin: string; // País de Origem
    website: string;
    tier: 'Micro' | 'Médio' | 'Macro' | 'Todos';
    categories: string[]; // Mouse, Teclado, GPU, etc.
    contactMethod: 'Email' | 'Formulário' | 'Afiliado' | 'Agência';
    difficulty: 'Fácil' | 'Médio' | 'Difícil';
    salesChannels: string[]; // Amazon, Kabum, etc.
    lastActive: string;
    matchScore: number;
    email?: string;
    budget: number;
    affinity: number;
    description: string;
}

// --- Dados de Hardware/Tech (Foco Brasil) ---
const MOCK_BRANDS: Brand[] = [
    {
        id: '1',
        name: 'HyperX',
        logo: 'HX',
        origin: 'EUA',
        website: 'hyperxgaming.com/br',
        tier: 'Macro',
        categories: ['Headset', 'Teclado', 'Mouse', 'Microfone'],
        contactMethod: 'Agência',
        difficulty: 'Médio',
        salesChannels: ['Kabum', 'Amazon', 'Mercado Livre'],
        lastActive: '2 min atrás',
        matchScore: 92,
        email: 'parcerias.br@hyperx.com',
        budget: 85,
        affinity: 90,
        description: 'Referência mundial em headsets e periféricos de alta performance para gamers e criadores.'
    },
    {
        id: '2',
        name: 'Redragon',
        logo: 'RD',
        origin: 'China',
        website: 'redragon.com.br',
        tier: 'Micro',
        categories: ['Teclado', 'Mouse', 'Headset', 'Monitor'],
        contactMethod: 'Afiliado',
        difficulty: 'Fácil',
        salesChannels: ['Terabyte', 'Pichau', 'AliExpress'],
        lastActive: 'Ao vivo agora',
        matchScore: 89,
        email: 'marketing@redragon.com.br',
        budget: 50,
        affinity: 95,
        description: 'Custo-benefício imbatível. A marca favorita de quem está começando no setup gamer.'
    },
    {
        id: '3',
        name: 'Logitech G',
        logo: 'LG',
        origin: 'Suíça',
        website: 'logitechg.com/pt-br',
        tier: 'Macro',
        categories: ['Mouse', 'Teclado', 'Headset', 'Volante'],
        contactMethod: 'Agência',
        difficulty: 'Difícil',
        salesChannels: ['Amazon', 'Kabum', 'Logitech Store'],
        lastActive: '12h atrás',
        matchScore: 75,
        email: 'creators.br@logitech.com',
        budget: 95,
        affinity: 80,
        description: 'Líder em inovação wireless (Lightspeed) e precisão para pro-players.'
    },
    {
        id: '4',
        name: 'Pichau Gaming',
        logo: 'PG',
        origin: 'Brasil',
        website: 'pichau.com.br',
        tier: 'Médio',
        categories: ['Monitor', 'Gabinete', 'Cadeira', 'Periféricos'],
        contactMethod: 'Email',
        difficulty: 'Fácil',
        salesChannels: ['Pichau', 'Amazon', 'Magalu'],
        lastActive: '1h atrás',
        matchScore: 85,
        email: 'parceria@pichau.com.br',
        budget: 60,
        affinity: 88,
        description: 'Marca própria da gigante do hardware, focada em produtos acessíveis para o público BR.'
    },
    {
        id: '5',
        name: 'NVIDIA (GeForce)',
        logo: 'NV',
        origin: 'EUA',
        website: 'nvidia.com/pt-br',
        tier: 'Macro',
        categories: ['Placas de Vídeo (GPU)'],
        contactMethod: 'Agência',
        difficulty: 'Difícil',
        salesChannels: ['Kabum', 'Terabyte', 'Pichau'],
        lastActive: '3d atrás',
        matchScore: 68,
        email: 'pr-latam@nvidia.com',
        budget: 100,
        affinity: 70,
        description: 'A força motriz por trás dos gráficos modernos e IA. Parcerias seletivas.'
    },
    {
        id: '6',
        name: 'Rise Mode',
        logo: 'RM',
        origin: 'Brasil',
        website: 'risemode.com.br',
        tier: 'Micro',
        categories: ['Water Cooler', 'Gabinete', 'Fans', 'Teclado'],
        contactMethod: 'Email',
        difficulty: 'Fácil',
        salesChannels: ['Kabum', 'Amazon', 'Shopee'],
        lastActive: '5 min atrás',
        matchScore: 80,
        email: 'mkt@risemode.com.br',
        budget: 45,
        affinity: 85,
        description: 'Estética gamer agressiva e preços competitivos para setups visuais.'
    },
    {
        id: '7',
        name: 'JBL',
        logo: 'JBL',
        origin: 'EUA',
        website: 'jbl.com.br',
        tier: 'Macro',
        categories: ['Caixas Bluetooth', 'Fone Sem Fio', 'Headset'],
        contactMethod: 'Agência',
        difficulty: 'Médio',
        salesChannels: ['Amazon', 'Magalu', 'Site Oficial'],
        lastActive: '1d atrás',
        matchScore: 78,
        email: 'influenciadores@harman.com',
        budget: 80,
        affinity: 75,
        description: 'Som lendário. Focada em lifestyle e música, mas expandindo forte no gaming (Quantum).'
    },
    {
        id: '8',
        name: 'Kingston / Fury',
        logo: 'KS',
        origin: 'EUA',
        website: 'kingston.com/br',
        tier: 'Médio',
        categories: ['Memória RAM', 'SSD'],
        contactMethod: 'Email',
        difficulty: 'Médio',
        salesChannels: ['Kabum', 'Terabyte', 'Amazon'],
        lastActive: '4h atrás',
        matchScore: 82,
        email: 'br_marketing@kingston.com',
        budget: 70,
        affinity: 80,
        description: 'Sinônimo de memória e armazenamento confiável para alta performance.'
    },
    {
        id: '9',
        name: 'Husky Gaming',
        logo: 'HG',
        origin: 'Brasil',
        website: 'kabum.com.br',
        tier: 'Micro',
        categories: ['Monitor', 'Cadeira', 'Periféricos'],
        contactMethod: 'Email',
        difficulty: 'Fácil',
        salesChannels: ['Kabum'],
        lastActive: '10 min atrás',
        matchScore: 88,
        email: 'mkt.husky@kabum.com.br',
        budget: 55,
        affinity: 90,
        description: 'Marca exclusiva Kabum! focada em trazer o melhor do pro-player para todos.'
    }
];

// --- Componentes ---



const RadarChartComponent = ({ brand }: { brand: Brand }) => {
    const data = [
        { subject: 'Verba', A: brand.budget, fullMark: 100 },
        { subject: 'Afinidade', A: brand.affinity, fullMark: 100 },
        { subject: 'Facilidade', A: brand.difficulty === 'Fácil' ? 90 : brand.difficulty === 'Médio' ? 50 : 20, fullMark: 100 },
        { subject: 'Alcance', A: brand.tier === 'Macro' ? 100 : brand.tier === 'Médio' ? 60 : 30, fullMark: 100 },
        { subject: 'Hype', A: Math.random() * 40 + 60, fullMark: 100 },
    ];

    return (
        <div className="h-48 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
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
                                    Radar de Marcas <span className="text-primary text-lg align-top">/// HARDWARE</span>
                                </h1>
                                <p className="text-gray-500 font-medium text-sm border-l-4 border-primary pl-4">
                                    INTELIGÊNCIA DE MERCADO TECH <br />
                                    <span className="text-xs text-gray-400">MONITORANDO FABRICANTES & VAREJO BR</span>
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
                                        placeholder="BUSCAR: GPU, Teclado, Marca, Loja..."
                                        className="w-full bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 placeholder-gray-400 font-medium text-sm py-3"
                                    />
                                    {scanning && <span className="text-xs text-primary font-bold animate-pulse mr-3">ESCANEANDO...</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide text-xs">
                            {['Micro', 'Médio', 'Macro', 'Todos'].map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => setSelectedTier(tier === 'Todos' ? '' : tier)}
                                    className={`px-4 py-2 border rounded-full font-bold transition-all uppercase ${selectedTier === tier || (selectedTier === '' && tier === 'Todos')
                                        ? 'border-primary bg-primary text-white shadow-md'
                                        : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {tier === 'Todos' ? 'TODOS OS NÍVEIS' : `NÍVEL ${tier.toUpperCase()}`}
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

                                <div className="relative h-full bg-white dark:bg-[#111621] border border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl p-6 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-2xl overflow-hidden flex flex-col justify-between">

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 font-black text-xl text-gray-400 group-hover:text-primary group-hover:border-primary/50 transition-colors">
                                                {brand.logo}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                                                    {brand.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-1">
                                                    <span className="uppercase">{brand.origin}</span>
                                                    <span>•</span>
                                                    <a href={`https://${brand.website}`} target="_blank" rel="noreferrer" className="hover:text-primary truncate max-w-[120px]">
                                                        {brand.website}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-primary">{brand.matchScore}%</div>
                                            <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Match</div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">{brand.description}</p>

                                        {/* Produtos */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {brand.categories.map(c => (
                                                <span key={c} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 font-semibold cursor-default">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Canais de Venda */}
                                        <div className="mb-4">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Canais de Venda (Brasil)</p>
                                            <div className="flex flex-wrap gap-2">
                                                {brand.salesChannels?.map(channel => (
                                                    <span key={channel} className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-100 dark:border-gray-700 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[10px]">shopping_cart</span>
                                                        {channel}
                                                    </span>
                                                )) || <span className="text-xs text-gray-400">Site Próprio</span>}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-2 border border-gray-100 dark:border-gray-800 mb-4 h-32 relative group-hover:border-primary/20 transition-colors">
                                            <div className="absolute top-2 left-2 text-[10px] text-gray-400 font-bold">ANÁLISE</div>
                                            <RadarChartComponent brand={brand} />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Acesso</span>
                                            <span className={`text-xs font-bold ${brand.difficulty === 'Fácil' ? 'text-green-600' : brand.difficulty === 'Médio' ? 'text-yellow-600' : 'text-red-500'}`}>
                                                {brand.difficulty}
                                            </span>
                                        </div>

                                        {!unlockedContacts.includes(brand.id) ? (
                                            <button
                                                onClick={() => handleUnlock(brand.id)}
                                                disabled={isDecrypting === brand.id}
                                                className={`
                                                    px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all
                                                    ${isDecrypting === brand.id
                                                        ? 'bg-yellow-100 text-yellow-600 cursor-wait'
                                                        : 'bg-primary hover:bg-blue-600 text-white hover:shadow-lg hover:shadow-primary/30'
                                                    }
                                                `}
                                            >
                                                {isDecrypting === brand.id ? '...' : 'VER CONTATO'}
                                            </button>
                                        ) : (
                                            <div className="text-right">
                                                <a href={`mailto:${brand.email}`} className="text-xs font-bold text-primary hover:underline block">
                                                    {brand.email}
                                                </a>
                                                <span className="text-[10px] text-gray-400">Clique para enviar</span>
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
