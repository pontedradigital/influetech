
import axios from 'axios';

interface ShippingCalculationRequest {
    from: {
        postal_code: string;
    };
    to: {
        postal_code: string;
    };
    services?: string; // "1,2,17" etc.
    options?: {
        own_hand?: boolean;
        receipt?: boolean;
        insurance_value?: number;
        use_insurance_value?: boolean;
    };
    package: {
        weight: number;
        height: number;
        width: number;
        length: number;
    };
}

export class SuperFreteService {
    private static readonly API_URL = process.env.SUPERFRETE_URL || 'https://api.superfrete.com/api/v0';
    private static readonly TOKEN = process.env.SUPERFRETE_TOKEN;

    static async calculateShipping(data: ShippingCalculationRequest) {
        if (!this.TOKEN) {
            console.error('❌ SuperFrete Token missing configuration');
            throw new Error('SuperFrete Token not configured');
        }

        const url = `${this.API_URL}/calculator`;

        console.log('🚚 Calculating shipping via SuperFrete (Axios):', url);

        try {
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.TOKEN}`,
                    'User-Agent': 'Influetech/1.0'
                },
                timeout: 10000 // 10s timeout to avoid hanging
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('❌ SuperFrete API Error (Axios):', error.response?.status, error.response?.data || error.message);
                throw new Error(`SuperFrete API Error: ${JSON.stringify(error.response?.data || error.message)}`);
            } else {
                console.error('❌ SuperFrete Unexpected Error:', error);
                throw new Error(`unexpected error: ${error.message}`);
            }
        }
    }
}
