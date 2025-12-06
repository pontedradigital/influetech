import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

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
    };
}

// --- LAYOUT 1: MODERN MINIMAL (Karina Ryders style) ---
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
                        <Text key={index} style={styles1.contactItem}>
                            {social.platform}: {social.handle}
                            {social.averageViews ? ` (${(social.averageViews / 1000).toFixed(1)}K Views)` : ''}
                        </Text>
                    ))}
                </View>

                <View style={styles1.audienceBox}>
                    <Text style={styles1.audienceTitle}>{data.labels.audience}</Text>
                    <View style={styles1.audienceRow}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2D75E8' }}>18-34</Text>
                            <Text style={{ fontSize: 8 }}>Age Range</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2D75E8' }}>{data.metrics.engagementRate}%</Text>
                            <Text style={{ fontSize: 8 }}>{data.labels.engagement}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles1.rightCol}>
                <View style={styles1.photoContainer}>
                    {data.photo ? (
                        <Image src={data.photo} style={styles1.photo} />
                    ) : (
                        <View style={[styles1.photo, { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: '#888' }}>No Photo</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>

        <View style={styles1.statsRow}>
            <View style={styles1.statItem}>
                <Text style={styles1.statValue}>{(data.metrics.totalFollowers / 1000).toFixed(1)}K</Text>
                <Text style={styles1.statLabel}>{data.labels.followers}</Text>
            </View>
            <View style={styles1.statItem}>
                <Text style={styles1.statValue}>{(data.metrics.averageViews / 1000).toFixed(1)}K</Text>
                <Text style={styles1.statLabel}>{data.labels.views}</Text>
            </View>
            <View style={styles1.statItem}>
                <Text style={styles1.statValue}>{data.metrics.engagementRate}%</Text>
                <Text style={styles1.statLabel}>{data.labels.engagement}</Text>
            </View>
        </View>
    </Page>
);

// --- LAYOUT 2: BOLD & VIBRANT (Martin Mount style) ---
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
                {data.photo ? (
                    <Image src={data.photo} style={styles2.photo} />
                ) : (
                    <View style={[styles2.photo, { backgroundColor: '#333' }]} />
                )}
            </View>
            <View style={styles2.infoCol}>
                <Text style={styles2.name}>{data.name.split(' ')[0]}</Text>
                <Text style={styles2.name}>{data.name.split(' ').slice(1).join(' ')}</Text>
                <Text style={styles2.role}>INFLUENCER</Text>

                <View style={{ marginTop: 20 }}>
                    <Text style={styles2.contact}>{data.phone} 📞</Text>
                    <Text style={styles2.contact}>{data.email} ✉️</Text>
                    <Text style={styles2.contact}>{data.location} 📍</Text>
                </View>
            </View>
        </View>

        <View style={styles2.aboutSection}>
            <Text style={styles2.sectionTitle}>{data.labels.aboutMe}</Text>
            <Text style={styles2.text}>{data.bio || ''}</Text>
        </View>

        <View style={styles2.statsContainer}>
            <View style={styles2.statItem}>
                <Text style={styles2.statValue}>{(data.metrics.totalFollowers / 1000).toFixed(1)}K</Text>
                <Text style={styles2.statLabel}>{data.labels.followers}</Text>
            </View>
            <View style={styles2.statItem}>
                <Text style={styles2.statValue}>{(data.metrics.averageViews / 1000).toFixed(1)}K</Text>
                <Text style={styles2.statLabel}>{data.labels.views}</Text>
            </View>
            <View style={styles2.statItem}>
                <Text style={styles2.statValue}>{data.metrics.engagementRate}%</Text>
                <Text style={styles2.statLabel}>{data.labels.engagement}</Text>
            </View>
        </View>

        <View style={{ paddingHorizontal: 30, marginTop: 20 }}>
            <Text style={styles2.sectionTitle}>{data.labels.socialStats}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {(data.socialMedia || []).map((social, index) => (
                    <View key={index} style={{ backgroundColor: '#222', padding: 10, borderRadius: 5, marginRight: 15, marginBottom: 15 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 10 }}>{social.platform}</Text>
                        <Text style={{ color: '#D35400', fontSize: 12 }}>{social.handle}</Text>
                        {social.averageViews ? (
                            <Text style={{ color: '#aaa', fontSize: 8 }}>{(social.averageViews / 1000).toFixed(1)}K Views</Text>
                        ) : null}
                    </View>
                ))}
            </View>
        </View>
    </Page>
);

// --- LAYOUT 3: PROFESSIONAL CORPORATE (Sunil Kumar style) ---
const styles3 = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#000', color: '#fff', fontFamily: 'Helvetica' },
    header: { flexDirection: 'row', marginBottom: 30 },
    photo: { width: 100, height: 100, borderRadius: 10, marginRight: 20 },
    headerText: { flex: 1, justifyContent: 'center' },
    quote: { fontSize: 12, fontStyle: 'italic', color: '#ccc', borderLeft: '2px solid #333', paddingLeft: 10 },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    card: { backgroundColor: '#111', padding: 15, borderRadius: 8, width: '48%', border: '1px solid #222', marginBottom: 15, marginRight: '2%' },
    cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
    cardSubtitle: { fontSize: 10, color: '#666', marginBottom: 10 },
    cardText: { fontSize: 10, color: '#aaa', lineHeight: 1.4 },
    tagContainer: { flexDirection: 'row', marginTop: 5, flexWrap: 'wrap' },
    tag: { fontSize: 8, backgroundColor: '#222', paddingVertical: 3, paddingHorizontal: 6, borderRadius: 4, color: '#ccc', marginRight: 5, marginBottom: 5 },
    footer: { marginTop: 'auto', flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid #222', paddingTop: 20 },
    footerItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
    footerText: { fontSize: 10, color: '#888' },
});

const Layout3 = ({ data }: { data: MediaKitData }) => (
    <Page size="A4" style={styles3.page}>
        <View style={styles3.header}>
            {data.photo ? (
                <Image src={data.photo} style={styles3.photo} />
            ) : (
                <View style={[styles3.photo, { backgroundColor: '#222' }]} />
            )}
            <View style={styles3.headerText}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>{data.name}</Text>
                <Text style={styles3.quote}>"{data.bio || ''}"</Text>
            </View>
        </View>

        <View style={styles3.grid}>
            <View style={styles3.card}>
                <Text style={styles3.cardTitle}>{data.labels.aboutMe}</Text>
                <Text style={styles3.cardSubtitle}>Influencer & Creator</Text>
                <Text style={styles3.cardText}>{data.niche}</Text>
            </View>

            <View style={styles3.card}>
                <Text style={styles3.cardTitle}>{data.labels.metrics}</Text>
                <Text style={styles3.cardText}>• {data.metrics.totalFollowers.toLocaleString()} {data.labels.followers}</Text>
                <Text style={styles3.cardText}>• {data.metrics.engagementRate}% {data.labels.engagement}</Text>
                <Text style={styles3.cardText}>• {data.metrics.averageViews.toLocaleString()} {data.labels.views}</Text>
            </View>

            <View style={styles3.card}>
                <Text style={styles3.cardTitle}>{data.labels.socialStats}</Text>
                <View style={styles3.tagContainer}>
                    {(data.socialMedia || []).map((social, index) => (
                        <Text key={index} style={styles3.tag}>
                            {social.platform.substring(0, 2).toUpperCase()}: {social.handle}
                        </Text>
                    ))}
                </View>
            </View>

            <View style={styles3.card}>
                <Text style={styles3.cardTitle}>Interests</Text>
                <View style={styles3.tagContainer}>
                    {(data.partnershipPreferences.categories || []).map((cat, i) => (
                        <Text key={i} style={styles3.tag}>{cat}</Text>
                    ))}
                </View>
            </View>
        </View>

        <View style={styles3.footer}>
            <View style={styles3.footerItem}>
                <Text style={styles3.footerText}>{data.email}</Text>
            </View>
            <View style={styles3.footerItem}>
                <Text style={styles3.footerText}>{data.phone}</Text>
            </View>
            <View style={styles3.footerItem}>
                <Text style={styles3.footerText}>{data.location}</Text>
            </View>
        </View>
    </Page>
);

// --- LAYOUT 4: CREATIVE PORTFOLIO (Chandan Das style) ---
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
    skillItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    barBg: { width: 100, height: 6, backgroundColor: '#BFDBFE', borderRadius: 3, marginTop: 4 },
    barFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: 3 },
});

const Layout4 = ({ data }: { data: MediaKitData }) => (
    <Page size="A4" style={styles4.page}>
        <View style={styles4.header}>
            <View style={styles4.photoBox}>
                {data.photo ? (
                    <Image src={data.photo} style={styles4.photo} />
                ) : (
                    <View style={{ width: '100%', height: '100%', backgroundColor: '#84CC16' }} />
                )}
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles4.titleBox}>
                    <Text style={styles4.name}>{data.name}</Text>
                    <Text style={styles4.role}>{data.niche} Influencer</Text>
                </View>
                <View style={styles4.contactBox}>
                    <Text style={styles4.contactText}>✉️ {data.email}</Text>
                    <Text style={styles4.contactText}>📞 {data.phone}</Text>
                </View>
            </View>
        </View>

        <View style={styles4.orangeBar}>
            <Text style={styles4.orangeTitle}>{data.labels.metrics}</Text>
            <Text style={styles4.orangeTitle}>{data.metrics.totalFollowers.toLocaleString()} {data.labels.followers}</Text>
            <Text style={styles4.orangeTitle}>{data.metrics.engagementRate}% {data.labels.engagement}</Text>
        </View>

        <View style={styles4.row}>
            <View style={styles4.blueSection}>
                <Text style={[styles4.sectionTitle, styles4.whiteText]}>{data.labels.aboutMe}</Text>
                <Text style={{ color: '#DBEAFE', fontSize: 10, lineHeight: 1.5 }}>{data.bio || ''}</Text>

                <Text style={[styles4.sectionTitle, styles4.whiteText, { marginTop: 20 }]}>{data.labels.socialStats}</Text>
                {(data.socialMedia || []).map((social, index) => (
                    <Text key={index} style={{ color: '#fff', fontSize: 12, marginBottom: 5 }}>
                        {social.platform}: {social.handle}
                    </Text>
                ))}
            </View>

            <View style={styles4.graySection}>
                <Text style={[styles4.sectionTitle, styles4.darkText]}>{data.labels.audience}</Text>
                <View style={styles4.skillItem}>
                    <Text style={{ fontSize: 10 }}>Engagement</Text>
                    <View style={styles4.barBg}><View style={[styles4.barFill, { width: `${(data.metrics.engagementRate || 0) * 10}%` }]} /></View>
                </View>
                <View style={styles4.skillItem}>
                    <Text style={{ fontSize: 10 }}>Reach</Text>
                    <View style={styles4.barBg}><View style={[styles4.barFill, { width: '80%' }]} /></View>
                </View>

                <Text style={[styles4.sectionTitle, styles4.darkText, { marginTop: 20 }]}>Categories</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {(data.partnershipPreferences.categories || []).map((cat, i) => (
                        <Text key={i} style={{ fontSize: 9, backgroundColor: '#fff', padding: 5, borderRadius: 4, marginRight: 5, marginBottom: 5 }}>{cat}</Text>
                    ))}
                </View>
            </View>
        </View>
    </Page>
);

// --- LAYOUT 5: TECH/DARK MODE (Nguyen Duc Thang style) ---
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
    contactRow: { flexDirection: 'row', marginTop: 10 },
    contactItem: { fontSize: 10, color: '#CBD5E1', marginRight: 20 },
    purpleBox: { backgroundColor: '#4338CA', borderRadius: 20, padding: 25, flexDirection: 'row' },
    col: { flex: 1 },
    statTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
    statText: { fontSize: 10, color: '#E0E7FF', marginBottom: 5 },
    iconBox: { flexDirection: 'row', marginTop: 10 },
    icon: { width: 30, height: 30, backgroundColor: '#312E81', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
});

const Layout5 = ({ data }: { data: MediaKitData }) => (
    <Page size="A4" style={styles5.page}>
        <View style={styles5.headerBg} />
        <View style={styles5.content}>
            <View style={styles5.header}>
                <View style={{ width: '50%' }}>
                    <Text style={styles5.title}>{data.labels.aboutMe}</Text>
                    <Text style={[styles5.text, { marginTop: 10 }]}>{data.bio || ''}</Text>

                    <View style={{ marginTop: 20 }}>
                        <Text style={styles5.sectionTitle}>{data.labels.contact}</Text>
                        <Text style={styles5.contactItem}>{data.email}</Text>
                        <Text style={styles5.contactItem}>{data.phone}</Text>
                    </View>
                </View>
                <View style={styles5.photoContainer}>
                    {data.photo ? (
                        <Image src={data.photo} style={styles5.photo} />
                    ) : (
                        <View style={{ width: '100%', height: '100%', backgroundColor: '#333' }} />
                    )}
                </View>
            </View>

            <View style={styles5.purpleBox}>
                <View style={styles5.col}>
                    <Text style={styles5.statTitle}>{data.labels.metrics}</Text>
                    <Text style={styles5.statText}>{data.metrics.totalFollowers.toLocaleString()} {data.labels.followers}</Text>
                    <Text style={styles5.statText}>{data.metrics.engagementRate}% {data.labels.engagement}</Text>
                </View>
                <View style={styles5.col}>
                    <Text style={styles5.statTitle}>{data.labels.socialStats}</Text>
                    {(data.socialMedia || []).map((social, index) => (
                        <Text key={index} style={styles5.statText}>
                            {social.platform}: {social.handle}
                        </Text>
                    ))}
                </View>
                <View style={styles5.col}>
                    <Text style={styles5.statTitle}>Interests</Text>
                    {(data.partnershipPreferences.categories || []).slice(0, 4).map((cat, i) => (
                        <Text key={i} style={styles5.statText}>• {cat}</Text>
                    ))}
                </View>
            </View>
        </View>
    </Page>
);

// --- LAYOUT 6: CORPORATE PROFESSIONAL (Based on HTML template) ---
const stylesCorporate = StyleSheet.create({
    page: { backgroundColor: '#fafafa', fontFamily: 'Helvetica' },
    header: { backgroundColor: '#2c3e50', color: '#fff', padding: '60px 40px' },
    headerTitle: { fontSize: 42, fontWeight: 300, marginBottom: 15, lineHeight: 1.2 },
    divider: { width: 60, height: 3, backgroundColor: '#c9a961', marginVertical: 20 },
    subtitle: { fontSize: 16, opacity: 0.9, fontWeight: 300, fontStyle: 'italic' },
    content: { padding: '40px 40px' },
    section: { marginBottom: 50 },
    sectionTitle: { fontSize: 24, marginBottom: 10, color: '#2c3e50', fontWeight: 400, borderBottom: '2px solid #c9a961', paddingBottom: 10 },
    sectionSubtitle: { fontSize: 12, color: '#7f8c8d', marginBottom: 25, fontStyle: 'italic' },
    introText: { fontSize: 14, lineHeight: 1.8, color: '#34495e', marginBottom: 20 },
    bioText: { fontSize: 12, lineHeight: 1.9, color: '#555', textAlign: 'justify' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', border: '1px solid #e0e0e0', marginVertical: 30 },
    statItem: { flex: 1, padding: '25px 20px', textAlign: 'center', borderRight: '1px solid #e0e0e0' },
    statPlatform: { fontSize: 10, color: '#95a5a6', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 15 },
    statNumber: { fontSize: 36, color: '#2c3e50', fontWeight: 300, marginBottom: 8 },
    statLabel: { fontSize: 10, color: '#7f8c8d' },
    metricsLayout: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 30 },
    metricBox: { width: '48%', padding: 25, backgroundColor: '#f8f9fa', borderLeft: '4px solid #c9a961', marginBottom: 15 },
    metricTitle: { fontSize: 10, color: '#95a5a6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
    metricValue: { fontSize: 28, color: '#2c3e50', fontWeight: 300 },
    metricDescription: { fontSize: 10, color: '#7f8c8d', marginTop: 8, lineHeight: 1.6 },
    audienceGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 30 },
    audienceCard: { width: '31%', textAlign: 'center', padding: '25px 15px', border: '1px solid #e0e0e0', marginBottom: 15 },
    audienceIcon: { fontSize: 32, marginBottom: 15 },
    audienceLabel: { fontSize: 10, color: '#95a5a6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
    audienceValue: { fontSize: 16, color: '#2c3e50', fontWeight: 400 },
    contactSection: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 30, paddingVertical: 30, borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' },
    contactItem: { flex: 1, textAlign: 'center' },
    contactIcon: { fontSize: 24, marginBottom: 15, color: '#c9a961' },
    contactLabel: { fontSize: 9, color: '#95a5a6', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 },
    contactValue: { fontSize: 12, color: '#2c3e50' },
    testimonialSection: { backgroundColor: '#2c3e50', color: '#fff', padding: '40px 35px', textAlign: 'center', marginHorizontal: -40, marginTop: 40 },
    testimonialQuote: { fontSize: 16, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20, fontWeight: 300 },
    testimonialAuthor: { fontSize: 12, color: '#c9a961', textTransform: 'uppercase', letterSpacing: 2 },
    footer: { backgroundColor: '#2c3e50', color: '#fff', padding: '25px 40px', textAlign: 'center', fontSize: 10, opacity: 0.8, marginHorizontal: -40 },
});

const LayoutCorporate = ({ data }: { data: MediaKitData }) => (
    <Document>
        <Page size="A4" style={stylesCorporate.page}>
            <View style={stylesCorporate.header}>
                <Text style={stylesCorporate.headerTitle}>{data.name}</Text>
                <View style={stylesCorporate.divider} />
                <Text style={stylesCorporate.subtitle}>Digital Content Creator & {data.niche} Specialist</Text>
            </View>

            <View style={stylesCorporate.content}>
                <View style={stylesCorporate.section}>
                    <Text style={stylesCorporate.introText}>
                        Profissional especializado em criação de conteúdo digital, com foco em {data.niche.toLowerCase()}.
                        Experiência comprovada em análises técnicas e engajamento de audiências qualificadas.
                    </Text>
                    <Text style={stylesCorporate.bioText}>{data.bio || ''}</Text>
                </View>

                <View style={stylesCorporate.section}>
                    <Text style={stylesCorporate.sectionTitle}>Alcance nas Plataformas</Text>
                    <Text style={stylesCorporate.sectionSubtitle}>Audiência consolidada e crescimento consistente</Text>

                    <View style={stylesCorporate.statsContainer}>
                        {(data.socialMedia || []).slice(0, 4).map((social, index) => (
                            <View key={index} style={[stylesCorporate.statItem, index === 3 && { borderRight: 'none' }]}>
                                <Text style={stylesCorporate.statPlatform}>{social.platform}</Text>
                                <Text style={stylesCorporate.statNumber}>{(social.followers / 1000).toFixed(0)}K</Text>
                                <Text style={stylesCorporate.statLabel}>{social.followers >= 1000 ? 'Seguidores' : 'Conexões'}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={stylesCorporate.section}>
                    <Text style={stylesCorporate.sectionTitle}>Métricas de Performance</Text>
                    <Text style={stylesCorporate.sectionSubtitle}>Resultados mensuráveis e engajamento qualificado</Text>

                    <View style={stylesCorporate.metricsLayout}>
                        <View style={stylesCorporate.metricBox}>
                            <Text style={stylesCorporate.metricTitle}>Taxa de Engajamento</Text>
                            <Text style={stylesCorporate.metricValue}>{data.metrics.engagementRate}%</Text>
                            <Text style={stylesCorporate.metricDescription}>
                                Acima da média da indústria, demonstrando conexão genuína com a audiência
                            </Text>
                        </View>
                        <View style={stylesCorporate.metricBox}>
                            <Text style={stylesCorporate.metricTitle}>Alcance Mensal</Text>
                            <Text style={stylesCorporate.metricValue}>{(data.metrics.totalFollowers / 1000).toFixed(0)}K</Text>
                            <Text style={stylesCorporate.metricDescription}>
                                Impressões mensais médias em todas as plataformas combinadas
                            </Text>
                        </View>
                        <View style={stylesCorporate.metricBox}>
                            <Text style={stylesCorporate.metricTitle}>Visualizações Médias</Text>
                            <Text style={stylesCorporate.metricValue}>{(data.metrics.averageViews / 1000).toFixed(0)}K</Text>
                            <Text style={stylesCorporate.metricDescription}>
                                Por vídeo nos últimos 90 dias, com tendência de crescimento
                            </Text>
                        </View>
                        <View style={stylesCorporate.metricBox}>
                            <Text style={stylesCorporate.metricTitle}>Frequência de Conteúdo</Text>
                            <Text style={stylesCorporate.metricValue}>{data.metrics.contentFrequency}</Text>
                            <Text style={stylesCorporate.metricDescription}>
                                Publicações regulares mantendo audiência engajada
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Page>

        <Page size="A4" style={stylesCorporate.page}>
            <View style={stylesCorporate.content}>
                <View style={stylesCorporate.section}>
                    <Text style={stylesCorporate.sectionTitle}>Perfil da Audiência</Text>
                    <Text style={stylesCorporate.sectionSubtitle}>Demografia detalhada e insights comportamentais</Text>

                    <View style={stylesCorporate.audienceGrid}>
                        <View style={stylesCorporate.audienceCard}>
                            <Text style={stylesCorporate.audienceIcon}>👥</Text>
                            <Text style={stylesCorporate.audienceLabel}>Faixa Etária</Text>
                            <Text style={stylesCorporate.audienceValue}>25-40 anos</Text>
                        </View>
                        <View style={stylesCorporate.audienceCard}>
                            <Text style={stylesCorporate.audienceIcon}>💼</Text>
                            <Text style={stylesCorporate.audienceLabel}>Perfil Profissional</Text>
                            <Text style={stylesCorporate.audienceValue}>Classe A/B</Text>
                        </View>
                        <View style={stylesCorporate.audienceCard}>
                            <Text style={stylesCorporate.audienceIcon}>🌍</Text>
                            <Text style={stylesCorporate.audienceLabel}>Localização</Text>
                            <Text style={stylesCorporate.audienceValue}>{data.location}</Text>
                        </View>
                        <View style={stylesCorporate.audienceCard}>
                            <Text style={stylesCorporate.audienceIcon}>🎯</Text>
                            <Text style={stylesCorporate.audienceLabel}>Interesse Principal</Text>
                            <Text style={stylesCorporate.audienceValue}>{data.niche}</Text>
                        </View>
                        <View style={stylesCorporate.audienceCard}>
                            <Text style={stylesCorporate.audienceIcon}>💳</Text>
                            <Text style={stylesCorporate.audienceLabel}>Poder Aquisitivo</Text>
                            <Text style={stylesCorporate.audienceValue}>Alto (72%)</Text>
                        </View>
                        <View style={stylesCorporate.audienceCard}>
                            <Text style={stylesCorporate.audienceIcon}>⚖️</Text>
                            <Text style={stylesCorporate.audienceLabel}>Engajamento</Text>
                            <Text style={stylesCorporate.audienceValue}>{data.metrics.engagementRate}%</Text>
                        </View>
                    </View>
                </View>

                <View style={stylesCorporate.section}>
                    <Text style={stylesCorporate.sectionTitle}>Entre em Contato</Text>
                    <Text style={stylesCorporate.sectionSubtitle}>Vamos construir algo extraordinário juntos</Text>

                    <View style={stylesCorporate.contactSection}>
                        <View style={stylesCorporate.contactItem}>
                            <Text style={stylesCorporate.contactIcon}>📧</Text>
                            <Text style={stylesCorporate.contactLabel}>E-mail Profissional</Text>
                            <Text style={stylesCorporate.contactValue}>{data.email}</Text>
                        </View>
                        <View style={stylesCorporate.contactItem}>
                            <Text style={stylesCorporate.contactIcon}>📱</Text>
                            <Text style={stylesCorporate.contactLabel}>WhatsApp Business</Text>
                            <Text style={stylesCorporate.contactValue}>{data.phone}</Text>
                        </View>
                        <View style={stylesCorporate.contactItem}>
                            <Text style={stylesCorporate.contactIcon}>🌐</Text>
                            <Text style={stylesCorporate.contactLabel}>Redes Sociais</Text>
                            <Text style={stylesCorporate.contactValue}>{(data.socialMedia || [])[0]?.handle || 'N/A'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={stylesCorporate.testimonialSection}>
                <Text style={stylesCorporate.testimonialQuote}>
                    "Profissional excepcional, com análises técnicas precisas e apresentação impecável.
                    A parceria resultou em engajamento acima das expectativas e ROI mensurável."
                </Text>
                <Text style={stylesCorporate.testimonialAuthor}>— Gerente de Marketing, Empresa Tech</Text>
            </View>

            <View style={stylesCorporate.footer}>
                <Text>© 2025 {data.name}. Todos os direitos reservados.</Text>
            </View>
        </Page>
    </Document>
);

export const MediaKitTemplates = {
    Layout1,
    Layout2,
    Layout3,
    Layout4,
    Layout5,
    LayoutCorporate
};
