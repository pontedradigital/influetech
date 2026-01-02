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
        name: '',
        email: '',
        phone: '',
        location: '',
        cep: '',
        niche: '',
        bio: '',
        contentTypes: [],
        audienceAge: '',
        audienceGenderMale: 0,
        audienceGenderFemale: 0,
        engagementRate: 0,
    },
    socials: [],
    partnerships: {
        categories: [],
        preferredTypes: [],
        productValueSuggestion: 0,
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
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

        let initialData = defaultData;

        if (saved) {
            const parsed = JSON.parse(saved);
            initialData = {
                ...defaultData,
                ...parsed,
                importSettings: parsed.importSettings || defaultData.importSettings,
                profile: {
                    ...defaultData.profile,
                    ...parsed.profile
                }
            };
        }

        // Always check if name/email are missing and try to fill from auth user
        if (user) {
            if (!initialData.profile.name && user.name) {
                initialData.profile.name = user.name;
            }
            if (!initialData.profile.email && user.email) {
                initialData.profile.email = user.email;
            }
        }

        return initialData;
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
