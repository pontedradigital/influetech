import { supabase } from '../src/lib/supabase';

const API_URL = '/api';

export const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    let token = session?.access_token;

    // Fallback to manual localStorage token if session is missing (e.g. page refresh race condition)
    if (!token) {
        token = localStorage.getItem('token') || undefined;
    }

    if (!token) {
        throw new Error('User not authenticated');
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const api = {
    get: async (endpoint: string) => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || response.statusText);
        }
        return response.json();
    },

    post: async (endpoint: string, body: any) => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || response.statusText);
        }
        return response.json();
    },

    put: async (endpoint: string, body: any) => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || response.statusText);
        }
        return response.json();
    },

    delete: async (endpoint: string) => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || response.statusText);
        }
        return response.json();
    }
};
