import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, Svg, Path, G, Circle, Rect, Polygon } from '@react-pdf/renderer';

// Register fonts (using standard fonts for now to ensure compatibility)
// In a real app, we would register custom fonts like 'Inter', 'Roboto', etc.

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
}

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
    brandsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
    brandCard: {
        width: '30%', // 3 columns
        height: 60,
        // backgroundColor: '#f8fafc', // Remove bg
        // borderRadius: 8,
        // borderWidth: 1,
        // borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 5, // Remove padding
        marginBottom: 8
    },
    brandLogo: { width: 50, height: 50, objectFit: 'contain', borderRadius: 25 }, // Fixed size circle
    brandName: { fontSize: 7, color: '#64748b', marginTop: 4, textAlign: 'center' }
});

const LayoutCorporate = ({ data }: { data: MediaKitData }) => {
    // Language detection logic
    const languageCode = data.labels.aboutMe.toLowerCase().includes('about') ? 'en' : 'pt';
    const isEnglish = languageCode === 'en';

    const t = {
        about: isEnglish ? 'About Creator' : 'Sobre o Criador',
        followers: isEnglish ? 'Followers' : 'Seguidores',
        reach: isEnglish ? 'Platform Reach' : 'Alcance Total',
        impact: isEnglish ? 'Performance Impact' : 'Impacto & Performance',
        audience: isEnglish ? 'Audience Profile' : 'Perfil da Audiência',

        // Metrics translations
        engagement: isEnglish ? 'Engagement' : 'Engajamento',
        monthlyReach: isEnglish ? 'Monthly Reach' : 'Alcance Mensal',
        avgViews: isEnglish ? 'Avg. Views' : 'Vis. Médias',
        frequency: isEnglish ? 'Content Freq.' : 'Frequência',

        // Descriptions
        descEng: isEnglish ? 'Above industry average interaction' : 'Interação acima da média',
        descReach: isEnglish ? 'Impressions across all platforms' : 'Impressões em todas as redes',
        descViews: isEnglish ? 'Per video (last 90 days)' : 'Por vídeo (últimos 90 dias)',

        // Audience
        age: isEnglish ? 'Age Range' : 'Faixa Etária',
        loc: isEnglish ? 'Top Location' : 'Localização',
        niche: isEnglish ? 'Main Niche' : 'Nicho Principal',
        power: isEnglish ? 'Spending Power' : 'Poder Aquisitivo',

        brands: isEnglish ? 'Trusted By' : 'Marcas Parceiras', // Translation
    };

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
                    <Text style={[stylesModern.headerTagline, { fontSize: 10 }]}>{t.impact}</Text>
                </View>

                {/* Metrics */}
                <View style={stylesModern.section}>
                    <View style={stylesModern.sectionHeader}>
                        <View style={stylesModern.sectionBar} />
                        <Text style={stylesModern.sectionTitle}>{t.impact}</Text>
                    </View>
                    <View style={stylesModern.metricsGrid}>
                        <View style={stylesModern.metricCard}>
                            <Text style={stylesModern.metricTitle}>{t.engagement}</Text>
                            <Text style={stylesModern.metricValue}>{data.metrics.engagementRate}%</Text>
                            <Text style={stylesModern.metricDesc}>{t.descEng}</Text>
                        </View>
                        <View style={stylesModern.metricCard}>
                            <Text style={stylesModern.metricTitle}>{t.monthlyReach}</Text>
                            <Text style={stylesModern.metricValue}>{(data.metrics.totalFollowers / 1000).toFixed(0)}K</Text>
                            <Text style={stylesModern.metricDesc}>{t.descReach}</Text>
                        </View>
                        <View style={stylesModern.metricCard}>
                            <Text style={stylesModern.metricTitle}>{t.avgViews}</Text>
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
                        <Text style={stylesModern.sectionTitle}>{t.audience}</Text>
                    </View>
                    <View style={stylesModern.audienceRow}>
                        <View style={stylesModern.audienceItem}>
                            <Text style={stylesModern.audienceLabel}>{t.age}</Text>
                            <Text style={stylesModern.audienceValue}>25-40 {isEnglish ? 'y.o.' : 'anos'}</Text>
                        </View>
                        <View style={stylesModern.audienceItem}>
                            <Text style={stylesModern.audienceLabel}>{t.loc}</Text>
                            <Text style={stylesModern.audienceValue}>{data.location}</Text>
                        </View>
                    </View>
                    <View style={stylesModern.audienceRow}>
                        <View style={stylesModern.audienceItem}>
                            <Text style={stylesModern.audienceLabel}>{t.power}</Text>
                            <Text style={stylesModern.audienceValue}>High (72%)</Text>
                        </View>
                        <View style={stylesModern.audienceItem}>
                            <Text style={stylesModern.audienceLabel}>{t.niche}</Text>
                            <Text style={stylesModern.audienceValue}>{data.niche}</Text>
                        </View>
                    </View>
                </View>

                {/* Brands Section (Only if brands exist) */}
                {data.brands && data.brands.length > 0 && (
                    <View style={stylesModern.section}>
                        <View style={stylesModern.sectionHeader}>
                            <View style={stylesModern.sectionBar} />
                            <Text style={stylesModern.sectionTitle}>{t.brands}</Text>
                        </View>
                        <View style={stylesModern.brandsGrid}>
                            {data.brands.map((brand, index) => (
                                <View key={index} style={stylesModern.brandCard} wrap={false}>
                                    <View style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden',
                                        backgroundColor: (brand as any).backgroundColor || '#ffffff', // Dynamic background
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {brand.logo ? (
                                            <Image src={brand.logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#cbd5e1' }}>{brand.name.charAt(0)}</Text>
                                        )}
                                    </View>
                                    {/* Optional: Show name if no logo, or maybe always show name below? */}
                                    <Text style={stylesModern.brandName}>{brand.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Footer Quote */}
                <View style={[stylesModern.contactSection, { marginTop: 'auto', backgroundColor: '#f8fafc', borderTopColor: '#e2e8f0' }]}>
                    <Text style={{ textAlign: 'center', color: '#64748b', fontSize: 10, fontStyle: 'italic' }}>
                        "{isEnglish ? 'Let\'s create something extraordinary.' : 'Vamos criar algo extraordinário juntos.'}"
                    </Text>
                    <Text style={{ textAlign: 'center', color: '#cbd5e1', fontSize: 8, marginTop: 5, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {isEnglish ? 'Partnership Media Kit' : 'MediaKit para Parcerias'}
                    </Text>
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
    LayoutCorporate
};
