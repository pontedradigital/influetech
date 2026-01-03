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

    async addBrand(brand: any) {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) throw new Error('Usuario não autenticado');

        const { data, error } = await supabase
            .from('MediaKitBrand')
            .insert([{ ...brand, userId }])
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
