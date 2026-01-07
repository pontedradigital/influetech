import * as https from 'https';

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

    static async calculateShipping(data: ShippingCalculationRequest): Promise<any> {
        if (!this.TOKEN) {
            console.error('❌ SuperFrete Token missing configuration');
            throw new Error('SuperFrete Token not configured');
        }

        const url = new URL(`${this.API_URL}/calculator`);
        console.log('🚚 Calculating shipping via SuperFrete (Native HTTPS):', url.href);
        const postData = JSON.stringify(data);

        return new Promise((resolve, reject) => {
            const options = {
                hostname: url.hostname,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.TOKEN}`,
                    'User-Agent': 'Influetech/1.0',
                    'Content-Length': Buffer.byteLength(postData)
                },
                timeout: 10000 // 10s timeout
            };

            const req = https.request(options, (res) => {
                let body = '';

                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const parsed = JSON.parse(body);
                            resolve(parsed);
                        } catch (e) {
                            console.error('❌ Error parsing JSON response:', e);
                            reject(new Error('Invalid JSON response from SuperFrete'));
                        }
                    } else {
                        console.error('❌ SuperFrete API Error:', res.statusCode, body);
                        reject(new Error(`SuperFrete API Error: ${res.statusCode} - ${body}`));
                    }
                });
            });

            req.on('error', (e) => {
                console.error('❌ Request Error:', e);
                reject(new Error(`Request Error: ${e.message}`));
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request Timeout'));
            });

            req.write(postData);
            req.end();
        });
    }
}
