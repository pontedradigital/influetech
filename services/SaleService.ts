import { supabase } from '../src/lib/supabase';

export const SaleService = {
    async getAll(searchTerm?: string) {
        const { data, error } = await supabase
            .from('Sale')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;

        const sales = data;

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            return sales.filter((s: any) =>
                (s.customerName && s.customerName.toLowerCase().includes(lowerSearch)) ||
                (s.customerEmail && s.customerEmail.toLowerCase().includes(lowerSearch))
            );
        }
        return sales;
    },

    async create(sale: any) {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) throw new Error('Usuario não autenticado');

        const newId = crypto.randomUUID();
        const now = new Date().toISOString();

        // 1. Criar a Venda
        const { data: saleData, error: saleError } = await supabase
            .from('Sale')
            .insert([{
                ...sale,
                id: newId,
                userId,
                createdAt: now,
                updatedAt: now,
                status: 'PENDING'
            }])
            .select()
            .single();

        if (saleError) throw saleError;

        // 2. Tentar criar o Envio (Shipment) automaticamente
        try {
            // Buscar dados do produto para obter peso/dimensões
            const { data: product } = await supabase
                .from('Product')
                .select('*')
                .eq('id', sale.productId)
                .single();

            if (product) {
                const shipmentId = crypto.randomUUID();
                await supabase.from('Shipment').insert([{
                    id: shipmentId,
                    userId,
                    createdAt: now,
                    updatedAt: now,
                    status: 'pending',

                    // Dados do Destinatário (Cliente da Venda)
                    recipientName: sale.customerName,
                    recipientAddress: `${sale.street || ''}, ${sale.number || ''} ${sale.complement || ''}`,
                    recipientCity: sale.city,
                    recipientState: sale.state,
                    recipientCep: sale.cep,
                    recipientCpfCnpj: sale.customerCpf || '', // Se houver campo CPF na venda

                    // Dados do Conteúdo (Produto)
                    contentDescription: product.name,
                    contentQuantity: 1,
                    declaredValue: sale.salePrice || product.marketValue || 0,

                    // Dimensões/Peso (Do produto ou padrão)
                    weight: product.weight || 0.3,
                    height: product.height || 5,
                    width: product.width || 15,
                    length: product.length || 20,

                    // Campos obrigatórios de Frete (Placeholder)
                    carrier: 'Pendente',
                    price: 0,
                    deliveryTime: 0,

                    // Vinculo
                    saleId: newId
                }]);
            }
        } catch (shipmentError) {
            console.error('Erro ao criar envio automático:', shipmentError);
            // Não falhar a venda se o envio falhar, mas logar
        }

        return saleData;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('Sale')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
