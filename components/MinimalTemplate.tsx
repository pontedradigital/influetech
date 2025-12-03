import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Simple template using ONLY safe CSS properties
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica'
    },
    header: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    photoContainer: {
        width: 80,
        height: 80,
        marginRight: 20,
        borderRadius: 40,
        overflow: 'hidden'
    },
    photo: {
        width: 80,
        height: 80
    },
    headerText: {
        flex: 1
    },
    title: {
        fontSize: 28,
        marginBottom: 5,
        color: '#2D75E8'
    },
    subtitle: {
        fontSize: 12,
        color: '#666666'
    },
    section: {
        marginBottom: 15
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 8,
        color: '#2D75E8',
        fontWeight: 'bold'
    },
    text: {
        fontSize: 10,
        marginBottom: 5,
        color: '#333333',
        lineHeight: 1.5
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
    col: {
        flex: 1,
        marginRight: 10
    },
    divider: {
        borderBottom: '1pt solid #CCCCCC',
        marginVertical: 15
    },
    socialItem: {
        marginBottom: 8,
        padding: 10,
        backgroundColor: '#F5F5F5'
    },
    socialPlatform: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2D75E8',
        marginBottom: 3
    },
    socialHandle: {
        fontSize: 9,
        color: '#666666'
    },
    metricBox: {
        padding: 10,
        backgroundColor: '#F0F7FF',
        marginBottom: 10
    },
    metricLabel: {
        fontSize: 8,
        color: '#666666',
        marginBottom: 2
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D75E8'
    }
});

export const MinimalTemplate = ({ data }: any) => {
    // Get translated labels or use defaults
    const labels = data?.labels || {
        aboutMe: 'About Me',
        contact: 'Contact',
        metrics: 'Metrics',
        socialStats: 'Social Media',
        followers: 'Followers',
        engagement: 'Engagement Rate'
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header with Photo */}
                <View style={styles.header}>
                    {data?.photo && (
                        <View style={styles.photoContainer}>
                            <Image src={data.photo} style={styles.photo} />
                        </View>
                    )}
                    <View style={styles.headerText}>
                        <Text style={styles.title}>{data?.name || 'Media Kit'}</Text>
                        <Text style={styles.subtitle}>{data?.niche || 'Influencer'}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Contact Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{labels.contact}</Text>
                    <Text style={styles.text}>Email: {data?.email || 'N/A'}</Text>
                    <Text style={styles.text}>{labels.phone || 'Phone'}: {data?.phone || 'N/A'}</Text>
                    <Text style={styles.text}>{labels.location || 'Location'}: {data?.location || 'N/A'}</Text>
                </View>

                <View style={styles.divider} />

                {/* About */}
                {data?.bio && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{labels.aboutMe}</Text>
                            <Text style={styles.text}>{data.bio}</Text>
                        </View>
                        <View style={styles.divider} />
                    </>
                )}

                {/* Metrics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{labels.metrics}</Text>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <View style={styles.metricBox}>
                                <Text style={styles.metricLabel}>{labels.followers || 'Total Followers'}</Text>
                                <Text style={styles.metricValue}>
                                    {data?.metrics?.totalFollowers ?
                                        (data.metrics.totalFollowers >= 1000 ?
                                            `${(data.metrics.totalFollowers / 1000).toFixed(1)}K` :
                                            data.metrics.totalFollowers)
                                        : '0'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.col}>
                            <View style={styles.metricBox}>
                                <Text style={styles.metricLabel}>{labels.engagement}</Text>
                                <Text style={styles.metricValue}>
                                    {data?.metrics?.engagementRate ? `${data.metrics.engagementRate.toFixed(1)}%` : '0%'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {data?.metrics?.averageViews > 0 && (
                        <View style={styles.metricBox}>
                            <Text style={styles.metricLabel}>{labels.views || 'Average Views'}</Text>
                            <Text style={styles.metricValue}>
                                {data.metrics.averageViews >= 1000 ?
                                    `${(data.metrics.averageViews / 1000).toFixed(1)}K` :
                                    data.metrics.averageViews}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.divider} />

                {/* Social Media */}
                {data?.socialMedia && data.socialMedia.length > 0 && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{labels.socialStats}</Text>
                            {data.socialMedia.slice(0, 5).map((social: any, index: number) => (
                                <View key={index} style={styles.socialItem}>
                                    <Text style={styles.socialPlatform}>{social.platform}</Text>
                                    <Text style={styles.socialHandle}>@{social.handle}</Text>
                                    <Text style={styles.text}>
                                        {social.followers >= 1000 ?
                                            `${(social.followers / 1000).toFixed(1)}K` :
                                            social.followers} {labels.followers?.toLowerCase() || 'followers'}
                                    </Text>
                                    {social.averageViews && (
                                        <Text style={styles.text}>
                                            {labels.views || 'Avg views'}: {social.averageViews >= 1000 ?
                                                `${(social.averageViews / 1000).toFixed(1)}K` :
                                                social.averageViews}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                        <View style={styles.divider} />
                    </>
                )}

                {/* Partnership Preferences */}
                {data?.partnershipPreferences && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{labels.whatToExpect || 'Partnership Preferences'}</Text>
                        {data.partnershipPreferences.type && (
                            <Text style={styles.text}>Type: {data.partnershipPreferences.type}</Text>
                        )}
                        {data.partnershipPreferences.minimumValue > 0 && (
                            <Text style={styles.text}>
                                Minimum value: {data.partnershipPreferences.currency} {data.partnershipPreferences.minimumValue}
                            </Text>
                        )}
                        {data.partnershipPreferences.categories && data.partnershipPreferences.categories.length > 0 && (
                            <Text style={styles.text}>
                                Categories: {data.partnershipPreferences.categories.join(', ')}
                            </Text>
                        )}
                    </View>
                )}
            </Page>
        </Document>
    );
};
