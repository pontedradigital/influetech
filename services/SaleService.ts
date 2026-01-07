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
        const userId = userData.user.id;

        // Generate IDs client-side to assume consistency
        const saleId = crypto.randomUUID();
        const saleDate = new Date().toISOString();

        // 1. Create Sale
        const { data: saleData, error: saleError } = await supabase
            .from('Sale')
            .insert([{
                ...sale,
                id: saleId,
                userId: userId,
                saleDate: saleDate,
                createdAt: saleDate,
                updatedAt: saleDate
            }])
            .select()
            .single();

        if (saleError) {
            console.error('SERVER ERROR - Sale Create:', JSON.stringify(saleError, null, 2));
            console.error('Payload sent:', JSON.stringify(sale, null, 2));
            throw saleError;
        }

        // Parallelize secondary operations for speed
        try {
            const promises = [];

            // 2. Update Product Status to SOLD
            if (sale.productId) {
                promises.push(
                    supabase.from('Product').update({ status: 'SOLD' }).eq('id', sale.productId)
                );
            }

            // 3. Create Shipment Record (Envios)
            // Map Sale fields to Shipment fields
            const shipmentPayload = {
                id: crypto.randomUUID(),
                userId: userId,
                saleId: saleId,
                recipientName: sale.customerName || 'Cliente',
                recipientAddress: `${sale.street || ''}, ${sale.number || ''} ${sale.complement || ''}`,
                recipientCity: sale.city || '',
                recipientState: sale.state || '',
                recipientCep: sale.cep || '',
                // Defaults for required fields not in Sale form
                weight: 0.5, // Default placeholder
                height: 10,
                width: 10,
                length: 10,
                carrier: 'A Definir',
                price: 0,
                deliveryTime: 0,
                status: 'pending',
                contentDescription: 'Produto vendido via Influetech',
                contentQuantity: 1
            };
            promises.push(supabase.from('Shipment').insert([shipmentPayload]));


            // 4. Create Financial Transaction (Ganhos)
            const financialPayload = {
                id: crypto.randomUUID(),
                userId: userId,
                type: 'INCOME',
                amount: sale.salePrice || 0,
                description: `Venda - ${sale.customerName}`,
                category: 'Vendas',
                currency: 'BRL',
                date: saleDate,
                status: 'COMPLETED'
            };
            promises.push(supabase.from('FinancialTransaction').insert([financialPayload]));


            // 5. Remove from Bazares (Cleanup)
            // Fetch upcoming bazaars that might contain this product
            if (sale.productId) {
                const cleanupBazar = async () => {
                    const { data: events } = await supabase
                        .from('BazarEvent')
                        .select('*')
                        .eq('userId', userId)
                        .or('status.eq.PLANNED,status.eq.CONFIRMED');

                    if (events && events.length > 0) {
                        for (const event of events) {
                            let productIds: string[] = [];
                            try {
                                // productIds is stored as JSON string
                                productIds = JSON.parse(event.productIds || '[]');
                            } catch (e) {
                                // fallback if array or invalid
                                if (Array.isArray(event.productIds)) productIds = event.productIds;
                            }

                            if (productIds.includes(sale.productId as string)) {
                                const newProductIds = productIds.filter(id => id !== sale.productId);
                                await supabase
                                    .from('BazarEvent')
                                    .update({ productIds: JSON.stringify(newProductIds) })
                                    .eq('id', event.id);
                            }
                        }
                    }
                };
                promises.push(cleanupBazar());
            }

            await Promise.all(promises);

        } catch (secondaryError) {
            console.error('Error in post-sale operations:', secondaryError);
            // We do not throw here to avoid failing the "Sale Creation" UI if only a side-effect failed.
            // But we log it.
        }

        return saleData;
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
