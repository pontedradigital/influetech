import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface SocialNetwork {
    id: string;
    platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Twitter' | 'Twitch' | 'LinkedIn' | 'Other';
    handle: string;
    followers: number;
    url?: string;
    averageViews?: number;
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
    audienceGender: string;
    engagementRate: number;
}

export interface PartnershipPreferences {
    categories: string[];
    preferredTypes: string[];
    productValueSuggestion: number;
    currency: 'BRL' | 'USD';
}

export interface InfluencerData {
    profile: InfluencerProfile;
    socials: SocialNetwork[];
    partnerships: PartnershipPreferences;
}

interface InfluencerContextType {
    data: InfluencerData;
    updateProfile: (data: Partial<InfluencerProfile>) => void;
    updateSocials: (data: SocialNetwork[]) => void;
    updatePartnerships: (data: Partial<PartnershipPreferences>) => void;
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
        audienceGender: '70% Masculino',
        engagementRate: 5.2,
    },
    socials: [
        { id: '1', platform: 'Instagram', handle: 'ana.tech', followers: 45000, url: 'https://instagram.com/ana.tech' },
        { id: '2', platform: 'TikTok', handle: '@anatech', followers: 120000, url: 'https://tiktok.com/@anatech' },
        { id: '3', platform: 'YouTube', handle: 'Ana Tech Reviews', followers: 85000, url: 'https://youtube.com/@anatech' },
    ],
    partnerships: {
        categories: ['Periféricos', 'Hardware', 'Software', 'Desk Setup'],
        preferredTypes: ['Produto para Review', 'Parceria Paga'],
        productValueSuggestion: 500,
        currency: 'BRL',
    },
};

const InfluencerContext = createContext<InfluencerContextType | undefined>(undefined);

export const InfluencerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<InfluencerData>(() => {
        const saved = localStorage.getItem('influencer_data');
        return saved ? JSON.parse(saved) : defaultData;
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

    const totalFollowers = data.socials.reduce((acc, curr) => acc + (Number(curr.followers) || 0), 0);

    return (
        <InfluencerContext.Provider value={{ data, updateProfile, updateSocials, updatePartnerships, totalFollowers }}>
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
