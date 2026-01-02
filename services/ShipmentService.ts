import { api } from './api';
import { Shipment } from '../types';

export class ShipmentService {
    static async create(shipmentData: Omit<Shipment, 'id' | 'createdAt' | 'status'>): Promise<Shipment> {
        return api.post('/shipments', { ...shipmentData, status: 'pending' });
    }

    static async list(userId?: string): Promise<Shipment[]> {
        // userId param is ignored as backend uses auth token
        return api.get('/shipments');
    }

    static async delete(id: string): Promise<void> {
        return api.delete(`/shipments/${id}`);
    }

    static async update(id: string, data: Partial<Shipment>): Promise<Shipment> {
        return api.put(`/shipments/${id}`, data);
    }
}

