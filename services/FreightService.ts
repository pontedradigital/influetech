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
    [key: string]: FreightOption | undefined;
}

// Serviço de cálculo de frete
export class FreightService {
    private static readonly SANDBOX_URL = 'https://sandbox.melhorenvio.com.br/api/v2';
    private static readonly PRODUCTION_URL = 'https://melhorenvio.com.br/api/v2';

    private static readonly USE_MOCK = !import.meta.env.VITE_MELHOR_ENVIO_TOKEN;
    private static readonly API_TOKEN = import.meta.env.VITE_MELHOR_ENVIO_TOKEN || '';
    private static readonly USE_SANDBOX = import.meta.env.VITE_MELHOR_ENVIO_SANDBOX !== 'false';
    private static readonly APP_NAME = import.meta.env.VITE_APP_NAME || 'InflueTech';
    private static readonly APP_EMAIL = import.meta.env.VITE_APP_EMAIL || 'contato@influetech.com.br';

    private static getApiUrl(): string {
        return this.USE_SANDBOX ? this.SANDBOX_URL : this.PRODUCTION_URL;
    }

    static async calculate(request: FreightCalculationRequest): Promise<FreightCalculationResponse> {
        if (this.USE_MOCK) {
            console.log('⚠️ Usando cálculo estimado (token não configurado)');
            return this.calculateMockWithRealFormula(request);
        }

        console.log('✅ Usando API real do Melhor Envio');

        try {
            // Formato correto da API Melhor Envio
            const apiRequest = {
                from: {
                    postal_code: this.formatCep(request.from.postal_code)
                },
                to: {
                    postal_code: this.formatCep(request.to.postal_code)
                },
                products: [
                    {
                        id: "1",
                        width: request.package.width,
                        height: request.package.height,
                        length: request.package.length,
                        weight: request.package.weight,
                        insurance_value: request.options?.insurance_value || 0,
                        quantity: 1
                    }
                ]
            };

            console.log('📦 Requisição para API:', JSON.stringify(apiRequest, null, 2));

            // Usar proxy local para evitar CORS
            const response = await fetch('/api/melhor-envio/me/shipment/calculate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    // Authorization e User-Agent são adicionados pelo proxy
                },
                body: JSON.stringify(apiRequest)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erro da API:', response.status, errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const data: any[] = await response.json();
            console.log('📨 Resposta da API:', data.length, 'opções recebidas');

            // Organizar resultados - FILTRAR APENAS AS DESEJADAS
            const result: FreightCalculationResponse = {};

            data.forEach(option => {
                // Validar se price é um número válido
                const price = parseFloat(option.price);
                if (isNaN(price) || price <= 0) {
                    console.warn('⚠️ Preço inválido para', option.name, ':', option.price);
                    return; // Pular esta opção
                }

                const serviceName = option.name.toLowerCase();
                const companyName = option.company.name.toLowerCase();

                // Mapear APENAS as 4 transportadoras permitidas
                let shouldInclude = false;
                let key = '';

                if (serviceName.includes('pac') && !result.pac) {
                    key = 'pac';
                    shouldInclude = true;
                } else if (serviceName.includes('sedex') && !result.sedex) {
                    key = 'sedex';
                    shouldInclude = true;
                } else if ((companyName.includes('jadlog') || serviceName.includes('jadlog')) && !result.jadlog) {
                    key = 'jadlog';
                    shouldInclude = true;
                } else if ((companyName.includes('loggi') || serviceName.includes('loggi')) && !result.loggi) {
                    key = 'loggi';
                    shouldInclude = true;
                }

                if (shouldInclude) {
                    result[key] = {
                        ...option,
                        price: price,
                        custom_price: parseFloat(option.custom_price || option.price),
                        discount: parseFloat(option.discount || '0')
                    };
                }
            });

            console.log('✅ Transportadoras encontradas:', Object.keys(result).join(', '));

            // Se não encontrou nenhuma, usar fallback
            if (Object.keys(result).length === 0) {
                console.warn('⚠️ Nenhuma transportadora válida, usando fallback');
                return this.calculateMockWithRealFormula(request);
            }
            return result;
        } catch (error) {
            console.error('❌ Erro ao calcular frete com API:', error);
            console.log('⚠️ Usando fallback para cálculo estimado');
            return this.calculateMockWithRealFormula(request);
        }
    }

    private static calculateMockWithRealFormula(request: FreightCalculationRequest): FreightCalculationResponse {
        const { package: pkg, from, to, options } = request;

        console.log('=== FREIGHT SERVICE CALCULATION (MOCK) ===');
        console.log('From CEP:', from.postal_code);
        console.log('To CEP:', to.postal_code);
        console.log('Package:', pkg);

        const cubicWeight = (pkg.height * pkg.width * pkg.length) / 6000;
        const finalWeight = Math.max(pkg.weight, cubicWeight);

        console.log('Peso Real:', pkg.weight, 'kg');
        console.log('Peso Cubado:', cubicWeight.toFixed(2), 'kg');
        console.log('Peso Final (maior):', finalWeight.toFixed(2), 'kg');

        const fromRegion = parseInt(from.postal_code.substring(0, 2)) || 0;
        const toRegion = parseInt(to.postal_code.substring(0, 2)) || 0;
        const distance = Math.abs(fromRegion - toRegion);

        console.log('Região Origem:', fromRegion);
        console.log('Região Destino:', toRegion);
        console.log('Distância (regiões):', distance);

        const pacBasePrice = 25.00;
        const pacWeightFactor = 18.00;
        const pacDistanceFactor = 0.50;
        const pacPrice = pacBasePrice + (finalWeight * pacWeightFactor) + (distance * pacDistanceFactor);
        const pacDays = 5 + Math.floor(distance / 10);

        const sedexPrice = pacPrice * 1.47;
        const sedexDays = 2 + Math.floor(distance / 15);

        const insuranceValue = options?.insurance_value || 0;
        const insuranceFee = insuranceValue > 0 ? insuranceValue * 0.015 : 0;

        const pacFinal = Number((pacPrice + insuranceFee).toFixed(2));
        const sedexFinal = Number((sedexPrice + insuranceFee).toFixed(2));

        const jadlogPrice = pacPrice * 0.95;
        const jadlogDays = pacDays - 1;
        const jadlogFinal = Number((jadlogPrice + insuranceFee).toFixed(2));

        const loggiPrice = sedexPrice * 0.92;
        const loggiDays = sedexDays;
        const loggiFinal = Number((loggiPrice + insuranceFee).toFixed(2));

        const azulPrice = sedexPrice * 1.15;
        const azulDays = Math.max(1, sedexDays - 1);
        const azulFinal = Number((azulPrice + insuranceFee).toFixed(2));

        console.log('PAC Calculado:', pacFinal);
        console.log('SEDEX Calculado:', sedexFinal);
        console.log('Jadlog Calculado:', jadlogFinal);
        console.log('Loggi Calculado:', loggiFinal);
        console.log('Azul Cargo Calculado:', azulFinal);
        console.log('===================================');

        return {
            pac: {
                id: 1,
                name: 'PAC',
                company: {
                    id: 1,
                    name: 'Correios',
                    picture: ''
                },
                price: pacFinal,
                discount: 0,
                currency: 'BRL',
                delivery_time: pacDays,
                delivery_range: {
                    min: pacDays,
                    max: pacDays + 2
                },
                custom_price: pacFinal,
                custom_delivery_time: pacDays,
                packages: [{
                    price: pacFinal,
                    discount: 0,
                    format: 'box',
                    weight: pkg.weight.toString(),
                    insurance_value: insuranceValue.toString(),
                    products: []
                }]
            },
            sedex: {
                id: 2,
                name: 'SEDEX',
                company: {
                    id: 1,
                    name: 'Correios',
                    picture: ''
                },
                price: sedexFinal,
                discount: 0,
                currency: 'BRL',
                delivery_time: sedexDays,
                delivery_range: {
                    min: sedexDays,
                    max: sedexDays + 1
                },
                custom_price: sedexFinal,
                custom_delivery_time: sedexDays,
                packages: [{
                    price: sedexFinal,
                    discount: 0,
                    format: 'box',
                    weight: pkg.weight.toString(),
                    insurance_value: insuranceValue.toString(),
                    products: []
                }]
            },
            jadlog: {
                id: 3,
                name: 'Jadlog Package',
                company: {
                    id: 2,
                    name: 'Jadlog',
                    picture: ''
                },
                price: jadlogFinal,
                discount: 0,
                currency: 'BRL',
                delivery_time: jadlogDays,
                delivery_range: {
                    min: jadlogDays,
                    max: jadlogDays + 2
                },
                custom_price: jadlogFinal,
                custom_delivery_time: jadlogDays,
                packages: [{
                    price: jadlogFinal,
                    discount: 0,
                    format: 'box',
                    weight: pkg.weight.toString(),
                    insurance_value: insuranceValue.toString(),
                    products: []
                }]
            },
            loggi: {
                id: 4,
                name: 'Loggi Expresso',
                company: {
                    id: 3,
                    name: 'Loggi',
                    picture: ''
                },
                price: loggiFinal,
                discount: 0,
                currency: 'BRL',
                delivery_time: loggiDays,
                delivery_range: {
                    min: loggiDays,
                    max: loggiDays + 1
                },
                custom_price: loggiFinal,
                custom_delivery_time: loggiDays,
                packages: [{
                    price: loggiFinal,
                    discount: 0,
                    format: 'box',
                    weight: pkg.weight.toString(),
                    insurance_value: insuranceValue.toString(),
                    products: []
                }]
            },
            azul: {
                id: 5,
                name: 'Azul Cargo Express',
                company: {
                    id: 4,
                    name: 'Azul Cargo',
                    picture: ''
                },
                price: azulFinal,
                discount: 0,
                currency: 'BRL',
                delivery_time: azulDays,
                delivery_range: {
                    min: azulDays,
                    max: azulDays + 1
                },
                custom_price: azulFinal,
                custom_delivery_time: azulDays,
                packages: [{
                    price: azulFinal,
                    discount: 0,
                    format: 'box',
                    weight: pkg.weight.toString(),
                    insurance_value: insuranceValue.toString(),
                    products: []
                }]
            }
        };
    }

    static formatCep(cep: string): string {
        return cep.replace(/\D/g, '');
    }

    static isValidCep(cep: string): boolean {
        const cleaned = this.formatCep(cep);
        return cleaned.length === 8;
    }
}
