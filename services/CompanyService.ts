import { supabase } from '../src/lib/supabase';
import { MediaKitService } from './MediaKitService';

export const CompanyService = {
    async getAll() {
        const { data, error } = await supabase
            .from('Company')
            .select('*')
            .order('name');

        if (error) throw error;
        return data;
    },

    /**
     * Upload de logo para Supabase Storage
     */
    async uploadLogo(file: File, userId: string, companyId: string): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/${companyId}/logo.${fileExt}`;

        const { error } = await supabase.storage
            .from('company-logos')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true // Substitui se já existe
            });

        if (error) throw error;

        // Retorna URL pública
        const { data } = supabase.storage
            .from('company-logos')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    async create(company: any, logoFile?: File) {
        console.log('[CompanyService] Creating company payload:', company);

        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) throw new Error('User not authenticated locally');

        // 1. Criar empresa via Supabase
        const { data, error } = await supabase
            .from('Company')
            .insert([{ ...company, userId }])
            .select() // create returns array
            .single();

        if (error) throw error;

        console.log('[CompanyService] Company created:', data.id);

        let logoUrl = null;

        // 2. Upload de logo (se fornecido)
        if (logoFile) {
            try {
                // Need userId to construct path
                const { data: userData } = await supabase.auth.getUser();
                const userId = userData.user?.id;

                if (!userId) throw new Error('User not authenticated locally');

                console.log('[CompanyService] Uploading logo...');
                logoUrl = await this.uploadLogo(logoFile, userId, data.id);

                // Atualizar empresa com URL do logo
                console.log('[CompanyService] Updating company with logoUrl...');
                await supabase
                    .from('Company')
                    .update({ logoUrl })
                    .eq('id', data.id);

                data.logoUrl = logoUrl;

            } catch (logoError) {
                console.error('[CompanyService] Logo upload failed:', logoError);
                // Non-blocking error for logo
            }
        }

        // 3. Adicionar no MediaKit automaticamente
        if (logoUrl) {
            try {
                // Keep this non-blocking
                await MediaKitService.addBrand({
                    name: data.name,
                    logo: logoUrl,
                    backgroundColor: '#ffffff'
                });
            } catch (err) {
                console.error('Erro ao adicionar marca no MediaKit:', err);
            }
        }

        return data;
    },

    async update(id: string, updates: any, logoFile?: File) {
        let logoUrl = updates.logoUrl;

        // Upload de novo logo
        if (logoFile) {
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData.user?.id;

            if (!userId) throw new Error('User not authenticated locally');

            logoUrl = await this.uploadLogo(logoFile, userId, id);
            updates = { ...updates, logoUrl };
        }

        const { data, error } = await supabase
            .from('Company')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Adicionar no MediaKit se logo foi adicionado agora
        if (logoFile && logoUrl) {
            try {
                const brands = await MediaKitService.getBrands();
                const hasInMediaKit = brands.some((b: any) => b.name === data.name);

                if (!hasInMediaKit) {
                    await MediaKitService.addBrand({
                        name: data.name,
                        logo: logoUrl,
                        backgroundColor: '#ffffff'
                    });
                }
            } catch (err) {
                console.error('Erro ao adicionar marca no MediaKit:', err);
            }
        }

        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('Company')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
