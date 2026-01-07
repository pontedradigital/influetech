// Interfaces para a API do Melhor Envio
export interface FreightPackage {
    height: number; // cm
    width: number; // cm
    length: number; // cm
    weight: number; // kg
}

export interface FreightCalculationRequest {
    from: {
        postal_code: string;
    };
    to: {
        postal_code: string;
    };
    package: FreightPackage;
    options?: {
        insurance_value?: number;
        receipt?: boolean;
        own_hand?: boolean;
    };
}

export interface FreightOption {
    id: number;
    name: string;
    company: {
        id: number;
        name: string;
        picture: string;
    };
    price: number;
    discount: number;
    currency: string;
    delivery_time: number;
    delivery_range: {
        min: number;
        max: number;
    };
    custom_price: number;
    custom_delivery_time: number;
    packages: Array<{
        price: number;
        discount: number;
        format: string;
        weight: string;
        insurance_value: string;
        products: any[];
    }>;
    error?: string;
}

export interface FreightCalculationResponse {
    pac?: FreightOption;
    sedex?: FreightOption;
    jadlog?: FreightOption;
    loggi?: FreightOption;
    azul?: FreightOption;
    [key: string]: FreightOption | undefined | boolean;
    isFallback?: boolean;
}

// Serviço de cálculo de frete
export class FreightService {

    static async calculate(request: FreightCalculationRequest): Promise<FreightCalculationResponse> {
        // Prepare payload for backend (mapping internal structure to controller expectation)
        // Controller expects { products: [...] }, but frontend Request has { package }.
        const payload = {
            ...request,
            products: [{
                ...request.package,
                quantity: 1,
                weight: request.package.weight, // Ensure weight is passed
                height: request.package.height,
                width: request.package.width,
                length: request.package.length
            }]
        };

        try {
            const response = await fetch('/api/shipments/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao calcular frete');
            }

            const data = await response.json();

            // The API returns an Array of options.
            // We must convert it to an Object/Map for the Frontend to consume mostly seamlessly,
            // or at least matching the expected Interface structure.
            if (Array.isArray(data)) {
                const resultMap: FreightCalculationResponse = {};
                data.forEach((option: any) => {
                    // Use normalized keys if possible, or just option name
                    // Remove generic spaces or special chars if needed for keys
                    const key = option.name ? option.name.toLowerCase().replace(/\s+/g, '_') : `opt_${option.id}`;
                    resultMap[option.name] = option; // Keep original name as key for lookup consistency if UI uses name
                });
                return resultMap;
            }

            return data as FreightCalculationResponse;
        } catch (error) {
            console.error('Freight calculation error:', error);
            throw error;
        }
    }

    static formatCep(cep: string): string {
        return cep.replace(/\D/g, '');
    }

    static isValidCep(cep: string): boolean {
        const cleaned = this.formatCep(cep);
        return cleaned.length === 8;
    }
}
