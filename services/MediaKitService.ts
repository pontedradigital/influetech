import { supabase } from '../src/lib/supabase';

export const MediaKitService = {
    async getBrands() {
        // 1. Fetch manual brands
        const { data: manualBrands, error: brandError } = await supabase
            .from('MediaKitBrand')
            .select('*');

        if (brandError) throw brandError;

        // 2. Fetch accepted companies
        const { data: companies, error: companyError } = await supabase
            .from('Company')
            .select('id, name, logoUrl')
            .eq('partnershipStatus', 'Aceita');

        if (companyError) throw companyError;

        // 3. Transform companies to brand format
        const companyBrands = companies.map((c: any) => ({
            id: c.id,
            name: c.name,
            logo: c.logoUrl,
            backgroundColor: '#ffffff',
            isCompany: true // Flag to identify source and disable deletion in UI
        }));

        // 4. Merge and Deduplicate by name (prefer manual brand if conflict?)
        // Let's just merge all. If user added manually AND it's a company, show both or deduct?
        // simple dedup by name for now to avoid confusion
        const allBrands = [...manualBrands, ...companyBrands];
        const uniqueBrands = [];
        const seenNames = new Set();

        for (const brand of allBrands) {
            const normalized = brand.name.toLowerCase().trim();
            if (!seenNames.has(normalized)) {
                seenNames.add(normalized);
                uniqueBrands.push(brand);
            }
        }

        return uniqueBrands.sort((a, b) => a.name.localeCompare(b.name));
    },

    /**
     * Upload de logo para Supabase Storage
     */
    async uploadLogo(file: File, userId: string, brandName: string): Promise<string> {
        // Sanitize brand name for filename
        const safeName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const fileExt = file.name.split('.').pop();
        const fileName = `${safeName}-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error } = await supabase.storage
            .from('media-kit-logos') // Ensure this bucket exists or use a shared public bucket
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            // Fallback: try 'public' bucket or specific error handling
            console.error('Error uploading to media-kit-logos, trying generic...', error);
            throw error;
        }

        const { data } = supabase.storage
            .from('media-kit-logos')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    async addBrand(brand: { name: string; logo?: string | File | null; backgroundColor?: string }) {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) throw new Error('Usuario não autenticado');

        let logoUrl = null;

        // If logo is a File, upload it
        if (brand.logo instanceof File) {
            try {
                logoUrl = await this.uploadLogo(brand.logo, userId, brand.name);
            } catch (error) {
                console.error('Failed to upload logo, proceeding without it:', error);
            }
        } else if (typeof brand.logo === 'string') {
            // If it's already a string (URL or base64), use it as is
            // Note: Base64 strings are large and not recommended, but we keep compatibility
            logoUrl = brand.logo;
        }

        const { data, error } = await supabase
            .from('MediaKitBrand')
            .insert([{
                name: brand.name,
                logo: logoUrl,
                backgroundColor: brand.backgroundColor,
                userId
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteBrand(id: string) {
        const { error } = await supabase
            .from('MediaKitBrand')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
