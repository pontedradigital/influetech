import { supabase } from '../src/lib/supabase';

export interface Sale {
    id: string;
    productId: string;
    salePrice: number;
    saleDate: string;
    status: string;
    userId: string;
    customerName: string;
    customerCpf?: string;
    contactChannel: string;
    contactValue: string;
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    product?: any;
    user?: any;
}

export const SaleService = {
    async getAll(searchTerm?: string) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');
        const userId = userData.user.id;

        let query = supabase
            .from('Sale')
            .select('*, product:Product(*), user:User(*)')
            .eq('userId', userId)
            .order('saleDate', { ascending: false });

        if (searchTerm) {
            query = query.or(`customerName.ilike.%${searchTerm}%,product.name.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as Sale[];
    },

    async updateStatus(id: string, status: string) {
        const { data, error } = await supabase
            .from('Sale')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async create(sale: Partial<Sale>) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        // 1. Create Sale
        const { data, error } = await supabase
            .from('Sale')
            .insert([{
                ...sale,
                userId: userData.user.id,
                // Ensure numeric/date formats if needed, though Supabase handles ISO strings well
            }])
            .select()
            .single();

        if (error) {
            console.error('SERVER ERROR - Sale Create:', JSON.stringify(error, null, 2));
            console.error('Payload sent:', JSON.stringify(sale, null, 2));
            throw error;
        }

        // 2. Update Product Status to SOLD
        if (sale.productId) {
            const { error: productError } = await supabase
                .from('Product')
                .update({ status: 'SOLD' })
                .eq('id', sale.productId);

            if (productError) {
                console.error('Error updating product status:', productError);
                // Note: We might want to rollback the sale here in a real transaction,
                // but for now logging is safer than crashing if the sale exists.
            }
        }

        return data;
    },

    async delete(id: string) {
        // Optional: Should we revert product status if sale is deleted?
        // For now, let's just delete the sale as per strict equivalent logic.
        const { error } = await supabase
            .from('Sale')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
