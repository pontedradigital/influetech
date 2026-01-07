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
        // TODO: Implement new Shipping API here
        console.warn('⚠️ Shipping API intentionally removed. Waiting for new integration.');
        throw new Error('Nenhuma transportadora configurada no momento. Aguardando integração.');
    }

    static formatCep(cep: string): string {
        return cep.replace(/\D/g, '');
    }

    static isValidCep(cep: string): boolean {
        const cleaned = this.formatCep(cep);
        return cleaned.length === 8;
    }
}
