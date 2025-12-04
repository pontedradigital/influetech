import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface SocialNetwork {
    id: string;
    platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Twitter' | 'Twitch' | 'LinkedIn' | 'Other';
    handle: string;
    followers: number;
    url?: string;
    averageViews?: number;
    postingFrequency?: string;
}

export interface InfluencerProfile {
    name: string;
    email: string;
    phone: string;
    location: string;
    cep: string;
    niche: string;
    bio: string;
    contentTypes: string[];
    audienceAge: string;
    audienceGenderMale: number;
    audienceGenderFemale: number;
    engagementRate: number;
}

export interface PartnershipPreferences {
    categories: string[];
    preferredTypes: string[];
    productValueSuggestion: number;
    currency: 'BRL' | 'USD';
}

export interface ImportSettings {
    dollarRate: number;
    taxRateUnder50: number;
    taxRateOver50: number;
    icmsRate: number;
}

export interface InfluencerData {
    profile: InfluencerProfile;
    socials: SocialNetwork[];
    partnerships: PartnershipPreferences;
    importSettings: ImportSettings;
}

interface InfluencerContextType {
    data: InfluencerData;
    updateProfile: (data: Partial<InfluencerProfile>) => void;
    updateSocials: (data: SocialNetwork[]) => void;
    updatePartnerships: (data: Partial<PartnershipPreferences>) => void;
    updateImportSettings: (data: Partial<ImportSettings>) => void;
    totalFollowers: number;
}

// Default Data (Mock)
const defaultData: InfluencerData = {
    profile: {
        name: 'Ana Oliveira',
        email: 'ana.oliveira@email.com',
        phone: '(11) 99999-9999',
        location: 'São Paulo, Brasil',
        cep: '',
        niche: 'Tech & Setup',
        bio: 'Apaixonada por tecnologia e setups minimalistas. Crio conteúdo focado em reviews honestos e dicas de produtividade.',
        contentTypes: ['Reviews', 'Unboxing', 'Setup Tours'],
        audienceAge: '18-34',
        audienceGenderMale: 70,
        audienceGenderFemale: 30,
        engagementRate: 5.2,
    },
    socials: [
        { id: '1', platform: 'Instagram', handle: 'ana.tech', followers: 45000, url: 'https://instagram.com/ana.tech', postingFrequency: 'Diário' },
        { id: '2', platform: 'TikTok', handle: '@anatech', followers: 120000, url: 'https://tiktok.com/@anatech', postingFrequency: 'Diário' },
        { id: '3', platform: 'YouTube', handle: 'Ana Tech Reviews', followers: 85000, url: 'https://youtube.com/@anatech', postingFrequency: '2x por semana' },
    ],
    partnerships: {
        categories: ['Periféricos', 'Hardware', 'Software', 'Desk Setup'],
        preferredTypes: ['Produto para Review', 'Parceria Paga'],
        productValueSuggestion: 500,
        currency: 'BRL',
    },
    importSettings: {
        dollarRate: 5.00,
        taxRateUnder50: 20,
        taxRateOver50: 60,
        icmsRate: 17,
    },
};

const InfluencerContext = createContext<InfluencerContextType | undefined>(undefined);

export const InfluencerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<InfluencerData>(() => {
        const saved = localStorage.getItem('influencer_data');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge saved data with default data to ensure new fields (like importSettings) exist
            return {
                ...defaultData,
                ...parsed,
                importSettings: parsed.importSettings || defaultData.importSettings
            };
        }
        return defaultData;
    });

    useEffect(() => {
        localStorage.setItem('influencer_data', JSON.stringify(data));
    }, [data]);

    const updateProfile = (updates: Partial<InfluencerProfile>) => {
        setData(prev => ({ ...prev, profile: { ...prev.profile, ...updates } }));
    };

    const updateSocials = (socials: SocialNetwork[]) => {
        setData(prev => ({ ...prev, socials }));
    };

    const updatePartnerships = (updates: Partial<PartnershipPreferences>) => {
        setData(prev => ({ ...prev, partnerships: { ...prev.partnerships, ...updates } }));
    };

    const updateImportSettings = (updates: Partial<ImportSettings>) => {
        setData(prev => ({ ...prev, importSettings: { ...prev.importSettings, ...updates } }));
    };

    const totalFollowers = data.socials.reduce((acc, curr) => acc + (Number(curr.followers) || 0), 0);

    return (
        <InfluencerContext.Provider value={{ data, updateProfile, updateSocials, updatePartnerships, updateImportSettings, totalFollowers }}>
            {children}
        </InfluencerContext.Provider>
    );
};

export const useInfluencer = () => {
    const context = useContext(InfluencerContext);
    if (!context) {
        throw new Error('useInfluencer must be used within an InfluencerProvider');
    }
    return context;
};
