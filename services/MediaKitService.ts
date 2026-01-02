import { api } from './api';

export const MediaKitService = {
    async getBrands() {
        return api.get('/media-kit-brands');
    },

    async addBrand(brand: any) {
        return api.post('/media-kit-brands', brand);
    },

    async deleteBrand(id: string) {
        return api.delete(`/media-kit-brands/${id}`);
    }
};
