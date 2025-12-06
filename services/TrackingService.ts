export interface TrackingEvent {
    data: string;
    hora: string;
    local: string;
    status: string;
    subStatus?: string[];
}

export interface TrackingData {
    codigo: string;
    host: string;
    eventos: TrackingEvent[];
    time: number;
    quantidade: number;
    servico: string;
    ultimo: string;
}

export const TrackingService = {
    track: async (code: string): Promise<TrackingData> => {
        // Using a public test user/token from Linketrack docs or similar free tier
        // In a real app, these should be env vars
        const user = 'teste';
        const token = '1abcd00b2731640e886fb41a8a9671ad1434c599dbaa0a0de9a5aa619f29a83f';

        try {
            const response = await fetch(`https://api.linketrack.com/track/json?user=${user}&token=${token}&codigo=${code}`);
            if (!response.ok) {
                throw new Error('Falha ao buscar rastreio');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Tracking Error:', error);
            throw error;
        }
    }
};
