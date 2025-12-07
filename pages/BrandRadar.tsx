import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface Brand {
    id: string;
    name: string;
    logo: string;
    origin: string;
    website: string;
    tier: 'Tier S' | 'Tier A' | 'Tier B' | 'Tier C' | 'Tier D';
    categories: string[];
    contactMethod: 'Email' | 'Formulário' | 'Afiliado' | 'Agência' | 'Ambassador';
    difficulty: 'Fácil' | 'Médio' | 'Difícil';
    salesChannels: string[];
    lastActive: string;
    matchScore: number;
    email?: string;
    budget: number;
    affinity: number;
    description: string;
    whyContact: string;
}

// === MEGA LISTA UNIFICADA (100+ MARCAS) ===
const MOCK_BRANDS: Brand[] = [
    // --- TIER S: GIGANTES GLOBAIS & HYPE (Tier 1 do arquivo + Existentes) ---
    { id: '1', name: 'YUNZII', logo: 'YZ', origin: 'China', website: 'yunzii.com', tier: 'Tier S', categories: ['Teclado', 'Desk Setup'], contactMethod: 'Formulário', difficulty: 'Fácil', salesChannels: ['Site Próprio', 'Amazon'], lastActive: 'Ao vivo', matchScore: 98, email: 'marketing@yunzii.com', budget: 45, affinity: 95, description: 'Teclados mecânicos estéticos.', whyContact: 'Programa aberto e responsivo.' },
    { id: '11', name: 'Razer', logo: 'RZ', origin: 'EUA/Singapura', website: 'razer.com', tier: 'Tier S', categories: ['Periféricos', 'Laptop'], contactMethod: 'Ambassador', difficulty: 'Difícil', salesChannels: ['Amazon', 'Lojas Globais'], lastActive: 'Hoje', matchScore: 85, email: 'partnerships@razer.com', budget: 95, affinity: 75, description: 'Lifestyle gamer global.', whyContact: 'Maior ecossistema de afiliados.' },
    { id: '12', name: 'Logitech G', logo: 'LG', origin: 'Suíça', website: 'logitechg.com', tier: 'Tier S', categories: ['Periféricos'], contactMethod: 'Ambassador', difficulty: 'Difícil', salesChannels: ['Amazon', 'Global'], lastActive: 'Ontem', matchScore: 80, email: 'business@logitech.com', budget: 100, affinity: 70, description: 'Padrão da indústria em esports.', whyContact: 'Onipresente e confiável.' },
    { id: '26', name: 'HyperX', logo: 'HX', origin: 'EUA', website: 'hyperx.com', tier: 'Tier S', categories: ['Headset', 'Periféricos'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon', 'Global'], lastActive: 'Hoje', matchScore: 92, email: 'hyperxsupport@hp.com', budget: 85, affinity: 90, description: 'Referência absoluta em headsets (Cloud).', whyContact: 'Marca consolidada, excelente suporte.' },
    { id: '63', name: 'SteelSeries', logo: 'SS', origin: 'Dinamarca', website: 'steelseries.com', tier: 'Tier S', categories: ['Headset', 'Mouse'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Amazon', 'Global'], lastActive: '2d atrás', matchScore: 88, email: 'press@steelseries.com', budget: 90, affinity: 80, description: 'Premium gaming audio & periféricos.', whyContact: 'Forte presença em esports.' },
    { id: '28', name: 'NVIDIA', logo: 'NV', origin: 'EUA', website: 'nvidia.com', tier: 'Tier S', categories: ['GPU', 'AI'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Global'], lastActive: '3d atrás', matchScore: 99, email: 'pr-latam@nvidia.com', budget: 100, affinity: 70, description: 'Líder mundial em computação visual.', whyContact: 'Essencial para tech reviewers.' },
    { id: '253', name: 'Bose', logo: 'BS', origin: 'EUA', website: 'bose.com', tier: 'Tier S', categories: ['Audio', 'ANC'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Amazon', 'Global'], lastActive: '1sem atrás', matchScore: 82, email: 'support@bose.com', budget: 95, affinity: 75, description: 'Líder em cancelamento de ruído.', whyContact: 'QuietComfort é icônico em torneios.' },
    { id: '263', name: 'Sony INZONE', logo: 'SN', origin: 'Japão', website: 'sony.com/inzone', tier: 'Tier S', categories: ['Headset', 'Monitor'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Amazon', 'Sony Store'], lastActive: '2d atrás', matchScore: 85, email: 'support@sony.com', budget: 95, affinity: 80, description: 'A aposta gaming da Sony (PS5 oriented).', whyContact: 'Integração perfeita com PS5.' },
    { id: '101', name: 'Truthear', logo: 'TR', origin: 'China', website: 'shenzhenaudio.com', tier: 'Tier S', categories: ['IEM'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['AliExpress'], lastActive: '10m atrás', matchScore: 97, email: 'support@truthear.com', budget: 40, affinity: 96, description: 'Reis do áudio budget (Zero:Red).', whyContact: 'Hype da comunidade audiófila.' },

    // --- TIER A: PREMIUM & ALTA PERFORMANCE (Tier 1/2) ---
    { id: '73', name: 'Corsair', logo: 'CS', origin: 'EUA', website: 'corsair.com', tier: 'Tier A', categories: ['PC Parts', 'Periféricos'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon', 'Kabum'], lastActive: '4h atrás', matchScore: 85, email: 'support@corsair.com', budget: 90, affinity: 80, description: 'Ecossistema completo iCUE.', whyContact: 'Programa Creator forte.' },
    { id: '143', name: 'Sennheiser', logo: 'SH', origin: 'Alemanha', website: 'sennheiser.com', tier: 'Tier A', categories: ['Audio Pro'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Amazon'], lastActive: '1d atrás', matchScore: 84, email: 'gaming@sennheiser.com', budget: 90, affinity: 82, description: 'Qualidade de áudio lendária.', whyContact: 'Para quem busca fidelidade extrema.' },
    { id: '153', name: 'Beyerdynamic', logo: 'BD', origin: 'Alemanha', website: 'beyerdynamic.com', tier: 'Tier A', categories: ['Audio Studio'], contactMethod: 'Email', difficulty: 'Difícil', salesChannels: ['Amazon'], lastActive: '2d atrás', matchScore: 83, email: 'info@beyerdynamic.de', budget: 85, affinity: 80, description: 'Fones de estúdio indestrutíveis (DT 990).', whyContact: 'Favorito de streamers pro.' },
    { id: '163', name: 'Audio-Technica', logo: 'AT', origin: 'Japão', website: 'audio-technica.com', tier: 'Tier A', categories: ['Microfone', 'Fone'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '5h atrás', matchScore: 82, email: 'support@atus.com', budget: 80, affinity: 85, description: 'Referência em microfones e monitoramento.', whyContact: 'M50x e AT2020 são staples.' },
    { id: '183', name: 'Alienware', logo: 'AW', origin: 'EUA', website: 'alienware.com', tier: 'Tier A', categories: ['PC', 'Monitor'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Dell', 'Amazon'], lastActive: '1d atrás', matchScore: 80, email: 'alienware_support@dell.com', budget: 95, affinity: 70, description: 'A divisão gaming premium da Dell.', whyContact: 'Design icônico, alto valor.' },
    { id: '193', name: 'ASUS ROG', logo: 'RG', origin: 'Taiwan', website: 'rog.asus.com', tier: 'Tier A', categories: ['PC Parts', 'Periféricos'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Amazon', 'Kabum'], lastActive: '3h atrás', matchScore: 90, email: 'rog@asus.com', budget: 95, affinity: 85, description: 'Republic of Gamers. Topo de linha.', whyContact: 'Marca aspiracional para gamers.' },
    { id: '203', name: 'MSI', logo: 'MS', origin: 'Taiwan', website: 'msi.com', tier: 'Tier A', categories: ['PC Parts', 'Laptop'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon', 'Terabyte'], lastActive: '4h atrás', matchScore: 86, email: 'gaming@msi.com', budget: 85, affinity: 82, description: 'Dragão vermelho do hardware.', whyContact: 'Forte em componentes e setups.' },
    { id: '343', name: 'Creative', logo: 'CR', origin: 'Singapura', website: 'creative.com', tier: 'Tier A', categories: ['Placa de Som', 'Audio'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '2d atrás', matchScore: 78, email: 'support@creative.com', budget: 75, affinity: 75, description: 'Sound Blaster. Pioneiros do áudio PC.', whyContact: 'Tecnologia Super X-Fi.' },
    { id: '373', name: 'Klipsch', logo: 'KP', origin: 'EUA', website: 'klipsch.com', tier: 'Tier A', categories: ['Audio Premium'], contactMethod: 'Email', difficulty: 'Difícil', salesChannels: ['Amazon'], lastActive: '3d atrás', matchScore: 75, email: 'support@klipsch.com', budget: 85, affinity: 70, description: 'Heritage audio desde 1946.', whyContact: 'Som potente e distinto.' },
    { id: '107', name: 'Lamzu', logo: 'LZ', origin: 'China', website: 'lamzu.com', tier: 'Tier A', categories: ['Mouse'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['MaxGaming'], lastActive: '20m atrás', matchScore: 93, email: 'marketing@lamzu.com', budget: 60, affinity: 94, description: 'Mouses ultraleves para entusiastas.', whyContact: 'Queridinha dos reviewers.' },
    { id: '110', name: 'Lian Li', logo: 'LL', origin: 'Taiwan', website: 'lian-li.com', tier: 'Tier A', categories: ['Gabinete', 'Fans'], contactMethod: 'Formulário', difficulty: 'Médio', salesChannels: ['Pichau', 'Terabyte'], lastActive: '1h atrás', matchScore: 89, email: 'collab@lian-li.com', budget: 80, affinity: 88, description: 'O11 Dynamic mudou o mercado.', whyContact: 'Essencial para builds aesthetics.' },
    { id: '92', name: 'Astro', logo: 'AS', origin: 'EUA', website: 'astrogaming.com', tier: 'Tier A', categories: ['Headset'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '1d atrás', matchScore: 84, email: 'astrosupport@logitech.com', budget: 88, affinity: 80, description: 'A40 e A50 são lendas de conforto.', whyContact: 'Foco total em console gaming.' },

    // --- TIER B: CONSOLIDADAS & MARKET LEADERS (Tier 2 do arquivo) ---
    { id: '213', name: 'Cooler Master', logo: 'CM', origin: 'Taiwan', website: 'coolermaster.com', tier: 'Tier B', categories: ['Cooling', 'Gabinete'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon', 'Kabum'], lastActive: '5h atrás', matchScore: 82, email: 'support@coolermaster.com', budget: 80, affinity: 78, description: 'Veterana do DIY PC.', whyContact: 'Produtos confiáveis, enorme catálogo.' },
    { id: '103', name: 'JBL Quantum', logo: 'JBL', origin: 'EUA', website: 'jbl.com', tier: 'Tier B', categories: ['Audio', 'Headset'], contactMethod: 'Agência', difficulty: 'Fácil', salesChannels: ['Global'], lastActive: '6h atrás', matchScore: 88, email: 'support@jbl.com', budget: 85, affinity: 85, description: 'A força da JBL no mundo gamer.', whyContact: 'Marca muito reconhecível.' },
    { id: '283', name: 'NZXT', logo: 'NZ', origin: 'EUA', website: 'nzxt.com', tier: 'Tier B', categories: ['Gabinete', 'PC'], contactMethod: 'Afiliado', difficulty: 'Médio', salesChannels: ['Kabum'], lastActive: '1d atrás', matchScore: 85, email: 'support@nzxt.com', budget: 82, affinity: 84, description: 'Minimalismo puro. H series.', whyContact: 'Amada por criadores de conteúdo.' },
    { id: '223', name: 'Thermaltake', logo: 'TT', origin: 'Taiwan', website: 'thermaltake.com', tier: 'Tier B', categories: ['PC Parts'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon'], lastActive: '4h atrás', matchScore: 80, email: 'marketing@thermaltake.com', budget: 75, affinity: 78, description: 'Pioneiros do RGB e cases abertos.', whyContact: 'Muitas opções de modding.' },
    { id: '113', name: 'Redragon', logo: 'RD', origin: 'China', website: 'redragon.com', tier: 'Tier B', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['AliExpress', 'Amazon'], lastActive: 'Agora', matchScore: 90, email: 'service@redragonzone.com', budget: 50, affinity: 92, description: 'O rei do custo-benefício gamer.', whyContact: 'Entrada perfeita para reviews.' },
    { id: '463', name: 'Edifier', logo: 'ED', origin: 'China', website: 'edifier.com', tier: 'Tier B', categories: ['Audio'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon', 'Loja Oficial'], lastActive: '2h atrás', matchScore: 86, email: 'service@edifier.com', budget: 60, affinity: 85, description: 'Som de alta fidelidade acessível.', whyContact: 'Forte presença no Brasil.' },
    { id: '133', name: 'Havit', logo: 'HV', origin: 'China', website: 'havit.hk', tier: 'Tier B', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon', 'AliExpress'], lastActive: '1h atrás', matchScore: 89, email: 'business@havit.hk', budget: 40, affinity: 90, description: 'H2002D dominou o mercado budget.', whyContact: 'Fácil de viralizar pelo preço.' },
    { id: '173', name: 'ROCCAT', logo: 'RO', origin: 'Alemanha', website: 'roccat.com', tier: 'Tier B', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '1d atrás', matchScore: 78, email: 'support@roccat.com', budget: 70, affinity: 75, description: 'Engenharia alemã. Agora parte da Turtle Beach.', whyContact: 'Design único e iluminação AIMO.' },
    { id: '273', name: 'Fnatic Gear', logo: 'FN', origin: 'UK', website: 'fnatic.com', tier: 'Tier B', categories: ['Esports Gear'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '3h atrás', matchScore: 81, email: 'support@fnatic.com', budget: 75, affinity: 80, description: 'Feito por pros para pros.', whyContact: 'Credibilidade competitiva.' },
    { id: '433', name: 'Mad Catz', logo: 'MC', origin: 'EUA', website: 'madcatz.com', tier: 'Tier B', categories: ['Mouse', 'Stick'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '4d atrás', matchScore: 70, email: 'support@madcatz.com', budget: 65, affinity: 65, description: 'Mouses modulares R.A.T.', whyContact: 'Visual sci-fi distinto.' },

    // --- TIER C: NICHO, ESPECIALISTAS & EMERGENTES (Tier 2/3) ---
    { id: '243', name: 'Audeze', logo: 'AZ', origin: 'EUA', website: 'audeze.com', tier: 'Tier C', categories: ['Planar Audio'], contactMethod: 'Email', difficulty: 'Difícil', salesChannels: ['Amazon'], lastActive: '3d atrás', matchScore: 78, email: 'support@audeze.com', budget: 95, affinity: 70, description: 'Planar magnetics para gamers (Maxwell).', whyContact: 'O topo da cadeia alimentar de áudio gamer.' },
    { id: '363', name: 'KOSS', logo: 'KO', origin: 'EUA', website: 'koss.com', tier: 'Tier C', categories: ['Audio Retro'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon'], lastActive: '1s atrás', matchScore: 80, email: 'info@koss.com', budget: 40, affinity: 85, description: 'Porta Pro é um clássico cult.', whyContact: 'Estética retro em alta.' },
    { id: '313', name: 'Trust Gaming', logo: 'TG', origin: 'Holanda', website: 'trust.com', tier: 'Tier C', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon', 'Varejo'], lastActive: '4h atrás', matchScore: 75, email: 'info@trust.com', budget: 50, affinity: 70, description: 'Marca europeia sólida e acessível.', whyContact: 'Fácil de achar em varejo físico.' },
    { id: '353', name: 'Patriot Viper', logo: 'PV', origin: 'EUA', website: 'patriotmemory.com', tier: 'Tier C', categories: ['RAM', 'Periféricos'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '5h atrás', matchScore: 72, email: 'support@patriotmemory.com', budget: 60, affinity: 70, description: 'Memória e SSDs de performance.', whyContact: 'Hardware funcional e rápido.' },
    { id: '233', name: 'EKSA', logo: 'EK', origin: 'China', website: 'eksa.net', tier: 'Tier C', categories: ['Headset'], contactMethod: 'Afiliado', difficulty: 'Fácil', salesChannels: ['AliExpress'], lastActive: '30m atrás', matchScore: 80, email: 'service@eksa.net', budget: 35, affinity: 82, description: 'Focada em headsets budget.', whyContact: 'Parcerias fáceis com jogos mobile.' },
    { id: '523', name: 'Fifine', logo: 'FF', origin: 'China', website: 'fifinemicrophone.com', tier: 'Tier C', categories: ['Microfone'], contactMethod: 'Afiliado', difficulty: 'Fácil', salesChannels: ['AliExpress', 'Amazon'], lastActive: '15m atrás', matchScore: 94, email: 'service@fifine.com', budget: 45, affinity: 95, description: 'Melhor microfone de entrada.', whyContact: 'Todo streamer iniciante quer um.' },
    { id: '453', name: '1MORE', logo: '1M', origin: 'China', website: '1more.com', tier: 'Tier C', categories: ['Fone', 'IEM'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['AliExpress'], lastActive: '2h atrás', matchScore: 82, email: 'service@1more.com', budget: 50, affinity: 80, description: 'Áudio tunado por engenheiros de som.', whyContact: 'Excelente valor pelo preço.' },
    { id: '423', name: 'V-MODA', logo: 'VM', origin: 'Itália', website: 'v-moda.com', tier: 'Tier C', categories: ['Fone DJ'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '3d atrás', matchScore: 75, email: 'support@v-moda.com', budget: 80, affinity: 70, description: 'Estilo e durabilidade militar.', whyContact: 'Customização de escudos (shields).' },
    { id: '443', name: 'Poly (Plantronics)', logo: 'PY', origin: 'EUA', website: 'poly.com', tier: 'Tier C', categories: ['Headset Corp'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '5d atrás', matchScore: 65, email: 'support@poly.com', budget: 85, affinity: 60, description: 'Foco corporativo, mas áudio excelente.', whyContact: 'Nicho work-from-home.' },

    // --- TIER D: BUDGET, LOCAL & ENTRADA (Tier 3 / Nacional) ---
    { id: '123', name: 'Fortrek', logo: 'FT', origin: 'Brasil', website: 'fortrek.com.br', tier: 'Tier D', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Mercado Livre'], lastActive: '10m atrás', matchScore: 88, email: 'contato@fortrek.com.br', budget: 30, affinity: 85, description: 'Marca BR de entrada muito popular.', whyContact: 'Fácil acesso para micro-influencers.' },
    { id: '393', name: 'Evolut', logo: 'EV', origin: 'Brasil', website: 'evolut.com.br', tier: 'Tier D', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Revendas BR'], lastActive: '20m atrás', matchScore: 85, email: 'contato@evolut.com.br', budget: 25, affinity: 82, description: 'Gamer de entrada brasileiro.', whyContact: 'Produtos acessíveis, muito LED.' },
    { id: '403', name: 'Warrior', logo: 'WA', origin: 'Brasil', website: 'gamerwarrior.com.br', tier: 'Tier D', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Varejo BR'], lastActive: '30m atrás', matchScore: 82, email: 'contato@multilaser.com.br', budget: 30, affinity: 80, description: 'Marca gamer da Multilaser.', whyContact: 'Distribuição massiva no Brasil.' },
    { id: '413', name: 'Dazz', logo: 'DZ', origin: 'Brasil', website: 'dazz.com.br', tier: 'Tier D', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon BR'], lastActive: '1h atrás', matchScore: 83, email: 'sac@dazz.com.br', budget: 35, affinity: 80, description: 'Custo-benefício nacional.', whyContact: 'Bons teclados mecânicos de entrada.' },
    { id: '135', name: 'Mancer', logo: 'MC', origin: 'Brasil', website: 'pichau.com.br', tier: 'Tier D', categories: ['PC Parts'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Pichau'], lastActive: '5m atrás', matchScore: 88, email: 'contato@mancer.com.br', budget: 40, affinity: 85, description: 'Marca própria da Pichau.', whyContact: 'Hardware barato que funciona.' },
    { id: '293', name: 'Onikuma', logo: 'OK', origin: 'China', website: 'onikuma.com', tier: 'Tier D', categories: ['Headset'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['AliExpress', 'Shopee'], lastActive: '1h atrás', matchScore: 85, email: 'service@onikuma.com', budget: 25, affinity: 85, description: 'Headsets "chifre" e RGB. Visual agressivo.', whyContact: 'Viraliza no TikTok com visual exótico.' },
    { id: '303', name: 'Kotion Each', logo: 'KE', origin: 'China', website: 'kotioneach.com', tier: 'Tier D', categories: ['Headset'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['AliExpress'], lastActive: '2h atrás', matchScore: 80, email: 'service@kotioneach.com', budget: 20, affinity: 80, description: 'O mais barato que existe.', whyContact: 'Volume, volume, volume.' },
    { id: '333', name: 'Sharkoon', logo: 'SK', origin: 'Alemanha', website: 'sharkoon.com', tier: 'Tier D', categories: ['Gabinete', 'Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Kabum'], lastActive: '3h atrás', matchScore: 78, email: 'info@sharkoon.com', budget: 45, affinity: 75, description: 'Marca alemã com preços agressivos.', whyContact: 'Gabinetes com bom airflow.' },
    { id: '323', name: 'Speedlink', logo: 'SL', origin: 'Alemanha', website: 'speedlink.com', tier: 'Tier D', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Europa'], lastActive: '1d atrás', matchScore: 70, email: 'info@speedlink.com', budget: 35, affinity: 65, description: 'Básico funcional.', whyContact: 'Opção segura de entrada.' },
    { id: '383', name: 'Skullcandy', logo: 'SC', origin: 'EUA', website: 'skullcandy.com', tier: 'Tier D', categories: ['Fone'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '4h atrás', matchScore: 82, email: 'support@skullcandy.com', budget: 50, affinity: 80, description: 'Estilo jovem e bass pesado.', whyContact: 'Apelo visual forte, cores vibrantes.' }
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
                    <Radar name={brand.name} dataKey="A" stroke="#2563eb" strokeWidth={2} fill="#3b82f6" fillOpacity={0.2} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

const BrandRadar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTier, setSelectedTier] = useState<string>(''); // Vazio = Mostrar Todos (Agrupados)
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

    const handleUnlock = (id: string) => {
        setIsDecrypting(id);
        setTimeout(() => {
            setUnlockedContacts(prev => [...prev, id]);
            setIsDecrypting(null);
        }, 1500);
    };

    // Filter Logic
    const filteredBrandsList = brands.filter(b =>
        (searchTerm === '' || b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.categories.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (selectedTier === '' || b.tier === selectedTier)
    );

    // Grouping Logic for "Todos" View
    const getBrandsByTier = (tier: string) => {
        return filteredBrandsList.filter(b => b.tier === tier);
    };

    const tiers = ['Tier S', 'Tier A', 'Tier B', 'Tier C', 'Tier D'];
    const activeTiers = selectedTier ? [selectedTier] : tiers;

    return (
        <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 font-sans overflow-hidden relative">
            <div className="flex flex-col h-screen">

                {/* Header */}
                <div className="p-6 md:p-8 flex-shrink-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10 sticky top-0 border-b border-gray-200 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter uppercase">
                                    Radar <span className="text-primary">/// 100+</span>
                                </h1>
                                <p className="text-gray-500 font-medium text-sm border-l-4 border-primary pl-4">
                                    DIRETÓRIO MESTRE DE FABRICANTES <br />
                                    <span className="text-xs text-gray-400">MONITORANDO {brands.length} MARCAS GLOBAIS</span>
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
                                        placeholder="Pesquisar..."
                                        className="w-full bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 placeholder-gray-400 font-medium text-sm py-3"
                                    />
                                    {scanning && <span className="text-xs text-primary font-bold animate-pulse mr-3">...</span>}
                                </div>
                            </div>
                        </div>

                        {/* Tier Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide text-xs">
                            <button
                                onClick={() => setSelectedTier('')}
                                className={`px-5 py-2.5 border rounded-xl font-bold transition-all uppercase whitespace-nowrap ${selectedTier === ''
                                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                    : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                VISÃO GERAL (TODOS)
                            </button>
                            {tiers.map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => setSelectedTier(tier)}
                                    className={`px-4 py-2 border rounded-xl font-bold transition-all uppercase whitespace-nowrap ${selectedTier === tier
                                        ? tier === 'Tier S' ? 'border-purple-500 bg-purple-500 text-white shadow-lg shadow-purple-500/20' :
                                            tier === 'Tier A' ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/20' :
                                                tier === 'Tier B' ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20' :
                                                    tier === 'Tier C' ? 'border-yellow-500 bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' :
                                                        'border-gray-500 bg-gray-500 text-white shadow-lg'
                                        : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {tier}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feed Content (Grouped Sections) */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-32 pt-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto space-y-16">

                        {activeTiers.map((tier) => {
                            const tierBrands = getBrandsByTier(tier);
                            if (tierBrands.length === 0) return null;

                            return (
                                <section key={tier} className="relative">
                                    {/* Section Header */}
                                    <div className="sticky top-0 z-0 flex items-center gap-4 mb-6">
                                        <div className={`px-4 py-1 rounded text-sm font-black uppercase tracking-widest
                                            ${tier === 'Tier S' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                                tier === 'Tier A' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                                    tier === 'Tier B' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        tier === 'Tier C' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}
                                        `}>
                                            {tier}
                                        </div>
                                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
                                        <span className="text-xs font-bold text-gray-400">{tierBrands.length} MARCAS</span>
                                    </div>

                                    {/* Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {tierBrands.map(brand => (
                                            <div key={brand.id} className="relative group perspective-1000">
                                                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 to-blue-400/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm" />

                                                <div className="relative h-full bg-white dark:bg-[#111621] border border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl p-5 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl overflow-hidden flex flex-col justify-between">

                                                    {/* Card Header */}
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 font-black text-lg text-gray-400 group-hover:text-primary group-hover:border-primary/50 transition-colors">
                                                                {brand.logo}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                                                                    {brand.name}
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

                                                    {/* Card Body */}
                                                    <div className="mb-3">
                                                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2 h-8">{brand.description}</p>

                                                        {/* Why Contact */}
                                                        <div className="bg-primary/5 rounded p-2 border border-primary/10 mb-3 h-14 overflow-hidden">
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">💡 Por que contatar:</p>
                                                            <p className="text-xs text-primary font-medium leading-tight line-clamp-2">{brand.whyContact}</p>
                                                        </div>

                                                        {/* Categories */}
                                                        <div className="flex flex-wrap gap-1 mb-3">
                                                            {brand.categories.slice(0, 3).map(c => (
                                                                <span key={c} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] text-gray-700 dark:text-gray-300 font-semibold cursor-default">
                                                                    {c}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* Radar Chart (Hidden for Tier D to save space, optional) */}
                                                        {brand.tier !== 'Tier D' && (
                                                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-1 border border-gray-100 dark:border-gray-800 mb-2 h-24 relative opacity-80 hover:opacity-100 transition-opacity">
                                                                <RadarChartComponent brand={brand} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Card Footer */}
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
                                                                <a href={`mailto:${brand.email}`} className="text-xs font-bold text-primary hover:underline block truncate max-w-[120px]">
                                                                    {brand.email}
                                                                </a>
                                                                <span className="text-[10px] text-gray-400">{brand.contactMethod}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Progress Bar Animation */}
                                                    {unlockedContacts.includes(brand.id) && !isDecrypting && isDecrypting !== brand.id && (
                                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary animate-pulse" />
                                                    )}

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}

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
