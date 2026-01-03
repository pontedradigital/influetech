import { supabase } from '../src/lib/supabase';
import { Shipment } from '../types';

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
        const { data, error } = await supabase
            .from('Shipment')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data as Shipment[];
    }

    static async delete(id: string): Promise<void> {
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

