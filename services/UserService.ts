import { api } from './api';
import { InfluencerData } from '../context/InfluencerContext';

export const UserService = {
    async getUser(userId: string) {
        return api.get(`/users/${userId}`);
    },

    async updateProfile(userId: string, data: Partial<InfluencerData>) {
        // Prepare payload, separating flat fields from complex nested JSON
        const payload: any = {
            // Flat fields (kept for backward compatibility and simpler querying)
            name: data.profile?.name,
            bio: data.profile?.bio,
            niche: data.profile?.niche,
            location: data.profile?.location,
            cep: data.profile?.cep,
            street: (data.profile as any)?.street,
            number: (data.profile as any)?.number,
            complement: (data.profile as any)?.complement,
            neighborhood: (data.profile as any)?.neighborhood,
            city: (data.profile as any)?.city,
            state: (data.profile as any)?.state,
            cpfCnpj: (data.profile as any)?.cpfCnpj,

            // New JSON column for full data persistence
            profileData: {
                profile: data.profile,
                socials: data.socials,
                partnerships: data.partnerships, // Verify if we want partnerships here or separate
                importSettings: data.importSettings
            }
        };

        // Remove undefined keys
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        return api.put(`/users/${userId}`, payload);
    }
};
