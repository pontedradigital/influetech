import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

// Translations
const translations = {
    pt: {
        coverSubtitle: 'Media Kit - Influenciador Tech',
        aboutTitle: 'Sobre Mim',
        metricsTitle: 'Métricas de Alcance',
        totalFollowers: 'Total de Seguidores',
        engagementRate: 'Taxa de Engajamento',
        avgViews: 'Média de Visualizações',
        contentFreq: 'Frequência de Conteúdo',
        contentTypesTitle: 'Tipos de Conteúdo',
        partnershipTitle: 'Oportunidades de Parceria',
        partnershipIntro: 'Estou sempre aberta a colaborações com marcas que compartilham dos mesmos valores de qualidade e inovação. Juntos, podemos criar conteúdo autêntico que ressoa com minha audiência engajada.',
        categoriesTitle: 'Categorias de Interesse',
        partnershipType: 'Tipo de Parceria',
        minInvestment: 'Investimento Mínimo',
        whyPartnerTitle: 'Por Que Fazer Parceria Comigo?',
        reason1: 'Alto Engajamento',
        reason1Desc: 'Taxa de {rate}% - muito acima da média do mercado',
        reason2: 'Audiência Qualificada',
        reason2Desc: 'Seguidores interessados em tecnologia e inovação',
        reason3: 'Conteúdo Profissional',
        reason3Desc: 'Reviews detalhados e honestos que geram confiança',
        reason4: 'Presença Multiplataforma',
        reason4Desc: 'Instagram, TikTok e YouTube para máximo alcance',
        reason5: 'Consistência',
        reason5Desc: 'Publicações regulares mantendo a audiência engajada',
        reason6: 'ROI Comprovado',
        reason6Desc: 'Histórico de parcerias bem-sucedidas com conversão real',
        letsConnectTitle: 'Vamos Conversar?',
        letsConnectText: 'Estou ansiosa para discutir como podemos criar uma parceria de sucesso que beneficie ambas as partes!',
        email: 'Email',
        phone: 'Telefone',
        generatedOn: 'Gerado em',
        location: 'Localização',
        niche: 'Nicho'
    },
    en: {
        coverSubtitle: 'Media Kit - Tech Influencer',
        aboutTitle: 'About Me',
        metricsTitle: 'Reach Metrics',
        totalFollowers: 'Total Followers',
        engagementRate: 'Engagement Rate',
        avgViews: 'Average Views',
        contentFreq: 'Content Frequency',
        contentTypesTitle: 'Content Types',
        partnershipTitle: 'Partnership Opportunities',
        partnershipIntro: 'I am always open to collaborations with brands that share the same values of quality and innovation. Together, we can create authentic content that resonates with my engaged audience.',
        categoriesTitle: 'Categories of Interest',
        partnershipType: 'Partnership Type',
        minInvestment: 'Minimum Investment',
        whyPartnerTitle: 'Why Partner With Me?',
        reason1: 'High Engagement',
        reason1Desc: '{rate}% rate - well above market average',
        reason2: 'Qualified Audience',
        reason2Desc: 'Followers interested in technology and innovation',
        reason3: 'Professional Content',
        reason3Desc: 'Detailed and honest reviews that build trust',
        reason4: 'Multi-Platform Presence',
        reason4Desc: 'Instagram, TikTok and YouTube for maximum reach',
        reason5: 'Consistency',
        reason5Desc: 'Regular posts keeping the audience engaged',
        reason6: 'Proven ROI',
        reason6Desc: 'Track record of successful partnerships with real conversion',
        letsConnectTitle: 'Let\'s Connect?',
        letsConnectText: 'I\'m excited to discuss how we can create a successful partnership that benefits both parties!',
        email: 'Email',
        phone: 'Phone',
        generatedOn: 'Generated on',
        location: 'Location',
        niche: 'Niche'
    },
    es: {
        coverSubtitle: 'Media Kit - Influencer Tech',
        aboutTitle: 'Sobre Mí',
        metricsTitle: 'Métricas de Alcance',
        totalFollowers: 'Total de Seguidores',
        engagementRate: 'Tasa de Engagement',
        avgViews: 'Promedio de Visualizaciones',
        contentFreq: 'Frecuencia de Contenido',
        contentTypesTitle: 'Tipos de Contenido',
        partnershipTitle: 'Oportunidades de Asociación',
        partnershipIntro: 'Siempre estoy abierta a colaboraciones con marcas que comparten los mismos valores de calidad e innovación. Juntos, podemos crear contenido auténtico que resuene con mi audiencia comprometida.',
        categoriesTitle: 'Categorías de Interés',
        partnershipType: 'Tipo de Asociación',
        minInvestment: 'Inversión Mínima',
        whyPartnerTitle: '¿Por Qué Asociarse Conmigo?',
        reason1: 'Alto Engagement',
        reason1Desc: 'Tasa del {rate}% - muy por encima del promedio del mercado',
        reason2: 'Audiencia Calificada',
        reason2Desc: 'Seguidores interesados en tecnología e innovación',
        reason3: 'Contenido Profesional',
        reason3Desc: 'Reviews detalladas y honestas que generan confianza',
        reason4: 'Presencia Multiplataforma',
        reason4Desc: 'Instagram, TikTok y YouTube para máximo alcance',
        reason5: 'Consistencia',
        reason5Desc: 'Publicaciones regulares manteniendo la audiencia comprometida',
        reason6: 'ROI Comprobado',
        reason6Desc: 'Historial de asociaciones exitosas con conversión real',
        letsConnectTitle: '¿Hablamos?',
        letsConnectText: '¡Estoy ansiosa por discutir cómo podemos crear una asociación exitosa que beneficie a ambas partes!',
        email: 'Email',
        phone: 'Teléfono',
        generatedOn: 'Generado el',
        location: 'Ubicación',
        niche: 'Nicho'
    },
    zh: {
        coverSubtitle: '媒体资料包 - 科技影响者',
        aboutTitle: '关于我',
        metricsTitle: '影响力指标',
        totalFollowers: '总粉丝数',
        engagementRate: '互动率',
        avgViews: '平均观看量',
        contentFreq: '内容频率',
        contentTypesTitle: '内容类型',
        partnershipTitle: '合作机会',
        partnershipIntro: '我始终欢迎与分享相同质量和创新价值观的品牌合作。我们可以共同创造与我的活跃受众产生共鸣的真实内容。',
        categoriesTitle: '感兴趣的类别',
        partnershipType: '合作类型',
        minInvestment: '最低投资',
        whyPartnerTitle: '为什么与我合作？',
        reason1: '高互动率',
        reason1Desc: '{rate}% 的互动率 - 远高于市场平均水平',
        reason2: '优质受众',
        reason2Desc: '对技术和创新感兴趣的粉丝',
        reason3: '专业内容',
        reason3Desc: '详细诚实的评测建立信任',
        reason4: '多平台影响力',
        reason4Desc: 'Instagram、TikTok 和 YouTube 实现最大覆盖',
        reason5: '持续性',
        reason5Desc: '定期发布保持受众参与度',
        reason6: '经过验证的投资回报率',
        reason6Desc: '成功合作的记录和真实转化',
        letsConnectTitle: '让我们联系？',
        letsConnectText: '我很高兴讨论如何创建一个双方都受益的成功合作伙伴关系！',
        email: '电子邮件',
        phone: '电话',
        generatedOn: '生成于',
        location: '位置',
        niche: '领域'
    }
};

// Mock data
const mockInfluencerData = {
    name: 'Ana Oliveira',
    bio: 'Criadora de conteúdo especializada em reviews de hardware e gadgets tech. Apaixonada por tecnologia e inovação.',
    location: 'São Paulo, Brasil',
    email: 'ana.oliveira@email.com',
    phone: '(11) 99999-9999',

    socialMedia: {
        instagram: '@ana.tech',
        tiktok: '@ana.tech',
        youtube: '@AnaOliveiraTech'
    },

    metrics: {
        totalFollowers: 125000,
        engagementRate: 8.5,
        averageViews: 45000,
        contentFrequency: '3-4 posts por semana'
    },

    niche: 'Hardware e Componentes',
    contentTypes: ['Reviews', 'Unboxing', 'Tutoriais', 'Comparativos'],

    partnershipPreferences: {
        categories: ['Hardware', 'Periféricos', 'Notebooks', 'Monitores'],
        type: 'Todas as opções',
        minimumValue: 500
    }
};

// Enhanced PDF Styles
const styles = StyleSheet.create({
    page: {
        padding: 0,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica'
    },
    coverPage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundColor: '#667eea',
        padding: 60
    },
    coverTitle: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
        textAlign: 'center',
        letterSpacing: 2
    },
    coverSubtitle: {
        fontSize: 22,
        color: '#e0e7ff',
        marginBottom: 60,
        textAlign: 'center',
        fontWeight: 'normal'
    },
    socialContainer: {
        marginTop: 40,
        padding: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        width: '80%'
    },
    socialHandle: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 12,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    contentPage: {
        padding: 50
    },
    sectionHeader: {
        backgroundColor: '#667eea',
        padding: 20,
        marginHorizontal: -50,
        marginTop: -50,
        marginBottom: 30
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
    },
    subsectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
        marginTop: 24,
        paddingBottom: 8,
        borderBottom: '3px solid #667eea'
    },
    text: {
        fontSize: 11,
        color: '#4b5563',
        lineHeight: 1.8,
        marginBottom: 10,
        textAlign: 'justify'
    },
    boldText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 6
    },
    metricsGrid: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    metricCard: {
        width: '48%',
        backgroundColor: '#f8fafc',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        borderLeft: '5px solid #667eea',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    metricLabel: {
        fontSize: 9,
        color: '#64748b',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: 'bold'
    },
    metricValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#667eea'
    },
    metricValueSmall: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#667eea'
    },
    badgeContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 8
    },
    badge: {
        backgroundColor: '#e0e7ff',
        color: '#4338ca',
        padding: '8 16',
        borderRadius: 20,
        fontSize: 11,
        marginRight: 10,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    highlightBox: {
        backgroundColor: '#fef3c7',
        padding: 20,
        borderRadius: 12,
        marginTop: 16,
        borderLeft: '5px solid #f59e0b'
    },
    highlightText: {
        fontSize: 14,
        color: '#92400e',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    reasonItem: {
        marginBottom: 16,
        paddingLeft: 20,
        borderLeft: '3px solid #667eea'
    },
    reasonTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 4
    },
    reasonDesc: {
        fontSize: 11,
        color: '#4b5563',
        lineHeight: 1.6
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        textAlign: 'center',
        fontSize: 9,
        color: '#94a3b8',
        borderTop: '2px solid #e2e8f0',
        paddingTop: 12
    },
    decorativeLine: {
        height: 3,
        backgroundColor: '#667eea',
        marginVertical: 20,
        borderRadius: 2
    },
    contactInfo: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#f1f5f9',
        borderRadius: 12
    },
    contactItem: {
        fontSize: 12,
        color: '#1f2937',
        marginBottom: 8,
        fontWeight: 'bold'
    }
});

// PDF Document Component
const MediaKitPDF = ({ data, language = 'pt' }: { data: typeof mockInfluencerData; language?: string }) => {
    const t = translations[language as keyof typeof translations] || translations.pt;

    return (
        <Document>
            {/* Cover Page */}
            <Page size="A4" style={styles.coverPage}>
                <Text style={styles.coverTitle}>{data.name}</Text>
                <Text style={styles.coverSubtitle}>{t.coverSubtitle}</Text>

                <View style={styles.socialContainer}>
                    <Text style={styles.socialHandle}>📸 Instagram: {data.socialMedia.instagram}</Text>
                    <Text style={styles.socialHandle}>🎵 TikTok: {data.socialMedia.tiktok}</Text>
                    <Text style={styles.socialHandle}>▶️ YouTube: {data.socialMedia.youtube}</Text>
                </View>
            </Page>

            {/* About & Metrics Page */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t.aboutTitle}</Text>
                </View>

                <View style={styles.contentPage}>
                    <Text style={styles.text}>{data.bio}</Text>

                    <View style={{ marginTop: 16, marginBottom: 24 }}>
                        <Text style={styles.boldText}>📍 {t.location}: {data.location}</Text>
                        <Text style={styles.boldText}>🎯 {t.niche}: {data.niche}</Text>
                    </View>

                    <View style={styles.decorativeLine} />

                    <Text style={styles.subsectionTitle}>{t.metricsTitle}</Text>

                    <View style={styles.metricsGrid}>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricLabel}>{t.totalFollowers}</Text>
                            <Text style={styles.metricValue}>{data.metrics.totalFollowers.toLocaleString()}</Text>
                        </View>

                        <View style={styles.metricCard}>
                            <Text style={styles.metricLabel}>{t.engagementRate}</Text>
                            <Text style={styles.metricValue}>{data.metrics.engagementRate}%</Text>
                        </View>

                        <View style={styles.metricCard}>
                            <Text style={styles.metricLabel}>{t.avgViews}</Text>
                            <Text style={styles.metricValue}>{data.metrics.averageViews.toLocaleString()}</Text>
                        </View>

                        <View style={styles.metricCard}>
                            <Text style={styles.metricLabel}>{t.contentFreq}</Text>
                            <Text style={styles.metricValueSmall}>{data.metrics.contentFrequency}</Text>
                        </View>
                    </View>

                    <Text style={styles.subsectionTitle}>{t.contentTypesTitle}</Text>
                    <View style={styles.badgeContainer}>
                        {data.contentTypes.map((type, index) => (
                            <Text key={index} style={styles.badge}>{type}</Text>
                        ))}
                    </View>
                </View>

                <Text style={styles.footer}>
                    {data.name} • {data.email} • {data.phone}
                </Text>
            </Page>

            {/* Partnership Page */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t.partnershipTitle}</Text>
                </View>

                <View style={styles.contentPage}>
                    <Text style={styles.text}>{t.partnershipIntro}</Text>

                    <Text style={styles.subsectionTitle}>{t.categoriesTitle}</Text>
                    <View style={styles.badgeContainer}>
                        {data.partnershipPreferences.categories.map((cat, index) => (
                            <Text key={index} style={styles.badge}>{cat}</Text>
                        ))}
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.boldText}>{t.partnershipType}:</Text>
                        <Text style={styles.text}>{data.partnershipPreferences.type}</Text>
                    </View>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightText}>
                            💰 {t.minInvestment}: R$ {data.partnershipPreferences.minimumValue.toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.decorativeLine} />

                    <Text style={styles.subsectionTitle}>{t.whyPartnerTitle}</Text>

                    <View style={styles.reasonItem}>
                        <Text style={styles.reasonTitle}>✓ {t.reason1}</Text>
                        <Text style={styles.reasonDesc}>{t.reason1Desc.replace('{rate}', data.metrics.engagementRate.toString())}</Text>
                    </View>

                    <View style={styles.reasonItem}>
                        <Text style={styles.reasonTitle}>✓ {t.reason2}</Text>
                        <Text style={styles.reasonDesc}>{t.reason2Desc}</Text>
                    </View>

                    <View style={styles.reasonItem}>
                        <Text style={styles.reasonTitle}>✓ {t.reason3}</Text>
                        <Text style={styles.reasonDesc}>{t.reason3Desc}</Text>
                    </View>

                    <View style={styles.reasonItem}>
                        <Text style={styles.reasonTitle}>✓ {t.reason4}</Text>
                        <Text style={styles.reasonDesc}>{t.reason4Desc}</Text>
                    </View>

                    <View style={styles.reasonItem}>
                        <Text style={styles.reasonTitle}>✓ {t.reason5}</Text>
                        <Text style={styles.reasonDesc}>{t.reason5Desc}</Text>
                    </View>

                    <View style={styles.reasonItem}>
                        <Text style={styles.reasonTitle}>✓ {t.reason6}</Text>
                        <Text style={styles.reasonDesc}>{t.reason6Desc}</Text>
                    </View>

                    <View style={styles.decorativeLine} />

                    <Text style={styles.subsectionTitle}>{t.letsConnectTitle}</Text>
                    <Text style={styles.text}>{t.letsConnectText}</Text>

                    <View style={styles.contactInfo}>
                        <Text style={styles.contactItem}>📧 {t.email}: {data.email}</Text>
                        <Text style={styles.contactItem}>📱 {t.phone}: {data.phone}</Text>
                        <Text style={styles.contactItem}>📸 Instagram: {data.socialMedia.instagram}</Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    {t.generatedOn} {new Date().toLocaleDateString()} • {data.name}
                </Text>
            </Page>
        </Document>
    );
};

export default function MediaKit() {
    const [influencerData] = useState(mockInfluencerData);
    const [selectedLanguage, setSelectedLanguage] = useState('pt');

    const languages = [
        { code: 'pt', name: 'Português', flag: '🇧🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'zh', name: '中文', flag: '🇨🇳' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Media Kit</h1>
                    <p className="text-gray-500 mt-1">Gere seu portfólio profissional para apresentar a marcas</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Language Selector */}
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/50"
                    >
                        {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                            </option>
                        ))}
                    </select>

                    <PDFDownloadLink
                        document={<MediaKitPDF data={influencerData} language={selectedLanguage} />}
                        fileName={`MediaKit_${influencerData.name.replace(/\s+/g, '_')}_${selectedLanguage.toUpperCase()}.pdf`}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-primary/20"
                    >
                        {({ loading }) => (
                            <>
                                <span className="material-symbols-outlined">download</span>
                                {loading ? 'Gerando PDF...' : 'Baixar Media Kit'}
                            </>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {/* Language Info */}
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 rounded-xl border border-primary/20">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">translate</span>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">Suporte Multilíngue</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Selecione o idioma desejado antes de baixar: Português, English, Español ou 中文
                        </p>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Prévia do Conteúdo</h2>

                {/* Profile Summary */}
                <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl border border-primary/20">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{influencerData.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{influencerData.bio}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            {influencerData.location}
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">category</span>
                            {influencerData.niche}
                        </span>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase text-gray-500 mb-2">Total de Seguidores</p>
                        <p className="text-3xl font-bold text-primary">{influencerData.metrics.totalFollowers.toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase text-gray-500 mb-2">Taxa de Engajamento</p>
                        <p className="text-3xl font-bold text-green-600">{influencerData.metrics.engagementRate}%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase text-gray-500 mb-2">Média de Views</p>
                        <p className="text-3xl font-bold text-purple-600">{influencerData.metrics.averageViews.toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase text-gray-500 mb-2">Frequência</p>
                        <p className="text-lg font-bold text-orange-600">{influencerData.metrics.contentFrequency}</p>
                    </div>
                </div>

                {/* Social Media */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Redes Sociais</h3>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                            <span className="material-symbols-outlined text-pink-500">photo_camera</span>
                            <span className="font-medium">{influencerData.socialMedia.instagram}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <span className="material-symbols-outlined">music_note</span>
                            <span className="font-medium">{influencerData.socialMedia.tiktok}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <span className="material-symbols-outlined text-red-500">play_circle</span>
                            <span className="font-medium">{influencerData.socialMedia.youtube}</span>
                        </div>
                    </div>
                </div>

                {/* Content Types */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tipos de Conteúdo</h3>
                    <div className="flex flex-wrap gap-2">
                        {influencerData.contentTypes.map((type, index) => (
                            <span key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                {type}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Partnership Info */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Preferências de Parceria</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Categorias de Interesse:</p>
                            <div className="flex flex-wrap gap-2">
                                {influencerData.partnershipPreferences.categories.map((cat, index) => (
                                    <span key={index} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-sm border border-gray-200 dark:border-gray-700">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de Parceria:</p>
                            <p className="text-gray-900 dark:text-white font-medium">{influencerData.partnershipPreferences.type}</p>
                        </div>
                        <div className="pt-3 border-t border-yellow-200 dark:border-yellow-800">
                            <p className="text-lg font-bold text-yellow-900 dark:text-yellow-200">
                                💰 Investimento Mínimo: R$ {influencerData.partnershipPreferences.minimumValue.toLocaleString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                    <div>
                        <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Como usar seu Media Kit</h3>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            Este documento profissional foi criado para apresentar suas qualificações a potenciais parceiros de marca.
                            Selecione o idioma desejado e clique em "Baixar Media Kit" para gerar um PDF formatado que você pode enviar por email ou compartilhar em apresentações.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
