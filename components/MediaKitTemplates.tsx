import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, Svg, Path, G, Circle, Rect, Polygon } from '@react-pdf/renderer';

// Register fonts
Font.register({
    family: 'Poppins',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/poppins/Poppins-Regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/poppins/Poppins-Bold.ttf', fontWeight: 'bold' },
        { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/poppins/Poppins-Italic.ttf', fontStyle: 'italic' }
    ]
});



Font.register({
    family: 'Josefin Sans',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/josefin-sans/files/josefin-sans-latin-400-normal.woff' },
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/josefin-sans/files/josefin-sans-latin-700-normal.woff', fontWeight: 'bold' },
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/josefin-sans/files/josefin-sans-latin-400-italic.woff', fontStyle: 'italic' }
    ]
});

Font.register({
    family: 'Oswald',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/oswald/files/oswald-latin-400-normal.woff' },
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/oswald/files/oswald-latin-700-normal.woff', fontWeight: 'bold' }
    ]
});

Font.register({
    family: 'Libre Baskerville',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/libre-baskerville/files/libre-baskerville-latin-400-normal.woff' },
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/libre-baskerville/files/libre-baskerville-latin-700-normal.woff', fontWeight: 'bold' },
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/libre-baskerville/files/libre-baskerville-latin-400-italic.woff', fontStyle: 'italic' }
    ]
});

export interface MediaKitSocial {
    platform: string;
    handle: string;
    followers: number;
    averageViews?: number;
}

interface MediaKitData {
    name: string;
    bio: string;
    location: string;
    email: string;
    phone: string;
    photo?: string; // Base64 or URL
    socialMedia: MediaKitSocial[];
    metrics: {
        totalFollowers: number;
        engagementRate: number;
        averageViews: number;
        contentFrequency: string;
    };
    niche: string;
    contentTypes: string[];
    partnershipPreferences: {
        categories: string[];
        type: string;
        minimumValue: number;
    };
    brands?: {
        name: string;
        logo: string;
    }[];
    audienceAge?: string;
    audienceGenderFemale?: number;
    audienceGenderMale?: number;
    // Translated labels
    labels: {
        aboutMe: string;
        contact: string;
        metrics: string;
        audience: string;
        socialStats: string;
        whatToExpect: string;
        followers: string;
        views: string;
        subscribers: string;
        engagement: string;
        brands: string; // New label
    };
    language?: 'pt' | 'en'; // Explicit language selection
}

// --- TRANSLATION DICTIONARY ---
const getTranslations = (lang: string = 'pt') => {
    const isEn = lang === 'en';
    return {
        // Sections
        about: isEn ? 'About Creator' : 'Sobre o Criador',
        audiencetitle: isEn ? 'Audience Profile' : 'Perfil da Audiência',
        stats: isEn ? 'Social Statistics' : 'Estatísticas Sociais',
        brands: isEn ? 'Trusted By' : 'Marcas Parceiras',
        services: isEn ? 'Services & Values' : 'Serviços & Valores',
        contact: isEn ? 'Contact Info' : 'Contato',

        // Metrics
        followers: isEn ? 'Followers' : 'Seguidores',
        subscribers: isEn ? 'Subscribers' : 'Inscritos',
        avgviews: isEn ? 'Avg. Views' : 'Vis. Médias',
        engagement: isEn ? 'Engagement' : 'Engajamento',
        reach: isEn ? 'Reach' : 'Alcance',
        monthlyreach: isEn ? 'Monthly Reach' : 'Alcance Mensal',
        newsubs: isEn ? 'New Subs' : 'Novos Inscritos',
        frequency: isEn ? 'Frequency' : 'Frequência',
        avg: isEn ? 'Average' : 'Média',

        // Demographics
        age: isEn ? 'Age Range' : 'Faixa Etária',
        male: isEn ? 'Male' : 'Masculino',
        female: isEn ? 'Female' : 'Feminino',
        location: isEn ? 'Location' : 'Localização',
        brazil: isEn ? 'Brazil' : 'Brasil',

        // Footer/Misc
        footer: isEn ? 'Partnership Media Kit' : 'MediaKit para Parcerias',
        createdwith: isEn ? 'Created with Influetech' : 'Criado com Influetech',
        letswork: isEn ? "Let's create something extraordinary." : "Vamos criar algo extraordinário juntos.",

        // Descriptions
        descEng: isEn ? 'Above industry average interaction' : 'Interação acima da média',
        descReach: isEn ? 'Impressions across all platforms' : 'Impressões em todas as redes',
        descViews: isEn ? 'Per video (last 90 days)' : 'Por vídeo (últimos 90 dias)',

        // Fallbacks for empty fields
        bioFallback: isEn ? 'Content Creator & Influencer' : 'Criador de Conteúdo & Influenciador',
        nicheFallback: isEn ? 'Digital Creator' : 'Criador Digital',

        // Labels for Charts
        audienceStats: isEn ? 'Audience Stats' : 'Dados de Audiência',

        // LayoutLines specific
        expect: isEn ? 'What To Expect' : 'O Que Esperar',
        expectText: isEn ? 'Investing in influencer services not only enhances visibility and drives sales but also cultivates strong connections with your audience.' : 'Investir em marketing de influência aumenta a visibilidade, impulsiona vendas e cria conexões fortes com sua audiência.',

        // Services (LayoutBold)
        svcContentTitle: isEn ? 'CONTENT CREATION' : 'CRIAÇÃO DE CONTEÚDO',
        svcContentDesc: isEn ? 'High quality posts and stories that resonate with your target audience.' : 'Posts e stories de alta qualidade que ressoam com seu público-alvo.',
        svcBrandTitle: isEn ? 'BRAND AWARENESS' : 'CONSCIÊNCIA DE MARCA',
        svcBrandDesc: isEn ? 'Boosting your market presence and brand recognition.' : 'Impulsionando sua presença de mercado e reconhecimento de marca.',
        svcEngageTitle: isEn ? 'ENGAGEMENT' : 'ENGAJAMENTO',
        svcEngageDesc: isEn ? 'Active community interaction and relationship building.' : 'Interação ativa com a comunidade e construção de relacionamentos.',

        // Additional Footer/Misc
        years: isEn ? 'y.o.' : 'anos',
        trustedSubtitle: isEn ? 'We are proud to collaborate with these amazing partners.' : 'Temos orgulho de colaborar com estas marcas incríveis.',

        // LayoutDark Specific
        analyticsDashboard: isEn ? 'Analytics Dashboard' : 'Dashboard de Análise',
        totalAudience: isEn ? 'Total Audience' : 'Audiência Total',
        interactionRate: isEn ? 'Avg. Interaction Rate' : 'Taxa de Interação Média',
        perVideo: isEn ? 'Per Video/Post' : 'Por Vídeo/Post',
        powerScore: isEn ? 'Power Score' : 'Pontuação de Poder',
        influencerTier: isEn ? 'Influencer Tier' : 'Nível do Influenciador',
        socialPlatforms: isEn ? 'Social Platforms' : 'Plataformas Sociais',
        brandsTrust: isEn ? 'Brands that trust our work' : 'Marcas que confiam no nosso trabalho',

        // Sidebar Labels
        labelEmail: isEn ? 'EMAIL' : 'EMAIL',
        labelPhone: isEn ? 'PHONE/WHATSAPP' : 'TELEFONE/WHATSAPP',
        labelLocation: isEn ? 'LOCATION' : 'LOCALIZAÇÃO',
        labelSocial: isEn ? 'SOCIAL' : 'SOCIAL',

        // LayoutLines
        contentCreator: isEn ? 'CONTENT CREATOR' : 'CRIADOR DE CONTEÚDO',
        influencer: isEn ? 'INFLUENCER' : 'INFLUENCIADOR'
    };
};

// --- ICON COMPONENTS ---

const IconInstagram = ({ size = 24, color = '#000' }: { size?: number, color?: string }) => (
    <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke={color} strokeWidth={2} fill="none" />
            <Circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth={2} fill="none" />
            <Circle cx="17.5" cy="6.5" r="0.8" fill={color} />
        </Svg>
    </View>
);

const IconTikTok = ({ size = 24, color = '#000' }: { size?: number, color?: string }) => (
    <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

const IconYouTube = ({ size = 24, color = '#000' }: { size?: number, color?: string }) => (
    <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Rect x="2" y="5" width="20" height="14" rx="4" stroke={color} strokeWidth={2} fill="none" />
            <Polygon points="10,8 16,12 10,16" fill={color} />
        </Svg>
    </View>
);

const IconGeneric = ({ size = 24, color = '#000' }: { size?: number, color?: string }) => (
    <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={2} fill="none" />
            <Path d="M12 2v20M2 12h20" stroke={color} strokeWidth={2} fill="none" />
        </Svg>
    </View>
);

const IconEmail = ({ size = 24, color = '#000' }: { size?: number, color?: string }) => (
    <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth={2} fill="none" />
            <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth={2} fill="none" />
        </Svg>
    </View>
);

const IconWhatsApp = ({ size = 24, color = '#000' }: { size?: number, color?: string }) => (
    <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke={color} strokeWidth={2} fill="none" />
        </Svg>
    </View>
);

const renderSocialIcon = (platform: string, size: number, color: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <IconInstagram size={size} color={color} />;
    if (p.includes('tiktok')) return <IconTikTok size={size} color={color} />;
    if (p.includes('youtube')) return <IconYouTube size={size} color={color} />;
    return <IconGeneric size={size} color={color} />;
};


// --- LAYOUTS ---
// (Keeping existing layouts 1-5 for backward compatibility if needed, but omitted here for brevity as they are not used?)
// Wait, I must keep them because MediaKitTemplates object exports them.
// I will keep them but compressed or just copy them.
// To be safe, I'll include them.

// --- LAYOUT 1 ---
const styles1 = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#FFF5E6', fontFamily: 'Helvetica' },
    header: { marginBottom: 20 },
    name: { fontSize: 48, fontWeight: 'bold', color: '#2D75E8' },
    subtitle: { fontSize: 12, color: '#2D75E8', letterSpacing: 2, marginBottom: 20, borderBottom: '1px solid #2D75E8', paddingBottom: 10 },
    mainContent: { flexDirection: 'row' },
    leftCol: { width: '50%', paddingRight: 20 },
    rightCol: { width: '50%' },
    photoContainer: { border: '2px solid #2D75E8', padding: 10, marginBottom: 20 },
    photo: { width: '100%', height: 300 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#2D75E8', marginBottom: 10, borderBottom: '2px solid #2D75E8', paddingBottom: 5 },
    text: { fontSize: 10, color: '#555', lineHeight: 1.5, marginBottom: 15 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderTop: '1px solid #2D75E8', borderBottom: '1px solid #2D75E8', paddingVertical: 15 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#2D75E8' },
    statLabel: { fontSize: 8, color: '#555' },
    contactBox: { marginTop: 20 },
    contactItem: { fontSize: 10, color: '#2D75E8', marginBottom: 5 },
    audienceBox: { marginTop: 20, backgroundColor: '#FFE8CC', padding: 15 },
    audienceTitle: { fontSize: 12, fontWeight: 'bold', color: '#2D75E8', marginBottom: 10 },
    audienceRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
const Layout1 = ({ data }: { data: MediaKitData }) => (
    <Page size="A4" style={styles1.page}>
        <View style={styles1.header}>
            <Text style={styles1.name}>{data.name}</Text>
            <Text style={styles1.subtitle}>CONTENT CREATOR — INFLUENCER</Text>
        </View>
        <View style={styles1.mainContent}>
            <View style={styles1.leftCol}>
                <Text style={styles1.sectionTitle}>{data.labels.aboutMe}</Text>
                <Text style={styles1.text}>{data.bio || ''}</Text>
                <View style={styles1.contactBox}>
                    <Text style={styles1.sectionTitle}>{data.labels.contact}</Text>
                    <Text style={styles1.contactItem}>📞 {data.phone}</Text>
                    <Text style={styles1.contactItem}>✉️ {data.email}</Text>
                    <Text style={styles1.contactItem}>📍 {data.location}</Text>
                </View>
                <View style={styles1.contactBox}>
                    <Text style={styles1.sectionTitle}>{data.labels.socialStats}</Text>
                    {(data.socialMedia || []).map((social, index) => (
                        <Text key={index} style={styles1.contactItem}>{social.platform}: {social.handle}</Text>
                    ))}
                </View>
            </View>
            <View style={styles1.rightCol}>
                <View style={styles1.photoContainer}>
                    {data.photo ? <Image src={data.photo} style={styles1.photo} /> : <View style={[styles1.photo, { backgroundColor: '#ddd' }]} />}
                </View>
            </View>
        </View>
    </Page>
);

// --- LAYOUT 2 ---
const styles2 = StyleSheet.create({
    page: { backgroundColor: '#111', fontFamily: 'Helvetica', color: '#fff' },
    topSection: { flexDirection: 'row', height: '45%' },
    photoCol: { width: '40%' },
    photo: { width: '100%', height: '100%' },
    infoCol: { width: '60%', padding: 30, justifyContent: 'center' },
    name: { fontSize: 50, fontWeight: 'bold', color: '#fff', lineHeight: 0.9 },
    role: { fontSize: 14, color: '#D35400', letterSpacing: 3, marginTop: 10, marginBottom: 30, borderBottom: '2px solid #fff', paddingBottom: 10 },
    contact: { fontSize: 10, color: '#ccc', marginBottom: 5 },
    aboutSection: { padding: 30 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#D35400', marginBottom: 10 },
    text: { fontSize: 10, color: '#aaa', lineHeight: 1.6, marginBottom: 20 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#D35400', padding: 20, marginHorizontal: 30, borderRadius: 10 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    statLabel: { fontSize: 8, color: '#fff' },
    socialIcons: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
});
const Layout2 = ({ data }: { data: MediaKitData }) => (
    <Page size="A4" style={styles2.page}>
        <View style={styles2.topSection}>
            <View style={styles2.photoCol}>
                {data.photo ? <Image src={data.photo} style={styles2.photo} /> : <View style={[styles2.photo, { backgroundColor: '#333' }]} />}
            </View>
            <View style={styles2.infoCol}>
                <Text style={styles2.name}>{data.name}</Text>
                <Text style={styles2.role}>INFLUENCER</Text>
                <View style={{ marginTop: 20 }}>
                    <Text style={styles2.contact}>{data.phone} 📞</Text>
                    <Text style={styles2.contact}>{data.email} ✉️</Text>
                </View>
            </View>
        </View>
    </Page>
);

// --- LAYOUT 3 ---
const styles3 = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#000', color: '#fff', fontFamily: 'Helvetica' },
    header: { flexDirection: 'row', marginBottom: 30 },
    photo: { width: 100, height: 100, borderRadius: 10, marginRight: 20 },
    headerText: { flex: 1, justifyContent: 'center' },
    quote: { fontSize: 12, fontStyle: 'italic', color: '#ccc', borderLeft: '2px solid #333', paddingLeft: 10 },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    card: { backgroundColor: '#111', padding: 15, borderRadius: 8, width: '48%', border: '1px solid #222', marginBottom: 15, marginRight: '2%' },
    cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
    cardText: { fontSize: 10, color: '#aaa', lineHeight: 1.4 },
    footer: { marginTop: 'auto', flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid #222', paddingTop: 20 },
    footerText: { fontSize: 10, color: '#888' },
});
const Layout3 = ({ data }: { data: MediaKitData }) => (
    <Page size="A4" style={styles3.page}>
        <View style={styles3.header}>
            {data.photo ? <Image src={data.photo} style={styles3.photo} /> : <View style={[styles3.photo, { backgroundColor: '#222' }]} />}
            <View style={styles3.headerText}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>{data.name}</Text>
                <Text style={styles3.quote}>"{data.bio || ''}"</Text>
            </View>
        </View>
    </Page>
);

// --- LAYOUT 4 ---
const styles4 = StyleSheet.create({
    page: { padding: 20, backgroundColor: '#fff', fontFamily: 'Helvetica' },
    header: { flexDirection: 'row', marginBottom: 15 },
    photoBox: { width: 150, height: 150, backgroundColor: '#A3E635', borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end', alignItems: 'center', marginRight: 15 },
    photo: { width: '90%', height: '90%', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    titleBox: { flex: 1, backgroundColor: '#9333EA', borderRadius: 20, padding: 20, justifyContent: 'center' },
    name: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    role: { fontSize: 14, color: '#E9D5FF' },
    contactBox: { backgroundColor: '#1F2937', borderRadius: 20, padding: 15, marginTop: 10 },
    contactText: { color: '#fff', fontSize: 10, marginBottom: 3 },
    orangeBar: { backgroundColor: '#F97316', borderRadius: 20, padding: 15, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    orangeTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    blueSection: { backgroundColor: '#2563EB', borderRadius: 20, padding: 20, flex: 1, marginRight: 15 },
    graySection: { backgroundColor: '#E5E7EB', borderRadius: 20, padding: 20, flex: 1 },
    row: { flexDirection: 'row', height: 300 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    whiteText: { color: '#fff' },
    darkText: { color: '#1F2937' },
});
const Layout4 = ({ data }: { data: MediaKitData }) => (
    <Page size="A4" style={styles4.page}>
        <View style={styles4.header}>
            <View style={styles4.photoBox}>
                {data.photo ? <Image src={data.photo} style={styles4.photo} /> : <View style={{ width: '100%', height: '100%', backgroundColor: '#84CC16' }} />}
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles4.titleBox}>
                    <Text style={styles4.name}>{data.name}</Text>
                    <Text style={styles4.role}>{data.niche} Influencer</Text>
                </View>
            </View>
        </View>
    </Page>
);

// --- LAYOUT 5 ---
const styles5 = StyleSheet.create({
    page: { backgroundColor: '#0F172A', color: '#fff', fontFamily: 'Helvetica' },
    headerBg: { height: 150, backgroundColor: '#4F46E5', borderBottomRightRadius: 100, marginBottom: -80 },
    content: { padding: 30 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 },
    title: { fontSize: 32, fontWeight: 'bold' },
    photoContainer: { width: 180, height: 220, borderRadius: 90, border: '4px solid #4F46E5', overflow: 'hidden', backgroundColor: '#1E293B' },
    photo: { width: '100%', height: '100%' },
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#818CF8', marginBottom: 15 },
    text: { fontSize: 10, color: '#94A3B8', lineHeight: 1.6 },
});
const Layout5 = ({ data }: { data: MediaKitData }) => (
    <Page size="A4" style={styles5.page}>
        <View style={styles5.headerBg} />
        <View style={styles5.content}>
            <View style={styles5.header}>
                <View style={{ width: '50%' }}>
                    <Text style={styles5.title}>{data.labels.aboutMe}</Text>
                    <Text style={[styles5.text, { marginTop: 10 }]}>{data.bio || ''}</Text>
                </View>
                <View style={styles5.photoContainer}>
                    {data.photo ? <Image src={data.photo} style={styles5.photo} /> : <View style={{ width: '100%', height: '100%', backgroundColor: '#333' }} />}
                </View>
            </View>
        </View>
    </Page>
);


// --- LAYOUT 6: PREMIUM MODERN (New Design) ---
const stylesModern = StyleSheet.create({
    page: { backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
    // Header
    headerWrapper: { backgroundColor: '#0f172a', paddingVertical: 40, paddingHorizontal: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerContent: { flex: 1, paddingRight: 20 },
    headerName: { fontSize: 32, color: '#ffffff', fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
    headerTagline: { fontSize: 12, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 2.5, fontWeight: 'bold' },
    // Photo
    photoContainer: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#fbbf24', overflow: 'hidden', backgroundColor: '#334155' },
    photo: { width: '100%', height: '100%', objectFit: 'cover' },

    // Sections
    section: { marginHorizontal: 30, marginTop: 25, marginBottom: 15 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    sectionBar: { width: 4, height: 20, backgroundColor: '#d97706', marginRight: 10, borderRadius: 2 },
    sectionTitle: { fontSize: 16, color: '#0f172a', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5 },

    // Bio
    bioText: { fontSize: 11, color: '#334155', lineHeight: 1.6, textAlign: 'justify' },

    // Social Grid
    socialGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
    socialCard: {
        width: '48%',
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 10,
        alignItems: 'center'
    },
    socialValue: { fontSize: 24, color: '#0f172a', fontWeight: 'bold', marginTop: 4 }, // Reduced top margin
    socialLabel: { fontSize: 9, color: '#94a3b8' },
    socialPlatformText: { fontSize: 8, color: '#cbd5e1', textTransform: 'uppercase', marginTop: 2 }, // Fallback text

    // Metrics Grid
    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    metricCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderBottomWidth: 3,
        borderBottomColor: '#d97706',
        marginBottom: 15
    },
    metricTitle: { fontSize: 9, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 8 },
    metricValue: { fontSize: 28, color: '#0f172a', fontWeight: 'bold', marginBottom: 4 },
    metricDesc: { fontSize: 9, color: '#94a3b8', lineHeight: 1.4 },

    // Audience
    audienceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    audienceItem: { flex: 1, backgroundColor: '#f1f5f9', padding: 12, borderRadius: 6, marginHorizontal: 3, alignItems: 'center' },
    audienceLabel: { fontSize: 8, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' },
    audienceValue: { fontSize: 11, color: '#0f172a', fontWeight: 'bold', textAlign: 'center' },

    // Contact Footer
    contactSection: { backgroundColor: '#0f172a', padding: 25, marginTop: 'auto', borderTopWidth: 4, borderTopColor: '#fbbf24' },
    contactRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    contactItem: { alignItems: 'center' },
    contactTitle: { fontSize: 8, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' },
    contactText: { fontSize: 10, color: '#ffffff', fontWeight: 'bold', marginTop: 4 },

    // Brands Grid
    brandsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
    brandCard: {
        width: '18%', // 5 columns
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    brandLogo: { width: 35, height: 35, objectFit: 'contain', borderRadius: 17.5 }, // Smaller fixed size circle
    brandName: { fontSize: 6, color: '#64748b', marginTop: 4, textAlign: 'center' }
});

const LayoutCorporate = ({ data }: { data: MediaKitData }) => {
    // Language detection logic
    const t = getTranslations(data.language || (data.labels.aboutMe.toLowerCase().includes('about') ? 'en' : 'pt'));
    const isEnglish = data.language === 'en';

    return (
        <Document>
            {/* PAGE 1: BRAND & OVERVIEW */}
            <Page size="A4" style={stylesModern.page}>
                <View style={stylesModern.headerWrapper}>
                    <View style={stylesModern.headerContent}>
                        <Text style={stylesModern.headerName}>{data.name}</Text>
                        <Text style={stylesModern.headerTagline}>{data.niche || 'Digital Creator'}</Text>
                    </View>
                    <View style={stylesModern.photoContainer}>
                        {data.photo ? (
                            <Image style={stylesModern.photo} src={data.photo} />
                        ) : (
                            <View style={{ width: '100%', height: '100%', backgroundColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 24, color: '#fff' }}>{data.name.charAt(0)}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* About Section */}
                <View style={stylesModern.section}>
                    <View style={stylesModern.sectionHeader}>
                        <View style={stylesModern.sectionBar} />
                        <Text style={stylesModern.sectionTitle}>{t.about}</Text>
                    </View>
                    <Text style={stylesModern.bioText}>{data.bio || ''}</Text>
                </View>

                {/* Social Stats Grid */}
                <View style={stylesModern.section}>
                    <View style={stylesModern.sectionHeader}>
                        <View style={stylesModern.sectionBar} />
                        <Text style={stylesModern.sectionTitle}>{t.reach}</Text>
                    </View>
                    <View style={stylesModern.socialGrid}>
                        {(data.socialMedia || []).slice(0, 4).map((social, index) => (
                            <View key={index} style={stylesModern.socialCard}>
                                {/* Explicit Icon Components */}
                                {renderSocialIcon(social.platform, 32, '#d97706')}

                                {/* Platform Label - Included as user seems to expect some label or fallback */}
                                <Text style={{ fontSize: 8, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', fontWeight: ('bold') }}>{social.platform}</Text>

                                <Text style={stylesModern.socialValue}>{(social.followers / 1000).toFixed(0)}K</Text>
                                <Text style={stylesModern.socialLabel}>{t.followers}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Contact Footer */}
                <View style={stylesModern.contactSection}>
                    <View style={stylesModern.contactRow}>
                        <View style={stylesModern.contactItem}>
                            <IconEmail size={20} color="#fbbf24" />
                            <Text style={stylesModern.contactTitle}>EMAIL</Text>
                            <Text style={stylesModern.contactText}>{data.email}</Text>
                        </View>
                        <View style={stylesModern.contactItem}>
                            <IconWhatsApp size={20} color="#fbbf24" />
                            <Text style={stylesModern.contactTitle}>WHATSAPP</Text>
                            <Text style={stylesModern.contactText}>{data.phone}</Text>
                        </View>
                        <View style={stylesModern.contactItem}>
                            <IconGeneric size={20} color="#fbbf24" />
                            <Text style={stylesModern.contactTitle}>SOCIAL</Text>
                            <Text style={stylesModern.contactText}>{(data.socialMedia || [])[0]?.handle || '@handle'}</Text>
                        </View>
                    </View>
                </View>
            </Page>

            {/* PAGE 2: METRICS & AUDIENCE */}
            <Page size="A4" style={stylesModern.page}>
                {/* Header P2 */}
                <View style={[stylesModern.headerWrapper, { paddingVertical: 20 }]}>
                    <Text style={[stylesModern.headerName, { fontSize: 18 }]}>{data.name}</Text>
                    <Text style={[stylesModern.headerTagline, { fontSize: 10 }]}>{t.stats}</Text>
                </View>

                {/* Metrics */}
                <View style={stylesModern.section}>
                    <View style={stylesModern.sectionHeader}>
                        <View style={stylesModern.sectionBar} />
                        <Text style={stylesModern.sectionTitle}>{t.stats}</Text>
                    </View>
                    <View style={stylesModern.metricsGrid}>
                        <View style={stylesModern.metricCard}>
                            <Text style={stylesModern.metricTitle}>{t.engagement}</Text>
                            <Text style={stylesModern.metricValue}>{data.metrics.engagementRate}%</Text>
                            <Text style={stylesModern.metricDesc}>{t.descEng}</Text>
                        </View>
                        <View style={stylesModern.metricCard}>
                            <Text style={stylesModern.metricTitle}>{t.monthlyreach}</Text>
                            <Text style={stylesModern.metricValue}>{(data.metrics.totalFollowers / 1000).toFixed(0)}K</Text>
                            <Text style={stylesModern.metricDesc}>{t.descReach}</Text>
                        </View>
                        <View style={stylesModern.metricCard}>
                            <Text style={stylesModern.metricTitle}>{t.avgviews}</Text>
                            <Text style={stylesModern.metricValue}>{(data.metrics.averageViews / 1000).toFixed(0)}K</Text>
                            <Text style={stylesModern.metricDesc}>{t.descViews}</Text>
                        </View>
                        <View style={stylesModern.metricCard}>
                            <Text style={stylesModern.metricTitle}>{t.frequency}</Text>
                            <View>
                                {data.metrics.contentFrequency.split(' | ').slice(0, 2).map((f, i) => (
                                    <Text key={i} style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a' }}>{f}</Text>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Audience */}
                <View style={stylesModern.section}>
                    <View style={stylesModern.sectionHeader}>
                        <View style={stylesModern.sectionBar} />
                        <Text style={stylesModern.sectionTitle}>{t.audiencetitle}</Text>
                    </View>
                    <View style={stylesModern.audienceRow}>
                        <View style={stylesModern.audienceItem}>
                            <Text style={stylesModern.audienceLabel}>{t.age}</Text>
                            <Text style={stylesModern.audienceValue}>25-40 {t.years}</Text>
                        </View>
                        <View style={stylesModern.audienceItem}>
                            <Text style={stylesModern.audienceLabel}>{t.location}</Text>
                            <Text style={stylesModern.audienceValue}>{data.location}</Text>
                        </View>
                    </View>
                    <View style={stylesModern.audienceRow}>
                        <View style={stylesModern.audienceItem}>
                            <Text style={stylesModern.audienceLabel}>{t.engagement}</Text>
                            <Text style={stylesModern.audienceValue}>{data.metrics.engagementRate}%</Text>
                        </View>
                        <View style={stylesModern.audienceItem}>
                            <Text style={stylesModern.audienceLabel}>Niche</Text>
                            <Text style={stylesModern.audienceValue}>{data.niche}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer Quote */}
                <View style={[stylesModern.contactSection, { marginTop: 'auto', backgroundColor: '#f8fafc', borderTopColor: '#e2e8f0' }]}>
                    <Text style={{ textAlign: 'center', color: '#64748b', fontSize: 10, fontStyle: 'italic' }}>
                        "{t.letswork}"
                    </Text>
                    <Text style={{ textAlign: 'center', color: '#cbd5e1', fontSize: 8, marginTop: 5, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {t.footer}
                    </Text>
                </View>
            </Page>

            {/* PAGE 3: BRANDS (Dedicated Page) */}
            {data.brands && data.brands.length > 0 && (
                <Page size="A4" style={stylesModern.page}>
                    {/* Header P3 */}
                    <View style={[stylesModern.headerWrapper, { paddingVertical: 20 }]}>
                        <Text style={[stylesModern.headerName, { fontSize: 18 }]}>{data.name}</Text>
                        <Text style={[stylesModern.headerTagline, { fontSize: 10 }]}>{t.brands}</Text>
                    </View>

                    <View style={[stylesModern.section, { marginTop: 40 }]}>
                        <View style={stylesModern.sectionHeader}>
                            <View style={stylesModern.sectionBar} />
                            <Text style={stylesModern.sectionTitle}>{t.brands}</Text>
                        </View>
                        <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 20 }}>
                            {t.trustedSubtitle}
                        </Text>

                        <View style={stylesModern.brandsGrid}>
                            {data.brands.map((brand, index) => (
                                <View key={index} style={stylesModern.brandCard} wrap={false}>
                                    <View style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: 17.5,
                                        overflow: 'hidden',
                                        backgroundColor: (brand as any).backgroundColor || '#ffffff',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {brand.logo ? (
                                            <Image src={brand.logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#cbd5e1' }}>{brand.name.charAt(0)}</Text>
                                        )}
                                    </View>
                                    <Text style={stylesModern.brandName}>{brand.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Footer Quote */}
                    <View style={[stylesModern.contactSection, { marginTop: 'auto', backgroundColor: '#f8fafc', borderTopColor: '#e2e8f0' }]}>
                        <Text style={{ textAlign: 'center', color: '#64748b', fontSize: 10, fontStyle: 'italic' }}>
                            "{t.letswork}"
                        </Text>
                        <Text style={{ textAlign: 'center', color: '#cbd5e1', fontSize: 8, marginTop: 5, textTransform: 'uppercase', letterSpacing: 1 }}>
                            {t.footer}
                        </Text>
                    </View>
                </Page>
            )}
        </Document>
    );
};




// --- LAYOUT 7: PREMIUM DARK (Dashboard Redesign) ---
const stylesDark = StyleSheet.create({
    page: { backgroundColor: '#0f172a', fontFamily: 'Poppins', flexDirection: 'column' }, // Changed to Poppins

    // Page 1 specific: Sidebar Layout
    p1Container: { flexDirection: 'row', flex: 1 },
    sidebar: { width: '35%', backgroundColor: '#1e293b', padding: 25, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#334155' },
    mainContent: { width: '65%', padding: 40, justifyContent: 'center' },

    // Sidebar Elements
    // Fix: Updated photo styles for better border handling
    photoContainer: { width: 140, height: 140, marginBottom: 30, alignItems: 'center', justifyContent: 'center' },
    photo: { width: 140, height: 140, borderRadius: 20, borderWidth: 2, borderColor: '#fbbf24', objectFit: 'cover' },

    contactItem: { width: '100%', marginBottom: 18 },
    contactLabel: { fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3, letterSpacing: 1 },
    contactValue: { fontSize: 8, color: '#f8fafc', fontWeight: 'bold' }, // Adjusted for Poppins readability

    // Main Content Elements
    headerName: { fontSize: 26, color: '#f8fafc', fontWeight: 'bold', lineHeight: 1.1, marginBottom: 8, maxWidth: '100%' }, // 36px is safe for Poppins
    headerTagline: { fontSize: 12, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 40, fontWeight: 'bold' },

    sectionTitle: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 5, fontWeight: 'bold' },
    bioText: { fontSize: 10, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 30, textAlign: 'justify' },

    // Audience Bars
    audienceBar: { marginBottom: 15 },
    audienceBarLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    audienceBarName: { fontSize: 9, color: '#cbd5e1' },
    audienceBarValue: { fontSize: 9, color: '#fbbf24', fontWeight: 'bold' },
    barContainer: { height: 6, backgroundColor: '#334155', borderRadius: 3, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: '#fbbf24' },

    // Page 2: Dashboard Grid
    p2Container: { padding: 40 },
    dashboardTitle: { fontSize: 22, color: '#f8fafc', marginBottom: 5, fontWeight: 'bold' },
    dashboardSubtitle: { fontSize: 10, color: '#64748b', marginBottom: 25, textTransform: 'uppercase', letterSpacing: 1 },

    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    metricCard: {
        width: '48%',
        backgroundColor: '#1e293b',
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    metricBigNumber: { fontSize: 32, color: '#f8fafc', fontWeight: 'bold', marginVertical: 8 },
    metricLabel: { fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
    metricSub: { fontSize: 8, color: '#64748b' },

    socialRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 12, borderRadius: 12, marginBottom: 8 },
    socialInfo: { marginLeft: 12, flex: 1 },
    socialPlatform: { fontSize: 11, color: '#f8fafc', fontWeight: 'bold' },
    socialStats: { fontSize: 10, color: '#fbbf24', fontWeight: 'bold' },

    // P3: Brands
    brandsContainer: { padding: 40 },
    brandsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
    brandCard: {
        width: '18%',
        height: 60,
        backgroundColor: '#1e293b',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    brandLogo: { width: 30, height: 30, objectFit: 'contain', borderRadius: 15 },
});

const LayoutDark = ({ data }: { data: MediaKitData }) => {
    // Language & Logic
    const t = getTranslations(data.language || (data.labels.aboutMe.toLowerCase().includes('about') ? 'en' : 'pt'));
    const isEnglish = data.language === 'en';

    return (
        <Document>
            {/* PAGE 1: SIDEBAR LAYOUT */}
            <Page size="A4" style={stylesDark.page}>
                <View style={stylesDark.p1Container}>
                    {/* LEFT SIDEBAR */}
                    <View style={stylesDark.sidebar}>
                        <View style={stylesDark.photoContainer}>
                            {data.photo ? (
                                <Image style={stylesDark.photo} src={data.photo} />
                            ) : (
                                <View style={[stylesDark.photo, { backgroundColor: '#64748b' }]} />
                            )}
                        </View>

                        <View style={stylesDark.contactItem}>
                            <Text style={stylesDark.contactLabel}>{t.labelEmail}</Text>
                            <Text style={stylesDark.contactValue}>{data.email}</Text>
                        </View>
                        <View style={stylesDark.contactItem}>
                            <Text style={stylesDark.contactLabel}>{t.labelPhone}</Text>
                            <Text style={stylesDark.contactValue}>{data.phone}</Text>
                        </View>
                        <View style={stylesDark.contactItem}>
                            <Text style={stylesDark.contactLabel}>{t.labelLocation}</Text>
                            <Text style={stylesDark.contactValue}>{data.location}</Text>
                        </View>

                        <View style={[stylesDark.contactItem, { marginTop: 'auto' }]}>
                            <Text style={stylesDark.contactLabel}>{t.labelSocial}</Text>
                            <Text style={stylesDark.contactValue}>{(data.socialMedia || [])[0]?.handle?.startsWith('@') ? (data.socialMedia || [])[0]?.handle : '@' + ((data.socialMedia || [])[0]?.handle || data.name.replace(/\s/g, '').toLowerCase())}</Text>
                        </View>
                    </View>

                    {/* RIGHT MAIN CONTENT */}
                    <View style={stylesDark.mainContent}>
                        <Text style={stylesDark.headerName}>{data.name}</Text>
                        <Text style={stylesDark.headerTagline}>{data.niche || 'Digital Creator'}</Text>

                        <Text style={stylesDark.sectionTitle}>{t.about}</Text>
                        <Text style={stylesDark.bioText}>{data.bio || ''}</Text>

                        <Text style={stylesDark.sectionTitle}>{t.audiencetitle}</Text>

                        {/* Fake Charts/Bars for Audience */}
                        <View style={stylesDark.audienceBar}>
                            <View style={stylesDark.audienceBarLabel}>
                                <Text style={stylesDark.audienceBarName}>25-34 {isEnglish ? 'y.o.' : 'anos'}</Text>
                                <Text style={stylesDark.audienceBarValue}>45%</Text>
                            </View>
                            <View style={stylesDark.barContainer}>
                                <View style={[stylesDark.barFill, { width: '45%' }]} />
                            </View>
                        </View>

                        <View style={stylesDark.audienceBar}>
                            <View style={stylesDark.audienceBarLabel}>
                                <Text style={stylesDark.audienceBarName}>Female / Feminino</Text>
                                <Text style={stylesDark.audienceBarValue}>{data.audienceGenderFemale || 60}%</Text>
                            </View>
                            <View style={stylesDark.barContainer}>
                                <View style={[stylesDark.barFill, { width: `${data.audienceGenderFemale || 60}%`, backgroundColor: '#f472b6' }]} />
                            </View>
                        </View>

                        <View style={stylesDark.audienceBar}>
                            <View style={stylesDark.audienceBarLabel}>
                                <Text style={stylesDark.audienceBarName}>Male / Masculino</Text>
                                <Text style={stylesDark.audienceBarValue}>{data.audienceGenderMale || 40}%</Text>
                            </View>
                            <View style={stylesDark.barContainer}>
                                <View style={[stylesDark.barFill, { width: `${data.audienceGenderMale || 40}%`, backgroundColor: '#60a5fa' }]} />
                            </View>
                        </View>

                    </View>
                </View>
            </Page>

            {/* PAGE 2: DASHBOARD */}
            <Page size="A4" style={stylesDark.page}>
                <View style={stylesDark.p2Container}>
                    <Text style={stylesDark.dashboardTitle}>{t.analyticsDashboard}</Text>
                    <Text style={stylesDark.dashboardSubtitle}>{t.stats}</Text>

                    <View style={stylesDark.metricsGrid}>
                        <View style={stylesDark.metricCard}>
                            <Text style={stylesDark.metricLabel}>{t.followers}</Text>
                            <Text style={stylesDark.metricBigNumber}>{(data.metrics.totalFollowers / 1000).toFixed(1)}K</Text>
                            <Text style={stylesDark.metricSub}>{t.totalAudience}</Text>
                        </View>
                        <View style={stylesDark.metricCard}>
                            <Text style={stylesDark.metricLabel}>{t.engagement}</Text>
                            <Text style={stylesDark.metricBigNumber}>{data.metrics.engagementRate}%</Text>
                            <Text style={stylesDark.metricSub}>{t.interactionRate}</Text>
                        </View>
                        <View style={stylesDark.metricCard}>
                            <Text style={stylesDark.metricLabel}>{t.avgviews}</Text>
                            <Text style={stylesDark.metricBigNumber}>{(data.metrics.averageViews / 1000).toFixed(1)}K</Text>
                            <Text style={stylesDark.metricSub}>{t.perVideo}</Text>
                        </View>
                        <View style={stylesDark.metricCard}>
                            <Text style={stylesDark.metricLabel}>{t.powerScore}</Text>
                            <Text style={[stylesDark.metricBigNumber, { color: '#fbbf24' }]}>A+</Text>
                            <Text style={stylesDark.metricSub}>{t.influencerTier}</Text>
                        </View>
                    </View>

                    <Text style={[stylesDark.sectionTitle, { marginTop: 40 }]}>{t.socialPlatforms}</Text>

                    {(data.socialMedia || []).map((social, index) => (
                        <View key={index} style={stylesDark.socialRow}>
                            {renderSocialIcon(social.platform, 24, '#fbbf24')}
                            <View style={stylesDark.socialInfo}>
                                <Text style={stylesDark.socialPlatform}>{social.platform}</Text>
                                <Text style={{ fontSize: 9, color: '#64748b' }}>{social.handle?.startsWith('@') ? social.handle : '@' + social.handle}</Text>
                            </View>
                            <Text style={stylesDark.socialStats}>{(social.followers / 1000).toFixed(1)}K</Text>
                        </View>
                    ))}

                </View>
            </Page>

            {/* PAGE 3: BRANDS */}
            {data.brands && data.brands.length > 0 && (
                <Page size="A4" style={stylesDark.page}>
                    <View style={stylesDark.brandsContainer}>
                        <Text style={stylesDark.dashboardTitle}>{t.brands}</Text>
                        <Text style={stylesDark.dashboardSubtitle}>{t.brandsTrust}</Text>

                        <View style={stylesDark.brandsGrid}>
                            {data.brands.map((brand, index) => (
                                <View key={index} style={stylesDark.brandCard} wrap={false}>
                                    <View style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        overflow: 'hidden',
                                        backgroundColor: (brand as any).backgroundColor || '#ffffff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 4
                                    }}>
                                        {brand.logo ? (
                                            <Image src={brand.logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#cbd5e1' }}>{brand.name.charAt(0)}</Text>
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 8, color: '#94a3b8' }}>{brand.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </Page>
            )}

        </Document>
    );
};

// --- LAYOUT 8: LINES (Retro/Modern Cream & Blue) ---
const stylesLines = StyleSheet.create({
    page: { backgroundColor: '#FFF8E7', fontFamily: 'Josefin Sans', padding: 30, color: '#2563EB' },

    // Header
    headerContainer: { marginBottom: 25 },
    name: { fontSize: 36, fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase', marginBottom: 5 },
    subtitleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    subtitleLine: { height: 2, backgroundColor: '#2563EB', flex: 1, marginHorizontal: 10 },
    subtitleText: { fontSize: 12, color: '#2563EB', textTransform: 'uppercase', letterSpacing: 1 },

    // Top Section (About + Photo)
    topSection: { flexDirection: 'row', marginBottom: 25 },
    aboutCol: { width: '55%', paddingRight: 20 },
    photoCol: { width: '45%', alignItems: 'center' },

    sectionTitle: { fontSize: 18, color: '#2563EB', fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 2, borderBottomColor: '#60A5FA', marginBottom: 10 },
    text: { fontSize: 11, color: '#4B5563', lineHeight: 1.5, textAlign: 'justify' },

    // Photo with Double Border effect
    photoFrameOuter: {
        padding: 5,
        borderRightWidth: 4,
        borderBottomWidth: 4,
        borderColor: '#2563EB',
        marginBottom: 10
    },
    photoFrameInner: {
        borderWidth: 2,
        borderColor: '#2563EB',
        padding: 5
    },
    photo: { width: 160, height: 200, objectFit: 'cover' },

    // Social Strip
    socialStrip: {
        flexDirection: 'row',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#2563EB',
        paddingVertical: 15,
        marginBottom: 25,
        justifyContent: 'space-around'
    },
    socialItem: { flexDirection: 'row', alignItems: 'center' },
    socialIconBox: { width: 35, height: 35, backgroundColor: '#2563EB', borderRadius: 17.5, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    socialDetails: {},
    socialValue: { fontSize: 14, fontWeight: 'bold', color: '#1E3A8A' },
    socialLabel: { fontSize: 8, color: '#2563EB', textTransform: 'uppercase' },

    // Info Grid
    infoGrid: { flexDirection: 'row', marginBottom: 25, gap: 30 },
    colLeft: { flex: 1 },
    colRight: { flex: 1 },

    contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    contactText: { fontSize: 10, color: '#4B5563', marginLeft: 8 },

    // Audience
    audienceRanges: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    rangeItem: { alignItems: 'center' },
    rangeValue: { fontSize: 18, fontWeight: 'bold', color: '#2563EB' },
    rangeLabel: { fontSize: 8, color: '#60A5FA', textTransform: 'uppercase' },

    genderBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginVertical: 5 },

    // Stats Grid

    // Stats
    statsGrid: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10, paddingVertical: 15, borderTopWidth: 2, borderTopColor: '#2563EB', borderBottomWidth: 2, borderBottomColor: '#2563EB' },
    statBox: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#93C5FD', paddingHorizontal: 5 },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#2563EB', marginBottom: 2 },
    statLabel: { fontSize: 8, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: 1 },
    frequencyValue: { fontSize: 10, lineHeight: 1.2, fontWeight: 'bold', color: '#2563EB', textAlign: 'center', marginBottom: 2 },

    // Bottom
    expectSection: { marginTop: 10 },
    expectText: { fontSize: 10, color: '#4B5563', textAlign: 'center', fontStyle: 'italic', marginTop: 5 },

    // Brands
    brandsContainer: { marginVertical: 15 },
    brandsTitle: { fontSize: 14, color: '#2563EB', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 },
    brandsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
    brandItem: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#93C5FD',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        overflow: 'hidden'
    },
    brandLogo: { width: '100%', height: '100%', objectFit: 'contain' },
    brandName: { fontSize: 6, color: '#2563EB', textAlign: 'center', marginTop: 2, maxWidth: 50 },

});

const LayoutLines = ({ data }: { data: MediaKitData }) => {
    // Logic
    const t = getTranslations(data.language || (data.labels.aboutMe.toLowerCase().includes('about') ? 'en' : 'pt'));
    const isEnglish = data.language === 'en';

    return (
        <Document>
            <Page size="A4" style={stylesLines.page}>
                {/* Header */}
                <View style={stylesLines.headerContainer}>
                    <Text style={stylesLines.name}>{data.name}</Text>
                    <View style={stylesLines.subtitleContainer}>
                        <Text style={stylesLines.subtitleText}>{t.contentCreator}</Text>
                        <View style={stylesLines.subtitleLine} />
                        <Text style={stylesLines.subtitleText}>{t.influencer}</Text>
                    </View>
                </View>

                {/* Top Section */}
                <View style={stylesLines.topSection}>
                    <View style={stylesLines.aboutCol}>
                        <Text style={stylesLines.sectionTitle}>{t.about}</Text>
                        <Text style={stylesLines.text}>{data.bio}</Text>
                    </View>
                    <View style={stylesLines.photoCol}>
                        <View style={stylesLines.photoFrameOuter}>
                            <View style={stylesLines.photoFrameInner}>
                                {data.photo ? <Image src={data.photo} style={stylesLines.photo} /> : <View style={[stylesLines.photo, { backgroundColor: '#ddd' }]} />}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Social Strip */}
                <View style={stylesLines.socialStrip}>
                    {(data.socialMedia || []).slice(0, 4).map((s, i) => (
                        <View key={i} style={stylesLines.socialItem}>
                            <View style={stylesLines.socialIconBox}>
                                {renderSocialIcon(s.platform, 20, '#FFF')}
                            </View>
                            <View style={stylesLines.socialDetails}>
                                <Text style={stylesLines.socialValue}>{(s.followers / 1000).toFixed(0)}K</Text>
                                <Text style={stylesLines.socialLabel}>{s.platform}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Info Grid: Contact & Audience */}
                <View style={stylesLines.infoGrid}>
                    {/* Contact */}
                    <View style={stylesLines.colLeft}>
                        <Text style={stylesLines.sectionTitle}>{t.contact}</Text>
                        <View style={stylesLines.contactRow}>
                            <IconEmail size={16} color="#2563EB" />
                            <Text style={stylesLines.contactText}>
                                {data.email.includes('@') ? (
                                    <>
                                        {data.email.split('@')[0]}
                                        <Text style={{ fontFamily: 'Helvetica' }}>@</Text>
                                        {data.email.split('@')[1]}
                                    </>
                                ) : (
                                    data.email
                                )}
                            </Text>
                        </View>
                        <View style={stylesLines.contactRow}>
                            <IconWhatsApp size={16} color="#2563EB" />
                            <Text style={stylesLines.contactText}>{data.phone}</Text>
                        </View>
                        <View style={stylesLines.contactRow}>
                            <IconGeneric size={16} color="#2563EB" />
                            <Text style={stylesLines.contactText}>{data.location}</Text>
                        </View>
                    </View>

                    {/* Audience */}
                    <View style={stylesLines.colRight}>
                        <Text style={stylesLines.sectionTitle}>{t.audiencetitle}</Text>
                        <View style={stylesLines.audienceRanges}>
                            <View style={stylesLines.rangeItem}>
                                <Text style={stylesLines.rangeValue}>25-34</Text>
                                <Text style={stylesLines.rangeLabel}>{t.age}</Text>
                            </View>
                            <View style={stylesLines.rangeItem}>
                                <Text style={stylesLines.rangeValue}>{data.metrics.engagementRate}%</Text>
                                <Text style={stylesLines.rangeLabel}>{t.engagement}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ fontSize: 10, color: '#2563EB', fontWeight: 'bold' }}>{data.audienceGenderFemale || 60}% {t.female}</Text>
                                <Text style={{ fontSize: 10, color: '#2563EB', fontWeight: 'bold' }}>{data.audienceGenderMale || 40}% {t.male}</Text>
                            </View>
                            <View style={stylesLines.genderBar}>
                                <View style={{ flex: data.audienceGenderFemale ? data.audienceGenderFemale / 100 : 0.6, backgroundColor: '#F472B6' }} />
                                <View style={{ flex: data.audienceGenderMale ? data.audienceGenderMale / 100 : 0.4, backgroundColor: '#60A5FA' }} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Social Stats Strip */}
                <View style={{ marginBottom: 10, alignItems: 'center' }}>
                    <Text style={[stylesLines.sectionTitle, { borderBottomWidth: 0, marginBottom: 0 }]}>{t.stats}</Text>
                </View>
                <View style={stylesLines.statsGrid}>
                    <View style={stylesLines.statBox}>
                        <Text style={stylesLines.statValue}>{(data.metrics.totalFollowers / 1000).toFixed(0)}K+</Text>
                        <Text style={stylesLines.statLabel}>{t.followers}</Text>
                    </View>
                    <View style={stylesLines.statBox}>
                        <Text style={stylesLines.statValue}>{(data.metrics.averageViews / 1000).toFixed(0)}K</Text>
                        <Text style={stylesLines.statLabel}>Avg. Views</Text>
                    </View>
                    <View style={[stylesLines.statBox, { borderRightWidth: 0, flex: 2 }]}>
                        <Text style={stylesLines.frequencyValue}>{data.metrics.contentFrequency}</Text>
                        <Text style={stylesLines.statLabel}>Frequency</Text>
                    </View>
                </View>
            </Page>

            <Page size="A4" style={stylesLines.page}>


                {/* Brands Section */}
                {data.brands && data.brands.length > 0 && (
                    <View style={stylesLines.brandsContainer}>
                        <Text style={[stylesLines.sectionTitle, { borderBottomWidth: 0, textAlign: 'center', marginBottom: 5 }]}>Trusted By</Text>
                        <View style={stylesLines.brandsGrid}>
                            {data.brands.map((brand, i) => (
                                <View key={i} style={{ alignItems: 'center', marginHorizontal: 5 }}>
                                    <View style={stylesLines.brandItem}>
                                        {brand.logo ? (
                                            <Image src={brand.logo} style={stylesLines.brandLogo} />
                                        ) : (
                                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#2563EB' }}>{brand.name.charAt(0)}</Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Footer / What to Expect */}
                <View style={[stylesLines.expectSection, { alignItems: 'center' }]}>
                    <Text style={stylesLines.sectionTitle}>{t.expect}</Text>
                    <Text style={stylesLines.expectText}>{t.expectText}</Text>
                </View>

            </Page>

        </Document >
    );
};

// --- Theme Bold (Modern/Orange) ---
// Updated to use Libre Baskerville and Refined Layout
const stylesBold = StyleSheet.create({
    page: { backgroundColor: '#18181b', fontFamily: 'Libre Baskerville', flexDirection: 'column', paddingTop: 30, paddingBottom: 30, paddingHorizontal: 30 },

    // Header Section (Photo + Info)
    headerRow: { flexDirection: 'row', minHeight: 250, marginBottom: 20 },

    // Left Photo Column
    photoColumn: { width: '40%', position: 'relative', marginRight: 20 },
    photo: { width: '100%', height: '100%', objectFit: 'cover' },

    // "MEDIA" Overlay (Top Left)
    mediaTextStroke: {
        position: 'absolute', top: 15, left: -5,
        fontSize: 32, fontFamily: 'Oswald', fontWeight: 'bold', color: '#ea580c', // Keep Oswald for graphic elements? User said "utilize a font Libre Baskerville", but usually display fonts are different. I will switch ALL to Libre Baskerville as requested to be safe, or keep Oswald for the graphic text if it fits the "Brand". User said "Arrume a fonte tambem utilize a font Libre Baskerville". I will apply it to the main texts.
        opacity: 0.9
    },
    kitText: {
        position: 'absolute', bottom: 15, right: 10,
        fontSize: 32, fontFamily: 'Oswald', fontWeight: 'bold', color: '#ea580c',
    },

    // Right Info Column
    infoColumn: { width: '60%', paddingTop: 0, backgroundColor: '#18181b', justifyContent: 'center' },

    // Name Block
    nameContainer: {
        marginBottom: 20, // Reduced from 30
        alignItems: 'flex-end',
        width: '100%',
        flexDirection: 'column'
    },
    firstNameReal: {
        fontSize: 28, color: '#ea580c',
        fontFamily: 'Libre Baskerville', fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'right',
        marginBottom: 2
    },
    lastNameReal: {
        fontSize: 32, color: '#FFFFFF',
        fontFamily: 'Libre Baskerville', fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'right'
    },

    roleSubtitle: {
        fontSize: 10, color: '#ea580c', letterSpacing: 3,
        textTransform: 'uppercase', marginTop: 10, marginBottom: 10, // Reduced margin
        textAlign: 'right', fontFamily: 'Libre Baskerville' // Changed from Oswald
    },

    divider: { height: 2, backgroundColor: '#FFFFFF', width: 60, marginBottom: 20, alignSelf: 'flex-end' },

    // Contact Info
    contactContainer: { alignItems: 'flex-end', marginTop: 10, gap: 8 },
    contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    contactText: { color: '#d4d4d8', fontSize: 9, marginRight: 8, fontFamily: 'Libre Baskerville' },

    // Body Content
    bodyContainer: { paddingHorizontal: 15 },

    // About Me
    sectionTitle: {
        fontSize: 16, color: '#ea580c', fontWeight: 'bold',
        marginBottom: 15, textTransform: 'uppercase', fontFamily: 'Libre Baskerville' // Changed from Oswald
    },
    bioText: {
        fontSize: 10, color: '#a1a1aa', fontFamily: 'Libre Baskerville',
        lineHeight: 1.8, textAlign: 'justify', marginBottom: 30 // Reduced margin from 50 to 30
    },

    // Social Media Stats
    centerTitle: {
        fontSize: 18, color: '#ea580c', fontWeight: 'bold',
        textAlign: 'center', textTransform: 'uppercase',
        marginTop: 10, marginBottom: 20, fontFamily: 'Libre Baskerville' // Changed from Oswald
    },

    // General Stats Row
    topStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30, // Reduced margin from 50 to 30
        paddingHorizontal: 0
    },
    topStatItem: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '23%',
        height: 80,
        justifyContent: 'flex-start'
    },
    topStatValue: {
        fontSize: 28, color: '#FFFFFF', fontWeight: 'bold',
        fontFamily: 'Libre Baskerville', marginBottom: 10 // Changed from Oswald
    },
    topStatLabel: {
        fontSize: 9, color: '#ea580c', fontFamily: 'Libre Baskerville',
        fontStyle: 'italic', textAlign: 'center'
    },

    // Orange Strip (Card Style)
    orangeStrip: {
        backgroundColor: '#ea580c',
        width: '100%',
        borderRadius: 12,
        paddingVertical: 35, // Increased padding to maintain box size while content shrinks
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        marginBottom: 20,
        alignItems: 'center'
    },
    stripCard: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 'auto',
        minWidth: 40,
        justifyContent: 'center'
    },
    iconCircle: {
        width: 20, height: 20, borderRadius: 10, // Reduced significantly (-30%)
        borderWidth: 1.5, borderColor: '#FFFFFF',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 4,
        minWidth: 20, minHeight: 20,
        flexShrink: 0
    },
    stripValue: {
        fontSize: 8, color: '#FFFFFF', fontWeight: 'bold', // Reduced to 8px
        fontFamily: 'Libre Baskerville', marginBottom: 2
    },
    stripLabel: {
        fontSize: 5, color: '#FFFFFF', fontFamily: 'Libre Baskerville' // Reduced to 5px
    },

    // Audience Section
    audienceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
    audienceItem: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '25%',
        height: 60
    },
    audienceValue: {
        fontSize: 20, color: '#FFFFFF', fontWeight: 'bold',
        fontFamily: 'Libre Baskerville', marginBottom: 10
    },
    audienceLabel: {
        fontSize: 9, color: '#ea580c', fontFamily: 'Libre Baskerville',
        textAlign: 'center'
    }

});

const LayoutBold = ({ data }: { data: MediaKitData }) => {
    // Language & Logic
    const t = getTranslations(data.language || (data.labels.aboutMe.toLowerCase().includes('about') ? 'en' : 'pt'));

    // Name Logic - safer splitting
    const nameParts = data.name.split(' ');
    // Handle very long names by checking length
    const firstName = nameParts[0] || 'NAME';
    const lastName = nameParts.slice(1).join(' ') || 'SURNAME';

    // Metrics Preparation
    const formatK = (num: number) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
        return Math.round(num).toString();
    };

    return (
        <Document>
            <Page size="A4" style={stylesBold.page}>

                {/* HEADER SECTION */}
                <View style={stylesBold.headerRow}>
                    {/* Photo Left */}
                    <View style={stylesBold.photoColumn}>
                        {data.photo ? (
                            <Image src={data.photo} style={stylesBold.photo} />
                        ) : (
                            <View style={[stylesBold.photo, { backgroundColor: '#333' }]} />
                        )}
                        <Text style={stylesBold.mediaTextStroke}>MEDIA</Text>
                        <Text style={stylesBold.kitText}>KIT</Text>
                    </View>

                    {/* Info Right */}
                    <View style={stylesBold.infoColumn}>
                        <View style={stylesBold.nameContainer}>
                            {/* Reduced font size for safety */}
                            <Text style={stylesBold.firstNameReal}>{firstName}</Text>
                            <Text style={stylesBold.lastNameReal}>{lastName}</Text>
                        </View>

                        <Text style={stylesBold.roleSubtitle}>INFLUENCER | CONTENT CREATOR</Text>
                        <View style={stylesBold.divider} />

                        <View style={stylesBold.contactContainer}>
                            <View style={stylesBold.contactRow}>
                                <Text style={stylesBold.contactText}>{data.phone}</Text>
                                <IconWhatsApp size={12} color="#ea580c" />
                            </View>
                            <View style={stylesBold.contactRow}>
                                <Text style={stylesBold.contactText}>{data.email}</Text>
                                <IconEmail size={12} color="#ea580c" />
                            </View>
                            <View style={stylesBold.contactRow}>
                                <Text style={stylesBold.contactText}>{data.location}</Text>
                                <IconGeneric size={12} color="#ea580c" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Main Body */}
                <View style={stylesBold.bodyContainer}>

                    {/* ABOUT ME */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={stylesBold.sectionTitle}>{t.about}</Text>
                        <Text style={stylesBold.bioText}>{data.bio}</Text>
                    </View>

                    {/* Explicit Spacer just in case */}
                    <View style={{ height: 20, width: '100%' }} />

                    {/* SOCIAL STATS TITLE */}
                    <Text style={stylesBold.centerTitle}>{t.stats}</Text>

                    {/* TOP STATS ROW (General) */}
                    <View style={stylesBold.topStatsRow}>
                        <View style={stylesBold.topStatItem}>
                            <Text style={stylesBold.topStatValue}>{formatK(data.metrics.averageViews)}+</Text>
                            <Text style={stylesBold.topStatLabel}>{t.avgviews}</Text>
                        </View>
                        <View style={stylesBold.topStatItem}>
                            <Text style={stylesBold.topStatValue}>{formatK(data.metrics.totalFollowers / 20)}</Text>
                            <Text style={stylesBold.topStatLabel}>{t.newsubs}</Text>
                        </View>
                        <View style={stylesBold.topStatItem}>
                            <Text style={stylesBold.topStatValue}>{formatK(data.metrics.totalFollowers * 3)}</Text>
                            <Text style={stylesBold.topStatLabel}>{t.monthlyreach}</Text>
                        </View>
                        <View style={stylesBold.topStatItem}>
                            <Text style={stylesBold.topStatValue}>{formatK(data.metrics.totalFollowers * 0.8)}</Text>
                            <Text style={stylesBold.topStatLabel}>Avg. Blog Views</Text>
                        </View>
                    </View>

                </View>

                {/* ORANGE STRIP (Platform Specific) */}
                <View style={stylesBold.orangeStrip} wrap={false}>
                    {(data.socialMedia || []).slice(0, 4).map((s, i) => (
                        <View key={i} style={stylesBold.stripCard}>
                            <View style={stylesBold.iconCircle}>
                                {renderSocialIcon(s.platform, 10, '#FFFFFF')}
                            </View>
                            <Text style={stylesBold.stripValue}>{formatK(s.followers)}</Text>
                            <Text style={stylesBold.stripLabel}>{s.platform === 'instagram' ? t.followers : s.platform === 'youtube' ? t.subscribers : t.followers}</Text>
                        </View>
                    ))}
                </View>

            </Page>

            {/* PAGE 2: BRANDS & AUDIENCE & EXPECTATIONS */}
            <Page size="A4" style={stylesBold.page}>
                {/* Page 2 Header */}
                <View style={{ width: '100%', alignItems: 'flex-end', borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10, marginBottom: 30 }}>
                    <Text style={{ fontFamily: 'Oswald', fontSize: 18, color: '#ea580c', fontWeight: 'bold' }}>{firstName} {lastName}</Text>
                </View>

                <View style={{ flex: 1, paddingVertical: 10 }}>

                    {/* AUDIENCE SECTIONMOVED TO PAGE 2 */}
                    <View style={{ marginBottom: 50 }}>
                        <Text style={[stylesBold.centerTitle, { fontSize: 20 }]}>{t.audiencetitle}</Text>
                        <View style={stylesBold.audienceRow}>
                            <View style={stylesBold.audienceItem}>
                                <Text style={stylesBold.audienceValue}>{data.audienceAge || '18-35'}</Text>
                                <Text style={stylesBold.audienceLabel}>{t.age}</Text>
                            </View>
                            <View style={stylesBold.audienceItem}>
                                <Text style={stylesBold.audienceValue}>80%</Text>
                                <Text style={stylesBold.audienceLabel}>{t.brazil}</Text>
                            </View>
                            <View style={stylesBold.audienceItem}>
                                <Text style={stylesBold.audienceValue}>{(data.audienceGenderMale || 50)}%</Text>
                                <Text style={stylesBold.audienceLabel}>{t.male}</Text>
                            </View>
                            <View style={stylesBold.audienceItem}>
                                <Text style={stylesBold.audienceValue}>{(data.audienceGenderFemale || 50)}%</Text>
                                <Text style={stylesBold.audienceLabel}>{t.female}</Text>
                            </View>
                        </View>
                    </View>

                    {/* BRANDS SECTION - RESIZED AND GRIDIFIED */}
                    {data.brands && data.brands.length > 0 && (
                        <View style={{ marginBottom: 50 }}>
                            <Text style={[stylesBold.centerTitle, { fontSize: 20, marginBottom: 20 }]}>{t.brands}</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 }}>
                                {data.brands.map((brand, i) => (
                                    <View key={i} style={{
                                        width: 50, height: 50, // Slightly bigger than 45 for better visibility
                                        backgroundColor: '#27272a',
                                        borderRadius: 25,
                                        alignItems: 'center', justifyContent: 'center',
                                        margin: 8,
                                        borderWidth: 1, borderColor: '#ea580c'
                                    }}>
                                        {brand.logo ? (
                                            <Image src={brand.logo} style={{ width: 28, height: 28, objectFit: 'contain' }} />
                                        ) : (
                                            <Text style={{ fontSize: 12, color: '#ea580c', fontWeight: 'bold' }}>{brand.name.charAt(0)}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* WHAT TO EXPECT / SERVICES */}
                    <View style={{ marginTop: 'auto', width: '100%', alignItems: 'center', backgroundColor: '#27272a', padding: 25, borderRadius: 10 }}>
                        <Text style={[stylesBold.sectionTitle, { fontSize: 16, marginBottom: 15 }]}>{t.services}</Text>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: '30%', alignItems: 'center' }}>
                                <IconGeneric size={24} color="#ea580c" />
                                <Text style={{ fontSize: 9, color: '#fff', marginTop: 8, fontWeight: 'bold', textAlign: 'center' }} wrap={false}>{t.svcContentTitle}</Text>
                                <Text style={{ fontSize: 8, color: '#aaa', textAlign: 'center', marginTop: 4 }}>{t.svcContentDesc}</Text>
                            </View>
                            <View style={{ width: '30%', alignItems: 'center' }}>
                                <IconGeneric size={24} color="#ea580c" />
                                <Text style={{ fontSize: 9, color: '#fff', marginTop: 8, fontWeight: 'bold', textAlign: 'center' }} wrap={false}>{t.svcBrandTitle}</Text>
                                <Text style={{ fontSize: 8, color: '#aaa', textAlign: 'center', marginTop: 4 }}>{t.svcBrandDesc}</Text>
                            </View>
                            <View style={{ width: '30%', alignItems: 'center' }}>
                                <IconWhatsApp size={24} color="#ea580c" />
                                <Text style={{ fontSize: 9, color: '#fff', marginTop: 8, fontWeight: 'bold', textAlign: 'center' }} wrap={false}>{t.svcEngageTitle}</Text>
                                <Text style={{ fontSize: 8, color: '#aaa', textAlign: 'center', marginTop: 4 }}>{t.svcEngageDesc}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </Page>
        </Document>
    );
};

export const MediaKitTemplates = {
    Layout1,
    Layout2,
    Layout3,
    Layout4,
    Layout5,
    LayoutCorporate,
    LayoutDark,
    LayoutLines,
    LayoutBold
};
