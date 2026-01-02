import { api } from './api';

export const DashboardService = {
    async getStats() {
        return api.get('/dashboard/stats');
    },

    async getInsights() {
        return api.get('/dashboard/insights');
    }
};

