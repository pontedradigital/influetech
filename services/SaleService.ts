import { api } from './api';

export const SaleService = {
    async getAll(searchTerm?: string) {
        // Assuming backend filter or we fetch all and filter client side.
        // For now, let's just fetch all. If search is needed, we should add query support to backend.
        // Current backend supports userId filtering. Search is not explicitly implemented in listSales 
        // in previous view (it was a simple findMany). 
        // If search logic was key, I might lose it here, BUT security is priority.
        // I'll just fetch all.
        const sales = await api.get('/sales');

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
        return api.post('/sales', sale);
    },

    async delete(id: string) {
        return api.delete(`/sales/${id}`);
    }
};
