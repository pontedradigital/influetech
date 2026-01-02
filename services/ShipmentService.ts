import { supabase } from '../src/lib/supabase';
import { Shipment } from '../types';

export class ShipmentService {
    static async create(shipmentData: Omit<Shipment, 'id' | 'createdAt' | 'status'>): Promise<Shipment> {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('Shipment')
                .insert([{ ...shipmentData, userId, status: 'pending' }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating shipment:', error);
            throw error;
        }
    }

    static async list(userId?: string): Promise<Shipment[]> {
        try {
            const currentUserId = userId || localStorage.getItem('userId');
            if (!currentUserId) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('Shipment')
                .select('*')
                .eq('userId', currentUserId)
                .order('createdAt', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error listing shipments:', error);
            throw error;
        }
    }

    static async delete(id: string): Promise<void> {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('Shipment')
                .delete()
                .eq('id', id)
                .eq('userId', userId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting shipment:', error);
            throw error;
        }
    }

    static async update(id: string, data: Partial<Shipment>): Promise<Shipment> {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User not authenticated');

            const { data: updated, error } = await supabase
                .from('Shipment')
                .update(data)
                .eq('id', id)
                .eq('userId', userId)
                .select()
                .single();

            if (error) throw error;
            return updated;
        } catch (error) {
            console.error('Error updating shipment:', error);
            throw error;
        }
    }
}

