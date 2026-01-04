
import { Request, Response } from 'express';
import db from '../db';
import { Prisma } from '@prisma/client';

// Helper to determine tier based on social presence and simple heuristics
const determineTier = (text: string): string => {
    let score = 0;
    if (text.includes('instagram.com')) score += 2;
    if (text.includes('youtube.com')) score += 2;
    if (text.includes('linkedin.com')) score += 3; // Corporate usually means bigger budget
    if (text.includes('tiktok.com')) score += 1;

    if (score >= 6) return 'Tier S';
    if (score >= 4) return 'Tier A';
    if (score >= 2) return 'Tier B';
    return 'Tier C';
};

// MOCK DATA FOR SYNC (Copied from Frontend)
const MOCK_BRANDS = [
    // --- TIER S ---
    { name: 'YUNZII', logo: 'YZ', origin: 'China', website: 'yunzii.com', tier: 'Tier S', categories: ['Teclado', 'Desk Setup'], contactMethod: 'Formulário', difficulty: 'Fácil', salesChannels: ['Site Próprio', 'Amazon'], lastActive: 'Ao vivo', matchScore: 98, email: 'marketing@yunzii.com', instagram: '@yunzii_keyboard', youtube: 'Yunzii Official', budget: 45, affinity: 95, description: 'Teclados mecânicos estéticos.', whyContact: 'Programa aberto e responsivo.' },
    { name: 'Razer', logo: 'RZ', origin: 'EUA', website: 'razer.com', tier: 'Tier S', categories: ['Periféricos', 'Laptop'], contactMethod: 'Ambassador', difficulty: 'Difícil', salesChannels: ['Amazon', 'Lojas Globais'], lastActive: 'Hoje', matchScore: 85, email: 'partnerships@razer.com', instagram: '@razer', youtube: 'Razer', budget: 95, affinity: 75, description: 'Lifestyle gamer global.', whyContact: 'Maior ecossistema de afiliados.' },
    { name: 'Logitech G', logo: 'LG', origin: 'Suíça', website: 'logitechg.com', tier: 'Tier S', categories: ['Periféricos'], contactMethod: 'Ambassador', difficulty: 'Difícil', salesChannels: ['Amazon', 'Global'], lastActive: 'Ontem', matchScore: 80, email: 'business@logitech.com', instagram: '@logitechg', youtube: 'Logitech G', budget: 100, affinity: 70, description: 'Padrão da indústria em esports.', whyContact: 'Onipresente e confiável.' },
    { name: 'HyperX', logo: 'HX', origin: 'EUA', website: 'hyperx.com', tier: 'Tier S', categories: ['Headset', 'Periféricos'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon', 'Global'], lastActive: 'Hoje', matchScore: 92, email: 'hyperxsupport@hp.com', instagram: '@hyperxbr', youtube: 'HyperX Brasil', budget: 85, affinity: 90, description: 'Referência absoluta em headsets (Cloud).', whyContact: 'Marca consolidada, excelente suporte.' },
    { name: 'SteelSeries', logo: 'SS', origin: 'Dinamarca', website: 'steelseries.com', tier: 'Tier S', categories: ['Headset', 'Mouse'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Amazon', 'Global'], lastActive: '2d atrás', matchScore: 88, email: 'press@steelseries.com', instagram: '@steelseries', youtube: 'SteelSeries', budget: 90, affinity: 80, description: 'Premium gaming audio & periféricos.', whyContact: 'Forte presença em esports.' },
    { name: 'NVIDIA', logo: 'NV', origin: 'EUA', website: 'nvidia.com', tier: 'Tier S', categories: ['GPU', 'AI'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Global'], lastActive: '3d atrás', matchScore: 99, email: 'pr-latam@nvidia.com', instagram: '@nvidiageforcebr', youtube: 'NVIDIA GeForce Brasil', budget: 100, affinity: 70, description: 'Líder mundial em computação visual.', whyContact: 'Essencial para tech reviewers.' },
    { name: 'Bose', logo: 'BS', origin: 'EUA', website: 'bose.com', tier: 'Tier S', categories: ['Audio', 'ANC'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Amazon', 'Global'], lastActive: '1sem atrás', matchScore: 82, email: 'support@bose.com', instagram: '@bose', youtube: 'Bose', budget: 95, affinity: 75, description: 'Líder em cancelamento de ruído.', whyContact: 'QuietComfort é icônico em torneios.' },
    { name: 'Sony INZONE', logo: 'SN', origin: 'Japão', website: 'sony.com/inzone', tier: 'Tier S', categories: ['Headset', 'Monitor'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Amazon', 'Sony Store'], lastActive: '2d atrás', matchScore: 85, email: 'support@sony.com', budget: 95, affinity: 80, description: 'A aposta gaming da Sony (PS5 oriented).', whyContact: 'Integração perfeita com PS5.' },
    { name: 'Truthear', logo: 'TR', origin: 'China', website: 'shenzhenaudio.com', tier: 'Tier S', categories: ['IEM'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['AliExpress'], lastActive: '10m atrás', matchScore: 97, email: 'support@truthear.com', instagram: '@moondroplab', budget: 40, affinity: 96, description: 'Reis do áudio budget (Zero:Red).', whyContact: 'Hype da comunidade audiófila.' },
    // --- TIER A ---
    { name: 'Corsair', logo: 'CS', origin: 'EUA', website: 'corsair.com', tier: 'Tier A', categories: ['PC Parts', 'Periféricos'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon', 'Kabum'], lastActive: '4h atrás', matchScore: 85, email: 'support@corsair.com', instagram: '@corsair', budget: 90, affinity: 80, description: 'Ecossistema completo iCUE.', whyContact: 'Programa Creator forte.' },
    { name: 'Sennheiser', logo: 'SH', origin: 'Alemanha', website: 'sennheiser.com', tier: 'Tier A', categories: ['Audio Pro'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Amazon'], lastActive: '1d atrás', matchScore: 84, email: 'gaming@sennheiser.com', budget: 90, affinity: 82, description: 'Qualidade de áudio lendária.', whyContact: 'Para quem busca fidelidade extrema.' },
    { name: 'Beyerdynamic', logo: 'BD', origin: 'Alemanha', website: 'beyerdynamic.com', tier: 'Tier A', categories: ['Audio Studio'], contactMethod: 'Email', difficulty: 'Difícil', salesChannels: ['Amazon'], lastActive: '2d atrás', matchScore: 83, email: 'info@beyerdynamic.de', budget: 85, affinity: 80, description: 'Fones de estúdio indestrutíveis (DT 990).', whyContact: 'Favorito de streamers pro.' },
    { name: 'Audio-Technica', logo: 'AT', origin: 'Japão', website: 'audio-technica.com', tier: 'Tier A', categories: ['Microfone', 'Fone'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '5h atrás', matchScore: 82, email: 'support@atus.com', budget: 80, affinity: 85, description: 'Referência em microfones e monitoramento.', whyContact: 'M50x e AT2020 são staples.' },
    { name: 'Alienware', logo: 'AW', origin: 'EUA', website: 'alienware.com', tier: 'Tier A', categories: ['PC', 'Monitor'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Dell', 'Amazon'], lastActive: '1d atrás', matchScore: 80, email: 'alienware_support@dell.com', budget: 95, affinity: 70, description: 'A divisão gaming premium da Dell.', whyContact: 'Design icônico, alto valor.' },
    { name: 'ASUS ROG', logo: 'RG', origin: 'Taiwan', website: 'rog.asus.com', tier: 'Tier A', categories: ['PC Parts', 'Periféricos'], contactMethod: 'Agência', difficulty: 'Difícil', salesChannels: ['Amazon', 'Kabum'], lastActive: '3h atrás', matchScore: 90, email: 'rog@asus.com', budget: 95, affinity: 85, description: 'Republic of Gamers. Topo de linha.', whyContact: 'Marca aspiracional para gamers.' },
    { name: 'MSI', logo: 'MS', origin: 'Taiwan', website: 'msi.com', tier: 'Tier A', categories: ['PC Parts', 'Laptop'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon', 'Terabyte'], lastActive: '4h atrás', matchScore: 86, email: 'gaming@msi.com', budget: 85, affinity: 82, description: 'Dragão vermelho do hardware.', whyContact: 'Forte em componentes e setups.' },
    { name: 'Creative', logo: 'CR', origin: 'Singapura', website: 'creative.com', tier: 'Tier A', categories: ['Placa de Som', 'Audio'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '2d atrás', matchScore: 78, email: 'support@creative.com', budget: 75, affinity: 75, description: 'Sound Blaster. Pioneiros do áudio PC.', whyContact: 'Tecnologia Super X-Fi.' },
    { name: 'Klipsch', logo: 'KP', origin: 'EUA', website: 'klipsch.com', tier: 'Tier A', categories: ['Audio Premium'], contactMethod: 'Email', difficulty: 'Difícil', salesChannels: ['Amazon'], lastActive: '3d atrás', matchScore: 75, email: 'support@klipsch.com', budget: 85, affinity: 70, description: 'Heritage audio desde 1946.', whyContact: 'Som potente e distinto.' },
    { name: 'Lamzu', logo: 'LZ', origin: 'China', website: 'lamzu.com', tier: 'Tier A', categories: ['Mouse'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['MaxGaming'], lastActive: '20m atrás', matchScore: 93, email: 'marketing@lamzu.com', instagram: '@lamzugaming', budget: 60, affinity: 94, description: 'Mouses ultraleves para entusiastas.', whyContact: 'Queridinha dos reviewers.' },
    { name: 'Lian Li', logo: 'LL', origin: 'Taiwan', website: 'lian-li.com', tier: 'Tier A', categories: ['Gabinete', 'Fans'], contactMethod: 'Formulário', difficulty: 'Médio', salesChannels: ['Pichau', 'Terabyte'], lastActive: '1h atrás', matchScore: 89, email: 'collab@lian-li.com', instagram: '@lianlihq', budget: 80, affinity: 88, description: 'O11 Dynamic mudou o mercado.', whyContact: 'Essencial para builds aesthetics.' },
    { name: 'Astro', logo: 'AS', origin: 'EUA', website: 'astrogaming.com', tier: 'Tier A', categories: ['Headset'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '1d atrás', matchScore: 84, email: 'astrosupport@logitech.com', budget: 88, affinity: 80, description: 'A40 e A50 são lendas de conforto.', whyContact: 'Foco total em console gaming.' },
    // --- TIER B ---
    { name: 'Cooler Master', logo: 'CM', origin: 'Taiwan', website: 'coolermaster.com', tier: 'Tier B', categories: ['Cooling', 'Gabinete'], contactMethod: 'Agência', difficulty: 'Médio', salesChannels: ['Amazon', 'Kabum'], lastActive: '5h atrás', matchScore: 82, email: 'support@coolermaster.com', budget: 80, affinity: 78, description: 'Veterana do DIY PC.', whyContact: 'Produtos confiáveis, enorme catálogo.' },
    { name: 'JBL Quantum', logo: 'JBL', origin: 'EUA', website: 'jbl.com', tier: 'Tier B', categories: ['Audio', 'Headset'], contactMethod: 'Agência', difficulty: 'Fácil', salesChannels: ['Global'], lastActive: '6h atrás', matchScore: 88, email: 'support@jbl.com', budget: 85, affinity: 85, description: 'A força da JBL no mundo gamer.', whyContact: 'Marca muito reconhecível.' },
    { name: 'NZXT', logo: 'NZ', origin: 'EUA', website: 'nzxt.com', tier: 'Tier B', categories: ['Gabinete', 'PC'], contactMethod: 'Afiliado', difficulty: 'Médio', salesChannels: ['Kabum'], lastActive: '1d atrás', matchScore: 85, email: 'support@nzxt.com', budget: 82, affinity: 84, description: 'Minimalismo puro. H series.', whyContact: 'Amada por criadores de conteúdo.' },
    { name: 'Thermaltake', logo: 'TT', origin: 'Taiwan', website: 'thermaltake.com', tier: 'Tier B', categories: ['PC Parts'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon'], lastActive: '4h atrás', matchScore: 80, email: 'marketing@thermaltake.com', budget: 75, affinity: 78, description: 'Pioneiros do RGB e cases abertos.', whyContact: 'Muitas opções de modding.' },
    { name: 'Redragon', logo: 'RD', origin: 'China', website: 'redragon.com', tier: 'Tier B', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['AliExpress', 'Amazon'], lastActive: 'Agora', matchScore: 90, email: 'service@redragonzone.com', budget: 50, affinity: 92, description: 'O rei do custo-benefício gamer.', whyContact: 'Entrada perfeita para reviews.' },
    { name: 'Edifier', logo: 'ED', origin: 'China', website: 'edifier.com', tier: 'Tier B', categories: ['Audio'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon', 'Loja Oficial'], lastActive: '2h atrás', matchScore: 86, email: 'service@edifier.com', instagram: '@edifier_brasil', budget: 60, affinity: 85, description: 'Som de alta fidelidade acessível.', whyContact: 'Forte presença no Brasil.' },
    { name: 'Havit', logo: 'HV', origin: 'China', website: 'havit.hk', tier: 'Tier B', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon', 'AliExpress'], lastActive: '1h atrás', matchScore: 89, email: 'business@havit.hk', budget: 40, affinity: 90, description: 'H2002D dominou o mercado budget.', whyContact: 'Fácil de viralizar pelo preço.' },
    { name: 'ROCCAT', logo: 'RO', origin: 'Alemanha', website: 'roccat.com', tier: 'Tier B', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '1d atrás', matchScore: 78, email: 'support@roccat.com', budget: 70, affinity: 75, description: 'Engenharia alemã. Agora parte da Turtle Beach.', whyContact: 'Design único e iluminação AIMO.' },
    { name: 'Fnatic Gear', logo: 'FN', origin: 'UK', website: 'fnatic.com', tier: 'Tier B', categories: ['Esports Gear'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '3h atrás', matchScore: 81, email: 'support@fnatic.com', budget: 75, affinity: 80, description: 'Feito por pros para pros.', whyContact: 'Credibilidade competitiva.' },
    { name: 'Mad Catz', logo: 'MC', origin: 'EUA', website: 'madcatz.com', tier: 'Tier B', categories: ['Mouse', 'Stick'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '4d atrás', matchScore: 70, email: 'support@madcatz.com', budget: 65, affinity: 65, description: 'Mouses modulares R.A.T.', whyContact: 'Visual sci-fi distinto.' },
    // --- TIER C ---
    { name: 'Audeze', logo: 'AZ', origin: 'EUA', website: 'audeze.com', tier: 'Tier C', categories: ['Planar Audio'], contactMethod: 'Email', difficulty: 'Difícil', salesChannels: ['Amazon'], lastActive: '3d atrás', matchScore: 78, email: 'support@audeze.com', budget: 95, affinity: 70, description: 'Planar magnetics para gamers (Maxwell).', whyContact: 'O topo da cadeia alimentar de áudio gamer.' },
    { name: 'KOSS', logo: 'KO', origin: 'EUA', website: 'koss.com', tier: 'Tier C', categories: ['Audio Retro'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon'], lastActive: '1s atrás', matchScore: 80, email: 'info@koss.com', budget: 40, affinity: 85, description: 'Porta Pro é um clássico cult.', whyContact: 'Estética retro em alta.' },
    { name: 'Trust Gaming', logo: 'TG', origin: 'Holanda', website: 'trust.com', tier: 'Tier C', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon', 'Varejo'], lastActive: '4h atrás', matchScore: 75, email: 'info@trust.com', budget: 50, affinity: 70, description: 'Marca europeia sólida e acessível.', whyContact: 'Fácil de achar em varejo físico.' },
    { name: 'Patriot Viper', logo: 'PV', origin: 'EUA', website: 'patriotmemory.com', tier: 'Tier C', categories: ['RAM', 'Periféricos'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '5h atrás', matchScore: 72, email: 'support@patriotmemory.com', budget: 60, affinity: 70, description: 'Memória e SSDs de performance.', whyContact: 'Hardware funcional e rápido.' },
    { name: 'EKSA', logo: 'EK', origin: 'China', website: 'eksa.net', tier: 'Tier C', categories: ['Headset'], contactMethod: 'Afiliado', difficulty: 'Fácil', salesChannels: ['AliExpress'], lastActive: '30m atrás', matchScore: 80, email: 'service@eksa.net', budget: 35, affinity: 82, description: 'Focada em headsets budget.', whyContact: 'Parcerias fáceis com jogos mobile.' },
    { name: 'Fifine', logo: 'FF', origin: 'China', website: 'fifinemicrophone.com', tier: 'Tier C', categories: ['Microfone'], contactMethod: 'Afiliado', difficulty: 'Fácil', salesChannels: ['AliExpress', 'Amazon'], lastActive: '15m atrás', matchScore: 94, email: 'service@fifine.com', instagram: '@fifinemicrophone', budget: 45, affinity: 95, description: 'Melhor microfone de entrada.', whyContact: 'Todo streamer iniciante quer um.' },
    { name: '1MORE', logo: '1M', origin: 'China', website: '1more.com', tier: 'Tier C', categories: ['Fone', 'IEM'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['AliExpress'], lastActive: '2h atrás', matchScore: 82, email: 'service@1more.com', budget: 50, affinity: 80, description: 'Áudio tunado por engenheiros de som.', whyContact: 'Excelente valor pelo preço.' },
    { name: 'V-MODA', logo: 'VM', origin: 'Itália', website: 'v-moda.com', tier: 'Tier C', categories: ['Fone DJ'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '3d atrás', matchScore: 75, email: 'support@v-moda.com', budget: 80, affinity: 70, description: 'Estilo e durabilidade militar.', whyContact: 'Customização de escudos (shields).' },
    { name: 'Poly (Plantronics)', logo: 'PY', origin: 'EUA', website: 'poly.com', tier: 'Tier C', categories: ['Headset Corp'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '5d atrás', matchScore: 65, email: 'support@poly.com', budget: 85, affinity: 60, description: 'Foco corporativo, mas áudio excelente.', whyContact: 'Nicho work-from-home.' },
    // --- TIER D ---
    { name: 'Fortrek', logo: 'FT', origin: 'Brasil', website: 'fortrek.com.br', tier: 'Tier D', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Mercado Livre'], lastActive: '10m atrás', matchScore: 88, email: 'contato@fortrek.com.br', budget: 30, affinity: 85, description: 'Marca BR de entrada muito popular.', whyContact: 'Fácil acesso para micro-influencers.' },
    { name: 'Evolut', logo: 'EV', origin: 'Brasil', website: 'evolut.com.br', tier: 'Tier D', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Revendas BR'], lastActive: '20m atrás', matchScore: 85, email: 'contato@evolut.com.br', budget: 25, affinity: 82, description: 'Gamer de entrada brasileiro.', whyContact: 'Produtos acessíveis, muito LED.' },
    { name: 'Warrior', logo: 'WA', origin: 'Brasil', website: 'gamerwarrior.com.br', tier: 'Tier D', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Varejo BR'], lastActive: '30m atrás', matchScore: 82, email: 'contato@multilaser.com.br', budget: 30, affinity: 80, description: 'Marca gamer da Multilaser.', whyContact: 'Distribuição massiva no Brasil.' },
    { name: 'Dazz', logo: 'DZ', origin: 'Brasil', website: 'dazz.com.br', tier: 'Tier D', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Amazon BR'], lastActive: '1h atrás', matchScore: 83, email: 'sac@dazz.com.br', budget: 35, affinity: 80, description: 'Custo-benefício nacional.', whyContact: 'Bons teclados mecânicos de entrada.' },
    { name: 'Mancer', logo: 'MC', origin: 'Brasil', website: 'pichau.com.br', tier: 'Tier D', categories: ['PC Parts'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Pichau'], lastActive: '5m atrás', matchScore: 88, email: 'contato@mancer.com.br', budget: 40, affinity: 85, description: 'Marca própria da Pichau.', whyContact: 'Hardware barato que funciona.' },
    { name: 'Onikuma', logo: 'OK', origin: 'China', website: 'onikuma.com', tier: 'Tier D', categories: ['Headset'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['AliExpress', 'Shopee'], lastActive: '1h atrás', matchScore: 85, email: 'service@onikuma.com', budget: 25, affinity: 85, description: 'Headsets "chifre" e RGB. Visual agressivo.', whyContact: 'Viraliza no TikTok com visual exótico.' },
    { name: 'Kotion Each', logo: 'KE', origin: 'China', website: 'kotioneach.com', tier: 'Tier D', categories: ['Headset'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['AliExpress'], lastActive: '2h atrás', matchScore: 80, email: 'service@kotioneach.com', budget: 20, affinity: 80, description: 'O mais barato que existe.', whyContact: 'Volume, volume, volume.' },
    { name: 'Sharkoon', logo: 'SK', origin: 'Alemanha', website: 'sharkoon.com', tier: 'Tier D', categories: ['Gabinete', 'Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Kabum'], lastActive: '3h atrás', matchScore: 78, email: 'info@sharkoon.com', budget: 45, affinity: 75, description: 'Marca alemã com preços agressivos.', whyContact: 'Gabinetes com bom airflow.' },
    { name: 'Speedlink', logo: 'SL', origin: 'Alemanha', website: 'speedlink.com', tier: 'Tier D', categories: ['Periféricos'], contactMethod: 'Email', difficulty: 'Fácil', salesChannels: ['Europa'], lastActive: '1d atrás', matchScore: 70, email: 'info@speedlink.com', budget: 35, affinity: 65, description: 'Básico funcional.', whyContact: 'Opção segura de entrada.' },
    { name: 'Skullcandy', logo: 'SC', origin: 'EUA', website: 'skullcandy.com', tier: 'Tier D', categories: ['Fone'], contactMethod: 'Email', difficulty: 'Médio', salesChannels: ['Amazon'], lastActive: '4h atrás', matchScore: 82, email: 'support@skullcandy.com', budget: 50, affinity: 80, description: 'Estilo jovem e bass pesado.', whyContact: 'Apelo visual forte, cores vibrantes.' }
];

export const radarBrandController = {
    // 0. Sync Mocks
    syncMocks: async (req: Request, res: Response) => {
        try {
            let createdCount = 0;
            let updatedCount = 0;

            for (const brand of MOCK_BRANDS) {
                const existing = await db.radarBrand.findFirst({ where: { name: brand.name } });

                // Safe defaults for enums if missing
                const payload = {
                    ...brand,
                    categories: JSON.stringify(brand.categories),
                    salesChannels: JSON.stringify(brand.salesChannels),
                    tier: brand.tier || 'Tier C',
                    difficulty: brand.difficulty || 'Médio',
                    contactMethod: brand.contactMethod || 'Email',
                    matchScore: brand.matchScore || 0,
                    budget: brand.budget || 0,
                    affinity: brand.affinity || 0,
                    lastActive: brand.lastActive || 'N/A',
                    whyContact: brand.whyContact || ''
                };

                if (existing) {
                    await db.radarBrand.update({
                        where: { id: existing.id },
                        data: payload
                    });
                    updatedCount++;
                } else {
                    await db.radarBrand.create({ data: payload });
                    createdCount++;
                }
            }
            res.json({ message: 'Sync completed', created: createdCount, updated: updatedCount });
        } catch (error: any) {
            console.error('Sync Error:', error);
            res.status(500).json({ error: error.message || 'Failed to sync mocks' });
        }
    },

    // 1. List All (Cached/Optimized)
    getAll: async (req: Request, res: Response) => {
        try {
            const brands = await db.radarBrand.findMany({
                orderBy: { name: 'asc' }
            });

            // Parse JSON fields if necessary (Prisma handles JSON, but we used String)
            // But wait, the frontend expects specific enums.

            res.json(brands.map(b => ({
                ...b,
                categories: safeJsonParse(b.categories),
                salesChannels: safeJsonParse(b.salesChannels)
            })));
        } catch (error) {
            console.error('Error fetching brands:', error);
            res.status(500).json({ error: 'Failed to fetch brands' });
        }
    },

    // 2. Create
    create: async (req: Request, res: Response) => {
        try {
            const data = req.body;

            const brand = await db.radarBrand.create({
                data: {
                    ...data,
                    categories: JSON.stringify(data.categories || []),
                    salesChannels: JSON.stringify(data.salesChannels || [])
                }
            });
            res.status(201).json(brand);
        } catch (error) {
            console.error('Error creating brand:', error);
            res.status(500).json({ error: 'Failed to create brand' });
        }
    },

    // 3. Update
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const brand = await db.radarBrand.update({
                where: { id },
                data: {
                    ...data,
                    categories: data.categories ? JSON.stringify(data.categories) : undefined,
                    salesChannels: data.salesChannels ? JSON.stringify(data.salesChannels) : undefined,
                }
            });
            res.json(brand);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update brand' });
        }
    },

    // 4. Delete
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await db.radarBrand.delete({ where: { id } });
            res.json({ message: 'Brand deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete brand' });
        }
    },

    // 5. ANALYZE (The Magic Tool)
    analyze: async (req: Request, res: Response) => {
        try {
            const { url } = req.body;
            if (!url) return res.status(400).json({ error: 'URL is required' });

            // 1. Fetch HTML safely
            // Node 18+ has native fetch. If on older node, might fail, but let's assume modern env.
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url.startsWith('http') ? url : `https://${url}`, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            clearTimeout(timeout);

            if (!response.ok) throw new Error(`External site returned ${response.status}`);

            const html = await response.text();

            // 2. Parse Meta Data (Regex)
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : '';

            // Clean title (remove " | Brand Name" or similar)
            const cleanName = title.split('|')[0].split('-')[0].split(':')[0].trim();

            const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
            const description = descMatch ? descMatch[1].trim() : '';

            // 3. Find Socials
            const instagram = html.match(/instagram\.com\/([a-zA-Z0-9_.]+)/i)?.[1];
            const youtube = html.match(/youtube\.com\/(?:@|c\/|user\/)?([a-zA-Z0-9_.-]+)/i)?.[1];

            // 4. Determine Tier & Metrics (Heuristic)
            const tier = determineTier(html);

            const suggestedData = {
                name: cleanName,
                description: description.substring(0, 150),
                tier,
                instagram: instagram ? `@${instagram}` : undefined,
                youtube: youtube || undefined,
                website: url,
                // Intelligent Randomness for "Radar" visuals if unknown
                matchScore: Math.floor(Math.random() * (99 - 70) + 70),
                budget: Math.floor(Math.random() * (100 - 40) + 40),
                affinity: Math.floor(Math.random() * (95 - 60) + 60),
                difficulty: 'Médio', // Safety default
                origin: 'Global', // Default
                email: 'contact@' + (new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '')),
                logo: cleanName.substring(0, 2).toUpperCase()
            };

            res.json(suggestedData);

        } catch (error: any) {
            console.error('Analyze error:', error);
            res.status(500).json({ error: 'Failed to analyze website. ' + error.message });
        }
    }
};

function safeJsonParse(str: string) {
    try {
        return JSON.parse(str);
    } catch {
        return [];
    }
}
