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

        // Parallelize secondary operations for speed, but handle errors individually
        const secondaryOperations: any[] = [];

        // 2. Update Product Status to SOLD
        if (sale.productId) {
            secondaryOperations.push(
                supabase.from('Product')
                    .update({ status: 'SOLD' })
                    .eq('id', sale.productId)
                    .then(({ error }) => {
                        if (error) console.error('Error updating Product status:', error);
                        else console.log('Product status updated to SOLD');
                    })
            );
        }

        // 3. Create Shipment Record (Envios)
        const shipmentPayload = {
            id: crypto.randomUUID(),
            userId: userId,
            saleId: saleId,
            recipientName: sale.customerName || 'Cliente',
            recipientAddress: `${sale.street || ''}, ${sale.number || ''} ${sale.complement || ''}`.trim(),
            recipientCity: sale.city || '',
            recipientState: sale.state || '',
            recipientCep: sale.cep || '',
            // Defaults as placeholder
            weight: 0.5,
            height: 10,
            width: 10,
            length: 10,
            carrier: 'A Definir',
            price: 0,
            deliveryTime: 0,
            status: 'pending',
            contentDescription: `Venda ${sale.customerName}`,
            contentQuantity: 1,
            labelGenerated: 0,
            declarationGenerated: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        secondaryOperations.push(
            supabase.from('Shipment')
                .insert([shipmentPayload])
                .then(({ error }) => {
                    if (error) {
                        console.error('Error creating Shipment:', JSON.stringify(error, null, 2));
                        console.error('Shipment Payload:', JSON.stringify(shipmentPayload, null, 2));
                    } else {
                        console.log('Shipment created successfully');
                    }
                })
        );


        // 4. Create Financial Transaction (Ganhos)
        const financialPayload = {
            id: crypto.randomUUID(),
            userId: userId,
            type: 'INCOME',
            amount: Number(sale.salePrice) || 0,
            description: `Venda - ${sale.customerName}`,
            name: `Venda - ${sale.customerName}`,
            category: 'Vendas',
            currency: 'BRL',
            date: new Date().toISOString(),
            status: 'COMPLETED',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        secondaryOperations.push(
            supabase.from('FinancialTransaction')
                .insert([financialPayload])
                .then(({ error }) => {
                    if (error) {
                        console.error('Error creating FinancialTransaction:', JSON.stringify(error, null, 2));
                        console.error('Financial Payload:', JSON.stringify(financialPayload, null, 2));
                    } else {
                        console.log('FinancialTransaction created successfully');
                    }
                })
        );


        // 5. Remove from Bazares (Cleanup)
        if (sale.productId) {
            const cleanupBazar = async () => {
                const { data: events, error: fetchError } = await supabase
                    .from('BazarEvent')
                    .select('*')
                    .eq('userId', userId)
                    .or('status.eq.PLANNED,status.eq.CONFIRMED');

                if (fetchError) {
                    console.error('Error fetching bazars for cleanup:', fetchError);
                    return;
                }

                if (events && events.length > 0) {
                    for (const event of events) {
                        let productIds: string[] = [];
                        try {
                            if (typeof event.productIds === 'string') {
                                productIds = JSON.parse(event.productIds || '[]');
                            } else if (Array.isArray(event.productIds)) {
                                productIds = event.productIds;
                            }
                        } catch (e) {
                            console.warn('Error parsing productIds for event', event.id, e);
                            continue;
                        }

                        if (productIds.includes(sale.productId as string)) {
                            const newProductIds = productIds.filter(id => id !== sale.productId);
                            const { error: updateError } = await supabase
                                .from('BazarEvent')
                                .update({ productIds: JSON.stringify(newProductIds) })
                                .eq('id', event.id);

                            if (updateError) console.error('Error updating BazarEvent:', updateError);
                            else console.log('Removed product from BazarEvent:', event.id);
                        }
                    }
                }
            };
            secondaryOperations.push(cleanupBazar());
        }

        // Execute all side effects without blocking the return
        await Promise.allSettled(secondaryOperations);

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
