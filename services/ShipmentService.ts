import { supabase } from '../src/lib/supabase';
import { Shipment } from '../types';
import { SaleService } from './SaleService';

export class ShipmentService {
    static async create(shipmentData: any): Promise<Shipment> {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) throw new Error('Usuario não autenticado');

        const newId = crypto.randomUUID();
        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from('Shipment')
            .insert([{
                ...shipmentData,
                id: newId,
                userId,
                createdAt: now,
                updatedAt: now,
                status: shipmentData.status || 'pending'
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Shipment;
    }

    static async list(): Promise<Shipment[]> {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) return [];

        const { data, error } = await supabase
            .from('Shipment')
            .select('*')
            .eq('userId', userId)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data as Shipment[];
    }

    static async delete(id: string): Promise<void> {
        // 1. Get Shipment to check for Sale ID
        const { data: shipment, error: fetchError } = await supabase
            .from('Shipment')
            .select('saleId')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching shipment for deletion:', fetchError);
        }

        // 2. Reverse Cascade: If linked to a Sale, delete the Sale (which cascades everything)
        // This fulfills the requirement: Apagar Envio -> Apagar Venda (e, por consequência, o resto)
        if (shipment?.saleId) {
            console.log('Reverse Cascade: Deleting linked Sale', shipment.saleId);
            await SaleService.delete(shipment.saleId);
            // SaleService.delete handles shipment deletion, so we return here.
            return;
        }

        // 3. Simple Delete (if no Sale linked)
        const { error } = await supabase
            .from('Shipment')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    static async update(id: string, updates: Partial<Shipment>): Promise<Shipment> {
        const { data, error } = await supabase
            .from('Shipment')
            .update({ ...updates, updatedAt: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Shipment;
    }
}

