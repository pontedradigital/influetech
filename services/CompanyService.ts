import { supabase } from '../src/lib/supabase';
import { MediaKitService } from './MediaKitService';

export const CompanyService = {
    async getAll() {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('Company')
            .select('*')
            .eq('userId', userId)
            .order('createdAt', { ascending: false });

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
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        // 1. Criar empresa
        const { data, error } = await supabase
            .from('Company')
            .insert([{ ...company, userId }])
            .select()
            .single();

        if (error) throw error;

        // 2. Upload de logo (se fornecido)
        let logoUrl = null;
        if (logoFile) {
            logoUrl = await this.uploadLogo(logoFile, userId, data.id);

            // Atualizar empresa com URL do logo
            await supabase
                .from('Company')
                .update({ logoUrl })
                .eq('id', data.id);
        }

        // 3. Adicionar no MediaKit automaticamente
        if (logoUrl) {
            try {
                await MediaKitService.addBrand({
                    name: data.name,
                    logo: logoUrl,
                    backgroundColor: '#ffffff'
                });
            } catch (err) {
                console.error('Erro ao adicionar marca no MediaKit:', err);
                // Não falha se MediaKit der erro
            }
        }

        return { ...data, logoUrl };
    },

    async update(id: string, updates: any, logoFile?: File) {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        let logoUrl = updates.logoUrl;

        // Upload de novo logo
        if (logoFile) {
            logoUrl = await this.uploadLogo(logoFile, userId, id);
            updates = { ...updates, logoUrl };
        }

        const { data, error } = await supabase
            .from('Company')
            .update(updates)
            .eq('id', id)
            .eq('userId', userId)
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
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('Company')
            .delete()
            .eq('id', id)
            .eq('userId', userId);

        if (error) throw error;
        return { success: true };
    }
};
