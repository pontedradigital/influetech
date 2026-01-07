import { supabase } from '../src/lib/supabase';
import { InfluencerData } from '../context/InfluencerContext';

export const UserService = {
    async getUser(userId: string) {
        const { data, error } = await supabase
            .from('User')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateProfile(userId: string, data: Partial<InfluencerData>) {
        // Construct the payload matching the schema
        const payload: any = {
            // Flat fields
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

            // JSONB column
            profileData: {
                profile: data.profile,
                socials: data.socials,
                partnerships: data.partnerships,
                importSettings: data.importSettings
            }
        };

        // Clean undefined values
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { data: updatedUser, error } = await supabase
            .from('User')
            .update(payload)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return updatedUser;
    }
};
