import { api } from './api';

export const SaleService = {
    async getAll(searchTerm?: string) {
        let url = '/sales';
        if (searchTerm) {
            url += `?search=${encodeURIComponent(searchTerm)}`;
        }
        return api.get(url);
    },

    async updateStatus(id: string, status: string) {
        return api.put(`/sales/${id}`, { status });
    },

    async create(sale: any) {
        return api.post('/sales', sale);
    },

    async delete(id: string) {
        return api.delete(`/sales/${id}`);
    }
};
