import { Shipment } from '../types';

export class ShipmentService {
    private static API_URL = '/api/shipments';

    static async create(shipmentData: Omit<Shipment, 'id' | 'createdAt' | 'status'>): Promise<Shipment> {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shipmentData),
            });

            if (!response.ok) {
                throw new Error('Failed to create shipment');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating shipment:', error);
            throw error;
        }
    }

    static async list(userId?: string): Promise<Shipment[]> {
        try {
            const url = userId ? `${this.API_URL}?userId=${userId}` : this.API_URL;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to list shipments');
            }

            return await response.json();
        } catch (error) {
            console.error('Error listing shipments:', error);
            throw error;
        }
    }

    static async delete(id: string): Promise<void> {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete shipment');
            }
        } catch (error) {
            console.error('Error deleting shipment:', error);
            throw error;
        }
    }
}
