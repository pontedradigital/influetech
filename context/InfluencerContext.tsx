import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserService } from '../services/UserService';
import { supabase } from '../src/lib/supabase';

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
    photoUrl?: string;
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
        photoUrl: '',
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
    // Get userId for data isolation
    const getUserId = () => {
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                return user.id;
            } catch (error) {
                console.error('Error parsing user:', error);
            }
        }
        return null;
    };

    const userId = getUserId();
    const STORAGE_KEY = userId ? `influencer_data_${userId}` : 'influencer_data_temp';

    const [data, setData] = useState<InfluencerData>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
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



    // Load from API on mount
    useEffect(() => {
        let isMounted = true;

        async function loadFromBackend() {
            if (!userId) return;

            try {
                const response = await UserService.getUser(userId);
                const backendUser = response.data;

                if (!isMounted) return;

                if (backendUser && backendUser.profileData) {
                    // Merge backend data with minimal local data
                    const profileData = backendUser.profileData;

                    // Also take flat fields if available and profileData is missing them
                    const mergedData = {
                        ...defaultData,
                        ...profileData,
                        importSettings: profileData.importSettings || defaultData.importSettings,
                        profile: {
                            ...defaultData.profile,
                            ...profileData.profile,
                            name: backendUser.name || profileData.profile?.name || '',
                            email: backendUser.email || profileData.profile?.email || '',
                            // Ensure flat fields are respected if JSON is outdated
                            location: backendUser.location || profileData.profile?.location,
                            bio: backendUser.bio || profileData.profile?.bio,
                            niche: backendUser.niche || profileData.profile?.niche,
                        }
                    };

                    setData(mergedData);
                    // Update local storage to match
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
                }
            } catch (err) {
                console.error('Error loading user data from backend:', err);
            }
        }

        loadFromBackend();

        return () => { isMounted = false; };
    }, [userId, STORAGE_KEY]);

    // Save to LocalStorage immediately
    useEffect(() => {
        if (userId) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [data, STORAGE_KEY, userId]);

    // Debounced Save to Backend
    useEffect(() => {
        if (!userId) return;

        const timeoutId = setTimeout(async () => {
            // Avoid saving initial empty state overwriting backend if not loaded yet?
            // We can check if data is different from default, but simple debounce is a good start.
            // Ideally we only save if 'dirty'. For now, saving ensures sync.
            try {
                await UserService.updateProfile(userId, data);
            } catch (err) {
                console.error('Error auto-saving profile:', err);
            }
        }, 2000); // 2 seconds debounce

        return () => clearTimeout(timeoutId);
    }, [data, userId]);

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
