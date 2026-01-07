
import fetch from 'node-fetch';

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
            throw new Error('SuperFrete Token not configured');
        }

        const url = `${this.API_URL}/calculator`;

        console.log('🚚 Calculating shipping via SuperFrete:', url);
        // console.log('Payload:', JSON.stringify(data, null, 2));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.TOKEN}`,
                'User-Agent': 'Influetech/1.0'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ SuperFrete API Error:', response.status, errorText);
            throw new Error(`SuperFrete API Error: ${errorText}`);
        }

        const result = await response.json();
        return result;
    }
}
