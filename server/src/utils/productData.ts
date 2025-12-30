export interface ProductTemplate {
    product_name: string;
    category: string;
    platform: 'aliexpress' | 'temu' | 'shein' | 'amazon' | 'shopee';
    search_query: string; // Query for the search URL
    keywords: string[];
    description: string;
    image_slug: string; // For placeholder image text
    estimated_min_price?: number; // Low end estimate in BRL
    estimated_max_price?: number; // High end estimate in BRL
}

// Categories from AffiliateProductModal:
// Cadeiras, Caixa de Som, Celulares, Controles, Hardware, Headset, 
// Jogos, Kit mouse + Teclado, Microfones, Mochilas, Monitores, 
// Mouse, Mousepad, Notebook, Outros/Diversos, Setup Completo, Teclado

export const productTemplates: ProductTemplate[] = [
    // AliExpress (Tech/Gaming/Setup Focus)
    {
        product_name: 'Headset Gamer 7.1 Surround',
        category: 'Headset',
        platform: 'aliexpress',
        search_query: 'Gaming Headset 7.1 Surround',
        keywords: ['headset', 'gamer', '7.1', 'audio', 'usb'],
        description: 'Headset com som surround 7.1 virtual, microfone com cancelamento de ruído e RGB.',
        image_slug: 'Headset+Gamer',
        estimated_min_price: 150,
        estimated_max_price: 350
    },
    {
        product_name: 'Teclado Mecânico RGB Switch Blue',
        category: 'Teclado',
        platform: 'aliexpress',
        search_query: 'Mechanical Keyboard Blue Switch',
        keywords: ['teclado', 'mecanico', 'rgb', 'switch blue', 'gamer'],
        description: 'Teclado mecânico com feedback tátil (Switch Blue) e iluminação RGB personalizável.',
        image_slug: 'Teclado+Mec',
        estimated_min_price: 180,
        estimated_max_price: 400
    },
    {
        product_name: 'Mouse Gamer 16000 DPI',
        category: 'Mouse',
        platform: 'aliexpress',
        search_query: 'Gaming Mouse 16000 DPI',
        keywords: ['mouse', 'gamer', 'dpi', 'rgb', 'precisao'],
        description: 'Mouse gamer de alta precisão com sensor óptico e botões programáveis.',
        image_slug: 'Mouse+Gamer',
        estimated_min_price: 120,
        estimated_max_price: 300
    },
    {
        product_name: 'Cadeira Gamer Ergonômica',
        category: 'Cadeiras',
        platform: 'aliexpress',
        search_query: 'Ergonomic Gaming Chair',
        keywords: ['cadeira', 'gamer', 'ergonomica', 'conforto', 'escritorio'],
        description: 'Cadeira gamer reclinável com apoio lombar e de pescoço ajustável.',
        image_slug: 'Cadeira+Gamer',
        estimated_min_price: 450,
        estimated_max_price: 900
    },
    {
        product_name: 'Microfone Condensador USB',
        category: 'Microfones',
        platform: 'aliexpress',
        search_query: 'USB Condenser Microphone Stream',
        keywords: ['microfone', 'usb', 'stream', 'podcast', 'audio'],
        description: 'Microfone profissional para streaming e podcasts com tripé de mesa.',
        image_slug: 'Mic+USB',
        estimated_min_price: 150,
        estimated_max_price: 400
    },
    {
        product_name: 'Webcam Full HD 1080p',
        category: 'Hardware', // Or Outros/Diversos, fitting Hardware mostly as peripheral
        platform: 'aliexpress',
        search_query: 'Webcam 1080p 60fps',
        keywords: ['webcam', '1080p', 'stream', 'video', 'camera'],
        description: 'Webcam de alta resolução 1080p ideal para reuniões e transmissões ao vivo.',
        image_slug: 'Webcam+HD',
        estimated_min_price: 100,
        estimated_max_price: 250
    },
    {
        product_name: 'Hub USB-C 7 em 1',
        category: 'Hardware',
        platform: 'aliexpress',
        search_query: 'USB-C Hub 7 in 1',
        keywords: ['usb-c', 'hub', 'dock', 'hdmi', 'adaptador'],
        description: 'Expansor de portas USB-C com HDMI 4K, USB 3.0 e Leitor de Cartão.',
        image_slug: 'Hub+USB',
        estimated_min_price: 80,
        estimated_max_price: 200
    },
    {
        product_name: 'Mousepad Gamer Extra Grande',
        category: 'Mousepad',
        platform: 'aliexpress',
        search_query: 'Large Gaming Mousepad RGB',
        keywords: ['mousepad', 'xxl', 'deskmat', 'gamer', 'rgb'],
        description: 'Mousepad estendido com base emborrachada e bordas com LED RGB.',
        image_slug: 'Mousepad+RGB',
        estimated_min_price: 60,
        estimated_max_price: 150
    },

    // Temu
    {
        product_name: 'Suporte Articulado Monitor',
        category: 'Hardware',
        platform: 'temu',
        search_query: 'Monitor Arm Desk Mount',
        keywords: ['suporte', 'monitor', 'braço', 'articulado', 'setup'],
        description: 'Braço articulado a gás para monitores, liberando espaço na mesa.',
        image_slug: 'Suporte+Monitor',
        estimated_min_price: 150,
        estimated_max_price: 400
    },
    {
        product_name: 'Fita LED RGB Inteligente',
        category: 'Outros/Diversos', // Decoration for Setup
        platform: 'temu',
        search_query: 'Smart LED Strip RGB WiFi',
        keywords: ['led', 'rgb', 'wifi', 'alexa', 'decoracao'],
        description: 'Fita LED compatível com Alexa/Google Home para iluminação ambiental do setup.',
        image_slug: 'Fita+LED',
        estimated_min_price: 40,
        estimated_max_price: 120
    },
    {
        product_name: 'Organizador de Cabos',
        category: 'Outros/Diversos',
        platform: 'temu',
        search_query: 'Cable Management Organizer',
        keywords: ['organizador', 'cabos', 'desk', 'limpeza', 'setup'],
        description: 'Kit para gerenciamento de cabos, mantendo o setup limpo e organizado.',
        image_slug: 'Org+Cabos',
        estimated_min_price: 20,
        estimated_max_price: 80
    },
    {
        product_name: 'Mini Teclado Wireless',
        category: 'Teclado',
        platform: 'temu',
        search_query: 'Mini Wireless Keyboard Touchpad',
        keywords: ['teclado', 'mini', 'wireless', 'tv box', 'smart tv'],
        description: 'Mini teclado com touchpad integrado para controlar Smart TVs e TV Boxes.',
        image_slug: 'Mini+Teclado',
        estimated_min_price: 35,
        estimated_max_price: 90
    },
    {
        product_name: 'Controle Gamepad Mobile',
        category: 'Controles',
        platform: 'temu',
        search_query: 'Mobile Gamepad Controller Bluetooth',
        keywords: ['gamepad', 'mobile', 'celular', 'android', 'ios'],
        description: 'Controle Bluetooth para transformar seu celular em um console portátil.',
        image_slug: 'Gamepad+Cel',
        estimated_min_price: 80,
        estimated_max_price: 250
    },

    // Shein (Likely accessories)
    {
        product_name: 'Capa iPhone Transparente',
        category: 'Celulares',
        platform: 'shein',
        search_query: 'Clear Phone Case iPhone',
        keywords: ['capa', 'iphone', 'case', 'protecao', 'silicone'],
        description: 'Capa protetora transparente anti-amarelamento para iPhone.',
        image_slug: 'Capa+iPhone',
        estimated_min_price: 15,
        estimated_max_price: 60
    },
    {
        product_name: 'Suporte Celular Mesa',
        category: 'Celulares',
        platform: 'shein',
        search_query: 'Desktop Phone Stand Holder',
        keywords: ['suporte', 'mesa', 'celular', 'aluminio', 'dock'],
        description: 'Suporte de alumínio para celular, ideal para videochamadas e assistir vídeos.',
        image_slug: 'Suporte+Cel',
        estimated_min_price: 25,
        estimated_max_price: 80
    },
    {
        product_name: 'Mochila Notebook Impermeável',
        category: 'Mochilas',
        platform: 'shein',
        search_query: 'Laptop Backpack Waterproof Anti-theft',
        keywords: ['mochila', 'notebook', 'impermeavel', 'tech', 'viagem'],
        description: 'Mochila espaçosa com compartimento acolchoado para notebook e porta USB externa.',
        image_slug: 'Mochila+Tech',
        estimated_min_price: 120,
        estimated_max_price: 300
    },
    {
        product_name: 'Ring Light para Celular',
        category: 'Outros/Diversos',
        platform: 'shein',
        search_query: 'Selfie Ring Light Phone',
        keywords: ['ring light', 'selfie', 'foto', 'iluminacao', 'celular'],
        description: 'Mini Ring Light de clipe para melhorar a iluminação de selfies e stories.',
        image_slug: 'Ring+Light',
        estimated_min_price: 30,
        estimated_max_price: 90
    },

    // Amazon
    {
        product_name: 'Echo Dot 5ª Geração',
        category: 'Caixa de Som', // Smart speaker fits here loosely or Outros
        platform: 'amazon',
        search_query: 'Echo Dot 5',
        keywords: ['alexa', 'echo', 'smart', 'som', 'inteligente'],
        description: 'Smart speaker com Alexa, som de alta qualidade e controle de casa inteligente.',
        image_slug: 'Echo+Dot',
        estimated_min_price: 350,
        estimated_max_price: 500
    },
    {
        product_name: 'Kindle Paperwhite',
        category: 'Outros/Diversos', // E-reader
        platform: 'amazon',
        search_query: 'Kindle Paperwhite',
        keywords: ['kindle', 'leitor', 'ebook', 'livros', 'digital'],
        description: 'Leitor de livros digitais à prova d\'água com tela de alta resolução.',
        image_slug: 'Kindle',
        estimated_min_price: 450,
        estimated_max_price: 700
    },
    {
        product_name: 'Mouse Logitech MX Master',
        category: 'Mouse',
        platform: 'amazon',
        search_query: 'Logitech MX Master',
        keywords: ['mouse', 'logitech', 'produtividade', 'sem fio', 'ergonomico'],
        description: 'Mouse premium focado em produtividade e conforto com scroll eletromagnético.',
        image_slug: 'Mouse+MX',
        estimated_min_price: 500,
        estimated_max_price: 800
    },
    {
        product_name: 'Monitor Gamer 144Hz',
        category: 'Monitores',
        platform: 'amazon',
        search_query: 'Monitor Gamer 144Hz IPS',
        keywords: ['monitor', '144hz', 'gamer', 'ips', '1ms'],
        description: 'Monitor gamer com alta taxa de atualização e tempo de resposta rápido.',
        image_slug: 'Monitor+144Hz',
        estimated_min_price: 800,
        estimated_max_price: 1500
    },
    {
        product_name: 'Controle Xbox Series',
        category: 'Controles',
        platform: 'amazon',
        search_query: 'Xbox Series Controller Wireless',
        keywords: ['controle', 'xbox', 'wireless', 'gamepad', 'pc'],
        description: 'Controle original Xbox Series com conectividade Bluetooth para Console e PC.',
        image_slug: 'Controle+Xbox',
        estimated_min_price: 400,
        estimated_max_price: 600
    },

    // Shopee
    {
        product_name: 'Kit Teclado e Mouse Gamer',
        category: 'Kit mouse + Teclado',
        platform: 'shopee',
        search_query: 'Kit Teclado Mouse Gamer RGB',
        keywords: ['kit', 'teclado', 'mouse', 'gamer', 'iniciante'],
        description: 'Combo de teclado e mouse gamer com iluminação RGB e bom custo-benefício.',
        image_slug: 'Kit+Gamer',
        estimated_min_price: 100,
        estimated_max_price: 250
    },
    {
        product_name: 'Stream Deck Mini',
        category: 'Outros/Diversos', // Or Hardware
        platform: 'shopee',
        search_query: 'Stream Deck controller',
        keywords: ['stream deck', 'streamer', 'botoes', 'obs', 'live'],
        description: 'Controlador de conteúdo para streamers com teclas LCD personalizáveis.',
        image_slug: 'Stream+Deck',
        estimated_min_price: 500,
        estimated_max_price: 900
    },
    {
        product_name: 'Microfone de Lapela',
        category: 'Microfones',
        platform: 'shopee',
        search_query: 'Lavalier Microphone Wireless Phone',
        keywords: ['microfone', 'lapela', 'wireless', 'celular', 'video'],
        description: 'Microfone de lapela sem fio para gravação de vídeos no celular com áudio limpo.',
        image_slug: 'Mic+Lapela',
        estimated_min_price: 50,
        estimated_max_price: 150
    },
    {
        product_name: 'Caixa de Som Bluetooth',
        category: 'Caixa de Som',
        platform: 'shopee',
        search_query: 'Bluetooth Speaker Waterproof',
        keywords: ['caixa som', 'bluetooth', 'aprova agua', 'portatil'],
        description: 'Caixa de som potente e resistente à água para ouvir música em qualquer lugar.',
        image_slug: 'Caixa+BT',
        estimated_min_price: 80,
        estimated_max_price: 300
    },
    {
        product_name: 'Cooler para Notebook',
        category: 'Hardware', // Accessory
        platform: 'shopee',
        search_query: 'Laptop Cooling Pad Fan',
        keywords: ['cooler', 'notebook', 'base', 'refrigeracao', 'fan'],
        description: 'Base refrigerada para notebook com ventoinhas silenciosas e LED.',
        image_slug: 'Base+Cooler',
        estimated_min_price: 60,
        estimated_max_price: 180
    },

    // Expanded Templates to reach 50+
    // AliExpress - More Peripherals & Hardware
    {
        product_name: 'SSD NVMe M.2 1TB',
        category: 'Hardware',
        platform: 'aliexpress',
        search_query: 'SSD NVMe M2 1TB',
        keywords: ['ssd', 'nvme', 'm2', 'armazenamento', 'pc gamer'],
        description: 'SSD NVMe de altíssima velocidade para carregamento instantâneo de jogos e sistema.',
        image_slug: 'SSD+NVMe',
        estimated_min_price: 250,
        estimated_max_price: 600
    },
    {
        product_name: 'Memória RAM DDR4 16GB',
        category: 'Hardware',
        platform: 'aliexpress',
        search_query: 'DDR4 RAM 16GB 3200MHz',
        keywords: ['ram', 'ddr4', 'memoria', 'pc', 'gamer'],
        description: 'Módulo de memória RAM DDR4 com dissipador de calor e RGB.',
        image_slug: 'Memoria+RAM',
        estimated_min_price: 150,
        estimated_max_price: 400
    },
    {
        product_name: 'Processador Ryzen 5',
        category: 'Hardware',
        platform: 'aliexpress',
        search_query: 'AMD Ryzen 5 Processor',
        keywords: ['processador', 'cpu', 'ryzen', 'amd', 'gamer'],
        description: 'Processador custo-benefício ideal para jogos e multitarefa.',
        image_slug: 'Ryzen+5',
        estimated_min_price: 550,
        estimated_max_price: 950
    },
    {
        product_name: 'Placa de Vídeo RX 6600', // Cheaper alternative to RTX 3060
        category: 'Hardware',
        platform: 'aliexpress',
        search_query: 'RX 6600 Graphics Card',
        keywords: ['gpu', 'placa de video', 'rx 6600', 'amd', 'custo beneficio'],
        description: 'Placa de vídeo intermediária com excelente desempenho para jogos em 1080p.',
        image_slug: 'RX+6600',
        estimated_min_price: 1200,
        estimated_max_price: 1600
    },
    {
        product_name: 'Gabinete Gamer Vidro Temperado',
        category: 'Hardware', // Case fits in hardware
        platform: 'aliexpress',
        search_query: 'Gaming PC Case Tempered Glass',
        keywords: ['gabinete', 'pc case', 'vidro', 'atx', 'rgb'],
        description: 'Gabinete espaçoso com lateral em vidro temperado e fluxo de ar otimizado.',
        image_slug: 'Gabinete',
        estimated_min_price: 250,
        estimated_max_price: 500
    },

    // Temu - Gadgets & Smart Home
    {
        product_name: 'Lâmpada Inteligente WiFi',
        category: 'Outros/Diversos',
        platform: 'temu',
        search_query: 'Smart Bulb WiFi RGB',
        keywords: ['lampada', 'smart', 'wifi', 'alexa', 'casa inteligente'],
        description: 'Lâmpada LED RGB controlada por voz ou aplicativo.',
        image_slug: 'Lampada+Smart',
        estimated_min_price: 30,
        estimated_max_price: 90
    },
    {
        product_name: 'Tomada Inteligente',
        category: 'Outros/Diversos',
        platform: 'temu',
        search_query: 'Smart Plug WiFi Socket',
        keywords: ['tomada', 'smart', 'plug', 'automacao', 'energia'],
        description: 'Controle seus eletrônicos remotamente com esta tomada inteligente WiFi.',
        image_slug: 'Tomada+Smart',
        estimated_min_price: 40,
        estimated_max_price: 100
    },
    {
        product_name: 'Mini Projetor Portátil',
        category: 'Outros/Diversos', // Or Monitores equivalent
        platform: 'temu',
        search_query: 'Mini Portable Projector 1080p',
        keywords: ['projetor', 'cinema', 'portatil', 'filmes', 'tela'],
        description: 'Transforme sua parede em uma tela de cinema com este mini projetor.',
        image_slug: 'Mini+Projetor',
        estimated_min_price: 300,
        estimated_max_price: 600
    },
    {
        product_name: 'Switch HDMI 3 Portas',
        category: 'Outros/Diversos',
        platform: 'temu',
        search_query: 'HDMI Switch 4K',
        keywords: ['hdmi', 'switch', 'splitter', 'tv', 'monitor'],
        description: 'Conecte múltiplos dispositivos HDMI em uma única entrada da sua TV ou Monitor.',
        image_slug: 'Switch+HDMI',
        estimated_min_price: 40,
        estimated_max_price: 120
    },
    {
        product_name: 'Carregador GaN 65W',
        category: 'Celulares', // Accessory
        platform: 'temu',
        search_query: 'GaN Charger 65W USB-C',
        keywords: ['carregador', 'gan', 'fast charge', 'notebook', 'celular'],
        description: 'Carregador ultra compacto e potente capaz de carregar notebooks e celulares.',
        image_slug: 'Carregador+GaN',
        estimated_min_price: 60,
        estimated_max_price: 180
    },

    // Shein - Accessories & Decor
    {
        product_name: 'Desk Pad de Couro',
        category: 'Mousepad',
        platform: 'shein',
        search_query: 'Leather Desk Mat',
        keywords: ['desk mat', 'mousepad', 'couro', 'escritorio', 'setup'],
        description: 'Mousepad de couro sintético elegante para proteger sua mesa.',
        image_slug: 'Desk+Pad',
        estimated_min_price: 40,
        estimated_max_price: 100
    },
    {
        product_name: 'Suporte Headset RGB',
        category: 'Headset', // Accessory for Headset
        platform: 'shein',
        search_query: 'RGB Headphone Stand',
        keywords: ['suporte', 'headset', 'rgb', 'stand', 'gamer'],
        description: 'Suporte para fone de ouvido com iluminação RGB e hub USB integrado.',
        image_slug: 'Suporte+Fone',
        estimated_min_price: 50,
        estimated_max_price: 150
    },
    {
        product_name: 'Keycaps Personalizadas',
        category: 'Teclado', // Accessory
        platform: 'shein',
        search_query: 'Custom Keycaps Mechanical Keyboard',
        keywords: ['keycaps', 'teclas', 'custom', 'teclado', 'mecanico'],
        description: 'Conjunto de teclas personalizadas para teclados mecânicos.',
        image_slug: 'Keycaps',
        estimated_min_price: 80,
        estimated_max_price: 200
    },
    {
        product_name: 'Luminária Pixel Art',
        category: 'Outros/Diversos',
        platform: 'shein',
        search_query: 'Pixel Art Lamp Divoom',
        keywords: ['pixel art', 'lampada', 'decoracao', 'retro', 'gamer'],
        description: 'Luminária com display de pixel art programável via aplicativo.',
        image_slug: 'Luminaria+Pixel',
        estimated_min_price: 250,
        estimated_max_price: 500
    },
    {
        product_name: 'Organizador de Cabos Velcro',
        category: 'Outros/Diversos',
        platform: 'shein',
        search_query: 'Cable Ties Velcro',
        keywords: ['organizacao', 'cabos', 'velcro', 'setup', 'limpeza'],
        description: 'Fitas de velcro reutilizáveis para organizar os fios do seu setup.',
        image_slug: 'Org+Velcro',
        estimated_min_price: 15,
        estimated_max_price: 50
    },

    // Amazon - Pro Audio/Video & Console
    {
        product_name: 'Microfone Shure SM7B',
        category: 'Microfones',
        platform: 'amazon',
        search_query: 'Shure SM7B Microphone',
        keywords: ['shure', 'microfone', 'podcast', 'profissional', 'audio'],
        description: 'O microfone lendário usado pelos maiores podcasters e streamers do mundo.',
        image_slug: 'Shure+SM7B',
        estimated_min_price: 2800,
        estimated_max_price: 3200
    },
    {
        product_name: 'Elgato Cam Link 4K',
        category: 'Hardware',
        platform: 'amazon',
        search_query: 'Elgato Cam Link 4K',
        keywords: ['placa captura', 'elgato', 'camera', 'stream', '4k'],
        description: 'Transforme sua DSLR ou câmera mirrorless em uma webcam de alta qualidade.',
        image_slug: 'Cam+Link',
        estimated_min_price: 800,
        estimated_max_price: 1200
    },
    {
        product_name: 'Controle 8BitDo Ultimate',
        category: 'Controles',
        platform: 'amazon',
        search_query: '8BitDo Ultimate Bluetooth Controller',
        keywords: ['controle', '8bitdo', 'pc', 'switch', 'hall effect'],
        description: 'Controle premium com joystick Hall Effect anti-drift e base de carregamento.',
        image_slug: '8BitDo',
        estimated_min_price: 280,
        estimated_max_price: 450
    },
    {
        product_name: 'Fita LED Govee rgbic',
        category: 'Outros/Diversos', // Lighting
        platform: 'amazon',
        search_query: 'Govee RGBIC LED Strip',
        keywords: ['govee', 'led', 'rgbic', 'setup', 'decoracao'],
        description: 'Fita LED inteligente com tecnolotia RGBIC para cores simultâneas e efeitos dinâmicos.',
        image_slug: 'Govee+LED',
        estimated_min_price: 150,
        estimated_max_price: 400
    },
    {
        product_name: 'Webcam Logitech C920s',
        category: 'Hardware',
        platform: 'amazon',
        search_query: 'Logitech C920s Pro HD',
        keywords: ['webcam', 'logitech', 'stream', '1080p', 'foco'],
        description: 'A webcam favorita dos streamers com gravação Full HD e proteção de privacidade.',
        image_slug: 'Logitech+C920',
        estimated_min_price: 350,
        estimated_max_price: 550
    },
    {
        product_name: 'Cadeira Gamer Elements', // Cheaper than Herman Miller
        category: 'Cadeiras',
        platform: 'amazon',
        search_query: 'Cadeira Gamer Elements',
        keywords: ['cadeira', 'gamer', 'elements', 'conforto', 'barata'],
        description: 'Cadeira gamer robusta e confortável com excelente custo-benefício.',
        image_slug: 'Cadeira+Gamer'
    },

    // Shopee - High Value/Volume items
    {
        product_name: 'Kit Fans RGB 120mm',
        category: 'Hardware',
        platform: 'shopee',
        search_query: 'Kit Fan RGB 120mm Controller',
        keywords: ['fan', 'ventoinha', 'rgb', 'pc', 'refrigeracao'],
        description: 'Kit com 3 ventoinhas RGB e controladora para refrigerar seu PC com estilo.',
        image_slug: 'Kit+Fans',
        estimated_min_price: 80,
        estimated_max_price: 200
    },
    {
        product_name: 'Monitor Portátil USB-C',
        category: 'Monitores',
        platform: 'shopee',
        search_query: 'Portable Monitor USB-C 15.6',
        keywords: ['monitor', 'portatil', 'segunda tela', 'usb-c', 'notebook'],
        description: 'Monitor secundário leve e fino, alimentado via USB-C para produtividade móvel.',
        image_slug: 'Monitor+Portatil',
        estimated_min_price: 600,
        estimated_max_price: 1100
    },
    {
        product_name: 'Controle Arcade Stick',
        category: 'Controles',
        platform: 'shopee',
        search_query: 'Arcade Stick Fight Stick',
        keywords: ['arcade', 'controle', 'luta', 'retro', 'street fighter'],
        description: 'Controle estilo arcade ideal para jogos de luta e emuladores.',
        image_slug: 'Arcade+Stick',
        estimated_min_price: 250,
        estimated_max_price: 600
    },
    {
        product_name: 'Tripé para Câmera/Celular',
        category: 'Outros/Diversos', // Photography gear
        platform: 'shopee',
        search_query: 'Camera Tripod Professional',
        keywords: ['tripe', 'camera', 'video', 'foto', 'estudio'],
        description: 'Tripé robusto e ajustável para câmeras e ring lights.',
        image_slug: 'Tripe+Pro',
        estimated_min_price: 120,
        estimated_max_price: 350
    },
    {
        product_name: 'Mochila Antifurto USB',
        category: 'Mochilas',
        platform: 'shopee',
        search_query: 'Anti Theft Backpack USB',
        keywords: ['mochila', 'antifurto', 'usb', 'notebook', 'seguranca'],
        description: 'Mochila com zíper oculto e porta USB para carregar dispositivos em movimento.',
        image_slug: 'Mochila+USB',
        estimated_min_price: 100,
        estimated_max_price: 250
    },
    {
        product_name: 'Soundbar Gamer Bluetooth',
        category: 'Caixa de Som',
        platform: 'shopee',
        search_query: 'Gaming Soundbar Bluetooth RGB',
        keywords: ['soundbar', 'som', 'pc', 'gamer', 'speaker'],
        description: 'Soundbar compacta para monitor, com som estéreo e iluminação RGB.',
        image_slug: 'Soundbar+PC'
    }
];

export interface TrendingProductInput {
    product_name: string;
    category: string;
    platform: string;
    price_min: number;
    price_max: number;
    currency: string;
    search_volume: number;
    growth_percentage: number;
    sentiment_score: number;
    hype_level: string;
    image_url: string;
    product_url: string;
    keywords: string;
    description: string;
}

const getRandomColor = () => {
    const colors = ['4F46E5', '10B981', 'F59E0B', 'EF4444', '8B5CF6', '06B6D4', 'EC4899', '14B8A6'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const generateFullProduct = (template: ProductTemplate): TrendingProductInput => {
    // Determine detailed metrics logic if needed, simplify for now or keep random
    // Using random ranges appropriate for tech
    const search_volume = Math.floor(Math.random() * 50000) + 5000;
    const growth_percentage = Math.floor(Math.random() * 300) + 50;
    const sentiment_score = Math.floor(Math.random() * 20) + 80; // Tech usually liked
    // Use template price estimates + small variation
    const baseMin = template.estimated_min_price || 50;
    const baseMax = template.estimated_max_price || 200;

    // Add +/- 10% variation to keep it dynamic daily
    const variationMin = baseMin * 0.1;
    const variationMax = baseMax * 0.1;

    let price_min = Math.floor(baseMin + (Math.random() * variationMin * 2) - variationMin);
    let price_max = Math.floor(baseMax + (Math.random() * variationMax * 2) - variationMax);

    // Ensure min < max and sensible formatting
    if (price_min < 1) price_min = 10;
    if (price_max <= price_min) price_max = price_min + 20;

    // Cap strictly at 3500 BRL just to be safe
    if (price_max > 3500) price_max = 3500;

    let url = '';
    if (template.platform === 'aliexpress') {
        url = `https://pt.aliexpress.com/wholesale?SearchText=${encodeURIComponent(template.search_query)}`;
    } else if (template.platform === 'temu') {
        url = `https://www.temu.com/search_result.html?search_key=${encodeURIComponent(template.search_query)}`;
    } else if (template.platform === 'shein') {
        url = `https://us.shein.com/pdsearch/${encodeURIComponent(template.search_query)}`;
    } else if (template.platform === 'amazon') {
        url = `https://www.amazon.com.br/s?k=${encodeURIComponent(template.search_query)}`;
    } else if (template.platform === 'shopee') {
        url = `https://shopee.com.br/search?keyword=${encodeURIComponent(template.search_query)}`;
    }

    const hype_levels = ['Baixo', 'Médio', 'Alto', 'Altíssimo'];
    const hype_level = hype_levels[Math.floor(Math.random() * hype_levels.length)];

    return {
        product_name: template.product_name,
        category: template.category,
        platform: template.platform,
        price_min,
        price_max,
        currency: 'BRL',
        search_volume,
        growth_percentage,
        sentiment_score,
        hype_level,
        image_url: `https://placehold.co/400x400/${getRandomColor()}/FFFFFF/png?text=${template.image_slug}`,
        product_url: url,
        keywords: JSON.stringify(template.keywords),
        description: template.description
    };
};

export const getRandomProduct = (): ProductTemplate => {
    return productTemplates[Math.floor(Math.random() * productTemplates.length)];
};
