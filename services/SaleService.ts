import { supabase } from '../src/lib/supabase';
import { api } from './api';
import { FinancialService } from './FinancialService';

export const SaleService = {
    async getAll(searchTerm?: string) {
        // Fetch sales with Product details
        const { data, error } = await supabase
            .from('Sale')
            .select('*, Product(name, category, brand)')
            .order('createdAt', { ascending: false });

        if (error) throw error;

        // Map flatten structure
        const sales = data.map((s: any) => ({
            ...s,
            productName: s.Product?.name || 'Produto Removido',
            productCategory: s.Product?.category || '',
            productBrand: s.Product?.brand || ''
        }));

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            return sales.filter((s: any) =>
                (s.customerName && s.customerName.toLowerCase().includes(lowerSearch)) ||
                (s.productName && s.productName.toLowerCase().includes(lowerSearch))
            );
        }
        return sales;
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

        // Fetch product name for descriptions
        const { data: product } = await supabase
            .from('Product')
            .select('name, marketValue, weight, height, width, length')
            .eq('id', sale.productId)
            .single();

        const productName = product?.name || 'Produto';



        // ... (inside create function)

        // 2. Criar Transação Financeira (Receita) via FinancialService (Client-side)
        try {
            await FinancialService.create({
                type: 'INCOME',
                amount: sale.salePrice,
                description: `Venda - ${productName}`,
                name: `Venda - ${sale.customerName}`,
                currency: 'BRL',
                date: now,
                category: 'Vendas',
                status: 'COMPLETED'
            });
        } catch (finError) {
            console.error('Erro ao criar transação financeira:', finError);
        }

        // 3. Tentar criar o Envio (Shipment) automaticamente
        try {
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
                    recipientCpfCnpj: sale.customerCpf || '',

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
