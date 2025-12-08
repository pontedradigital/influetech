import db from './src/db';

interface TrendingProduct {
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

const trendingProducts: TrendingProduct[] = [
    // AliExpress - Top Tech Products
    {
        product_name: 'TWS Earbuds Pro Max (Estilo AirPods)',
        category: 'Fones e Áudio',
        platform: 'aliexpress',
        price_min: 15,
        price_max: 25,
        currency: 'USD',
        search_volume: 45000,
        growth_percentage: 340,
        sentiment_score: 95,
        hype_level: 'Altíssimo',
        image_url: 'https://placehold.co/400x400/4F46E5/FFFFFF/png?text=TWS+Earbuds',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['airpods', 'tws', 'earbuds', 'wireless', 'bluetooth']),
        description: 'Fones de ouvido sem fio com cancelamento de ruído, bateria de longa duração e qualidade premium.'
    },
    {
        product_name: 'Smartwatch Ultra (Estilo Apple Watch)',
        category: 'Smartwatches',
        platform: 'aliexpress',
        price_min: 30,
        price_max: 50,
        currency: 'USD',
        search_volume: 38000,
        growth_percentage: 280,
        sentiment_score: 92,
        hype_level: 'Altíssimo',
        image_url: 'https://placehold.co/400x400/10B981/FFFFFF/png?text=Smartwatch',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['smartwatch', 'apple watch', 'fitness', 'health', 'wearable']),
        description: 'Relógio inteligente com monitoramento de saúde, GPS, e tela AMOLED de alta resolução.'
    },
    {
        product_name: 'Power Bank 20000mAh Fast Charge',
        category: 'Carregadores',
        platform: 'aliexpress',
        price_min: 12,
        price_max: 20,
        currency: 'USD',
        search_volume: 32000,
        growth_percentage: 245,
        sentiment_score: 88,
        hype_level: 'Alto',
        image_url: 'https://placehold.co/400x400/F59E0B/FFFFFF/png?text=Power+Bank',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['power bank', 'carregador', 'bateria', 'portátil', 'fast charge']),
        description: 'Carregador portátil de alta capacidade com carregamento rápido e múltiplas portas USB.'
    },
    {
        product_name: 'Webcam 4K Ultra HD com Microfone',
        category: 'Câmeras',
        platform: 'aliexpress',
        price_min: 25,
        price_max: 40,
        currency: 'USD',
        search_volume: 28000,
        growth_percentage: 210,
        sentiment_score: 90,
        hype_level: 'Alto',
        image_url: 'https://placehold.co/400x400/EF4444/FFFFFF/png?text=Webcam+4K',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['webcam', '4k', 'streaming', 'home office', 'video call']),
        description: 'Webcam profissional 4K com microfone embutido, ideal para streaming e reuniões online.'
    },
    {
        product_name: 'Ring Light LED 10" com Tripé',
        category: 'Iluminação',
        platform: 'aliexpress',
        price_min: 15,
        price_max: 30,
        currency: 'USD',
        search_volume: 35000,
        growth_percentage: 195,
        sentiment_score: 87,
        hype_level: 'Alto',
        image_url: 'https://placehold.co/400x400/8B5CF6/FFFFFF/png?text=Ring+Light',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['ring light', 'iluminação', 'foto', 'vídeo', 'streaming']),
        description: 'Iluminação profissional para fotos e vídeos com controle de temperatura de cor e brilho.'
    },
    {
        product_name: 'Teclado Mecânico RGB Gaming 60%',
        category: 'Teclados e Mouse',
        platform: 'aliexpress',
        price_min: 35,
        price_max: 55,
        currency: 'USD',
        search_volume: 26000,
        growth_percentage: 175,
        sentiment_score: 93,
        hype_level: 'Alto',
        image_url: 'https://placehold.co/400x400/06B6D4/FFFFFF/png?text=Teclado+RGB',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['teclado mecânico', 'gaming', 'rgb', '60%', 'switches']),
        description: 'Teclado mecânico compacto com iluminação RGB personalizável e switches hot-swappable.'
    },
    {
        product_name: 'Action Camera 4K 60fps',
        category: 'Câmeras',
        platform: 'aliexpress',
        price_min: 45,
        price_max: 70,
        currency: 'USD',
        search_volume: 22000,
        growth_percentage: 160,
        sentiment_score: 89,
        hype_level: 'Médio',
        image_url: 'https://placehold.co/400x400/EC4899/FFFFFF/png?text=Action+Cam',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['action camera', 'gopro', '4k', 'esportes', 'aventura']),
        description: 'Câmera de ação resistente à água com gravação 4K 60fps e estabilização de imagem.'
    },

    // Temu - Budget Tech Products
    {
        product_name: 'Wireless Bluetooth Headphones',
        category: 'Fones e Áudio',
        platform: 'temu',
        price_min: 10,
        price_max: 18,
        currency: 'USD',
        search_volume: 42000,
        growth_percentage: 310,
        sentiment_score: 86,
        hype_level: 'Altíssimo',
        image_url: 'https://placehold.co/400x400/14B8A6/FFFFFF/png?text=Headphones',
        product_url: 'https://temu.com/item/example',
        keywords: JSON.stringify(['headphones', 'bluetooth', 'wireless', 'fones', 'música']),
        description: 'Fones de ouvido Bluetooth com som de alta qualidade e bateria de longa duração.'
    },
    {
        product_name: 'Fitness Tracker Smart Band',
        category: 'Wearables',
        platform: 'temu',
        price_min: 8,
        price_max: 15,
        currency: 'USD',
        search_volume: 36000,
        growth_percentage: 265,
        sentiment_score: 84,
        hype_level: 'Alto',
        image_url: 'https://placehold.co/400x400/F97316/FFFFFF/png?text=Fitness+Band',
        product_url: 'https://temu.com/item/example',
        keywords: JSON.stringify(['fitness tracker', 'smart band', 'saúde', 'exercício', 'monitor']),
        description: 'Pulseira inteligente com monitoramento de atividades, sono e frequência cardíaca.'
    },
    {
        product_name: 'Portable Charger 10000mAh',
        category: 'Carregadores',
        platform: 'temu',
        price_min: 8,
        price_max: 12,
        currency: 'USD',
        search_volume: 30000,
        growth_percentage: 220,
        sentiment_score: 82,
        hype_level: 'Alto',
        image_url: 'https://placehold.co/400x400/84CC16/FFFFFF/png?text=Charger',
        product_url: 'https://temu.com/item/example',
        keywords: JSON.stringify(['carregador portátil', 'power bank', 'bateria', 'usb']),
        description: 'Carregador portátil compacto e leve, perfeito para viagens e uso diário.'
    },
    {
        product_name: 'LED Strip Lights RGB 5m',
        category: 'Iluminação',
        platform: 'temu',
        price_min: 10,
        price_max: 20,
        currency: 'USD',
        search_volume: 40000,
        growth_percentage: 290,
        sentiment_score: 88,
        hype_level: 'Altíssimo',
        image_url: 'https://placehold.co/400x400/A855F7/FFFFFF/png?text=LED+Strip',
        product_url: 'https://temu.com/item/example',
        keywords: JSON.stringify(['led strip', 'rgb', 'iluminação', 'decoração', 'smart']),
        description: 'Fita LED RGB com controle remoto e sincronização com música para decoração ambiente.'
    },
    {
        product_name: 'Mini Projector Portable',
        category: 'Projetores',
        platform: 'temu',
        price_min: 40,
        price_max: 60,
        currency: 'USD',
        search_volume: 18000,
        growth_percentage: 185,
        sentiment_score: 85,
        hype_level: 'Médio',
        image_url: 'https://placehold.co/400x400/3B82F6/FFFFFF/png?text=Projector',
        product_url: 'https://temu.com/item/example',
        keywords: JSON.stringify(['projetor', 'mini projector', 'portátil', 'cinema', 'home theater']),
        description: 'Projetor portátil compacto com resolução HD e conectividade wireless.'
    },
    {
        product_name: 'Wireless Gaming Mouse RGB',
        category: 'Teclados e Mouse',
        platform: 'temu',
        price_min: 15,
        price_max: 25,
        currency: 'USD',
        search_volume: 24000,
        growth_percentage: 170,
        sentiment_score: 87,
        hype_level: 'Médio',
        image_url: 'https://placehold.co/400x400/EAB308/FFFFFF/png?text=Gaming+Mouse',
        product_url: 'https://temu.com/item/example',
        keywords: JSON.stringify(['mouse gaming', 'wireless', 'rgb', 'dpi', 'gamer']),
        description: 'Mouse gamer sem fio com sensor de alta precisão e iluminação RGB personalizável.'
    },
    {
        product_name: 'Smart Door Sensor Alarm Kit',
        category: 'Smart Home',
        platform: 'temu',
        price_min: 12,
        price_max: 20,
        currency: 'USD',
        search_volume: 20000,
        growth_percentage: 155,
        sentiment_score: 83,
        hype_level: 'Médio',
        image_url: 'https://placehold.co/400x400/22C55E/FFFFFF/png?text=Door+Sensor',
        product_url: 'https://temu.com/item/example',
        keywords: JSON.stringify(['sensor', 'alarme', 'smart home', 'segurança', 'wifi']),
        description: 'Kit de sensores inteligentes para portas e janelas com notificações via app.'
    },

    // Shein - Tech Accessories
    {
        product_name: 'Phone Case MagSafe Compatible',
        category: 'Acessórios Mobile',
        platform: 'shein',
        price_min: 5,
        price_max: 10,
        currency: 'USD',
        search_volume: 50000,
        growth_percentage: 320,
        sentiment_score: 90,
        hype_level: 'Altíssimo',
        image_url: 'https://placehold.co/400x400/F43F5E/FFFFFF/png?text=Phone+Case',
        product_url: 'https://shein.com/item/example',
        keywords: JSON.stringify(['capinha', 'phone case', 'magsafe', 'proteção', 'iphone']),
        description: 'Capinha de celular compatível com MagSafe, design moderno e proteção completa.'
    },
    {
        product_name: 'Wireless Earbuds Colorful',
        category: 'Fones e Áudio',
        platform: 'shein',
        price_min: 12,
        price_max: 18,
        currency: 'USD',
        search_volume: 38000,
        growth_percentage: 275,
        sentiment_score: 85,
        hype_level: 'Alto',
        image_url: 'https://placehold.co/400x400/06B6D4/FFFFFF/png?text=Earbuds',
        product_url: 'https://shein.com/item/example',
        keywords: JSON.stringify(['earbuds', 'wireless', 'colorido', 'bluetooth', 'música']),
        description: 'Fones de ouvido sem fio em cores vibrantes com som de qualidade e design compacto.'
    },
    {
        product_name: 'Smartwatch Strap Silicone',
        category: 'Smartwatches',
        platform: 'shein',
        price_min: 3,
        price_max: 8,
        currency: 'USD',
        search_volume: 32000,
        growth_percentage: 240,
        sentiment_score: 88,
        hype_level: 'Alto',
        image_url: 'https://placehold.co/400x400/8B5CF6/FFFFFF/png?text=Watch+Strap',
        product_url: 'https://shein.com/item/example',
        keywords: JSON.stringify(['pulseira', 'smartwatch', 'silicone', 'acessório', 'relógio']),
        description: 'Pulseira de silicone confortável para smartwatch em diversas cores e estilos.'
    },
    {
        product_name: 'Cable Organizer Set',
        category: 'Cabos e Adaptadores',
        platform: 'shein',
        price_min: 5,
        price_max: 12,
        currency: 'USD',
        search_volume: 28000,
        growth_percentage: 200,
        sentiment_score: 86,
        hype_level: 'Médio',
        image_url: 'https://placehold.co/400x400/10B981/FFFFFF/png?text=Organizer',
        product_url: 'https://shein.com/item/example',
        keywords: JSON.stringify(['organizador', 'cabos', 'acessórios', 'escritório', 'desk setup']),
        description: 'Kit organizador de cabos para manter sua mesa limpa e organizada.'
    },
    {
        product_name: 'Phone Stand Holder Adjustable',
        category: 'Acessórios Mobile',
        platform: 'shein',
        price_min: 6,
        price_max: 15,
        currency: 'USD',
        search_volume: 26000,
        growth_percentage: 180,
        sentiment_score: 84,
        hype_level: 'Médio',
        image_url: 'https://placehold.co/400x400/F59E0B/FFFFFF/png?text=Phone+Stand',
        product_url: 'https://shein.com/item/example',
        keywords: JSON.stringify(['suporte', 'celular', 'mesa', 'ajustável', 'desk']),
        description: 'Suporte ajustável para celular, ideal para videochamadas e assistir vídeos.'
    },

    // Additional trending products across platforms
    {
        product_name: 'USB-C Hub Multiport Adapter',
        category: 'Cabos e Adaptadores',
        platform: 'aliexpress',
        price_min: 18,
        price_max: 30,
        currency: 'USD',
        search_volume: 25000,
        growth_percentage: 165,
        sentiment_score: 91,
        hype_level: 'Médio',
        image_url: 'https://placehold.co/400x400/6366F1/FFFFFF/png?text=USB-C+Hub',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['usb-c', 'hub', 'adaptador', 'multiport', 'hdmi']),
        description: 'Hub USB-C com múltiplas portas: HDMI, USB 3.0, leitor de cartão SD e carregamento PD.'
    },
    {
        product_name: 'Portable SSD 1TB External',
        category: 'Armazenamento',
        platform: 'aliexpress',
        price_min: 55,
        price_max: 80,
        currency: 'USD',
        search_volume: 19000,
        growth_percentage: 150,
        sentiment_score: 94,
        hype_level: 'Médio',
        image_url: 'https://placehold.co/400x400/DC2626/FFFFFF/png?text=SSD+1TB',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['ssd', 'armazenamento', '1tb', 'portátil', 'backup']),
        description: 'SSD externo portátil de 1TB com velocidades de transferência ultra-rápidas.'
    },
    {
        product_name: 'Smart LED Bulb WiFi RGB',
        category: 'Smart Home',
        platform: 'temu',
        price_min: 8,
        price_max: 15,
        currency: 'USD',
        search_volume: 33000,
        growth_percentage: 235,
        sentiment_score: 87,
        hype_level: 'Alto',
        image_url: 'https://placehold.co/400x400/A78BFA/FFFFFF/png?text=Smart+Bulb',
        product_url: 'https://temu.com/item/example',
        keywords: JSON.stringify(['lâmpada inteligente', 'wifi', 'rgb', 'alexa', 'google home']),
        description: 'Lâmpada LED inteligente com controle por app e compatibilidade com assistentes de voz.'
    },
    {
        product_name: 'Wireless Charging Pad 15W',
        category: 'Carregadores',
        platform: 'temu',
        price_min: 10,
        price_max: 18,
        currency: 'USD',
        search_volume: 27000,
        growth_percentage: 190,
        sentiment_score: 85,
        hype_level: 'Médio',
        image_url: 'https://placehold.co/400x400/FB923C/FFFFFF/png?text=Wireless+Pad',
        product_url: 'https://temu.com/item/example',
        keywords: JSON.stringify(['carregador wireless', 'qi', 'fast charge', 'sem fio']),
        description: 'Base de carregamento sem fio rápido compatível com iPhone e Android.'
    },
    {
        product_name: 'Bluetooth Speaker Portable',
        category: 'Fones e Áudio',
        platform: 'shein',
        price_min: 15,
        price_max: 25,
        currency: 'USD',
        search_volume: 29000,
        growth_percentage: 205,
        sentiment_score: 86,
        hype_level: 'Alto',
        image_url: 'https://placehold.co/400x400/34D399/FFFFFF/png?text=BT+Speaker',
        product_url: 'https://shein.com/item/example',
        keywords: JSON.stringify(['caixa de som', 'bluetooth', 'portátil', 'speaker', 'música']),
        description: 'Caixa de som Bluetooth portátil com som potente e bateria de longa duração.'
    },
    {
        product_name: 'Laptop Stand Aluminum',
        category: 'Acessórios Mobile',
        platform: 'aliexpress',
        price_min: 20,
        price_max: 35,
        currency: 'USD',
        search_volume: 21000,
        growth_percentage: 145,
        sentiment_score: 89,
        hype_level: 'Baixo',
        image_url: 'https://placehold.co/400x400/60A5FA/FFFFFF/png?text=Laptop+Stand',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['suporte notebook', 'laptop stand', 'alumínio', 'ergonômico']),
        description: 'Suporte ergonômico de alumínio para notebook com design elegante e ajuste de altura.'
    },
    {
        product_name: 'Microphone USB Condenser',
        category: 'Microfones',
        platform: 'aliexpress',
        price_min: 30,
        price_max: 50,
        currency: 'USD',
        search_volume: 17000,
        growth_percentage: 140,
        sentiment_score: 92,
        hype_level: 'Baixo',
        image_url: 'https://placehold.co/400x400/F472B6/FFFFFF/png?text=USB+Mic',
        product_url: 'https://aliexpress.com/item/example',
        keywords: JSON.stringify(['microfone', 'usb', 'condenser', 'streaming', 'podcast']),
        description: 'Microfone condensador USB profissional para streaming, podcasts e gravações.'
    },
    {
        product_name: 'Gaming Headset RGB 7.1',
        category: 'Fones e Áudio',
        platform: 'temu',
        price_min: 25,
        price_max: 40,
        currency: 'USD',
        search_volume: 23000,
        growth_percentage: 175,
        sentiment_score: 88,
        hype_level: 'Médio',
        image_url: 'https://placehold.co/400x400/A855F7/FFFFFF/png?text=Headset',
        product_url: 'https://temu.com/item/example',
        keywords: JSON.stringify(['headset gamer', 'rgb', '7.1', 'gaming', 'microfone']),
        description: 'Headset gamer com som surround 7.1, microfone removível e iluminação RGB.'
    }
];

console.log('🌱 Seeding trending products...');

try {
    const insert = db.prepare(`
    INSERT INTO trending_products (
      product_name, category, platform, price_min, price_max, currency,
      search_volume, growth_percentage, sentiment_score, hype_level,
      image_url, product_url, keywords, description
    ) VALUES (
      @product_name, @category, @platform, @price_min, @price_max, @currency,
      @search_volume, @growth_percentage, @sentiment_score, @hype_level,
      @image_url, @product_url, @keywords, @description
    )
  `);

    const insertMany = db.transaction((products: TrendingProduct[]) => {
        for (const product of products) {
            insert.run(product);
        }
    });

    insertMany(trendingProducts);

    // Insert initial trend history
    const products = db.prepare('SELECT id, search_volume, growth_percentage, sentiment_score FROM trending_products').all() as Array<{
        id: number;
        search_volume: number;
        growth_percentage: number;
        sentiment_score: number;
    }>;

    const insertHistory = db.prepare(`
    INSERT INTO trend_history (product_id, search_volume, growth_percentage, sentiment_score)
    VALUES (?, ?, ?, ?)
  `);

    const insertHistoryMany = db.transaction((records: Array<{ id: number; search_volume: number; growth_percentage: number; sentiment_score: number }>) => {
        for (const record of records) {
            insertHistory.run(record.id, record.search_volume, record.growth_percentage, record.sentiment_score);
        }
    });

    insertHistoryMany(products);

    console.log(`✅ Successfully seeded ${trendingProducts.length} trending products!`);
    console.log(`✅ Created ${products.length} trend history records!`);

    // Show summary
    const summary = db.prepare(`
    SELECT 
      platform,
      COUNT(*) as count,
      AVG(growth_percentage) as avg_growth,
      AVG(sentiment_score) as avg_sentiment
    FROM trending_products
    GROUP BY platform
  `).all() as Array<{ platform: string; count: number; avg_growth: number; avg_sentiment: number }>;

    console.log('\n📊 Summary by platform:');
    summary.forEach(s => {
        console.log(`  ${s.platform}: ${s.count} products | Avg Growth: ${s.avg_growth.toFixed(1)}% | Avg Sentiment: ${s.avg_sentiment.toFixed(1)}%`);
    });

} catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
}
