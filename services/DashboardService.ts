const API_URL = 'http://localhost:3001/api/dashboard';

export const DashboardService = {
    async getStats() {
        try {
            // Assuming headers handling or auth is done via global interceptor or not needed for dev
            // If auth is needed, usually we get token from localStorage
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`${API_URL}/stats`, { headers });
            if (!response.ok) throw new Error('Failed to fetch stats');
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getInsights() {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`${API_URL}/insights`, { headers });
            if (!response.ok) throw new Error('Failed to fetch insights');
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }
};
