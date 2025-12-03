
interface ViabilityResult {
    isViable: boolean;
    message: string;
    recommendedRange: {
        min: number;
        max: number;
    };
}

export const calculatePartnershipViability = (
    totalFollowers: number,
    engagementRate: number,
    requestedValue: number,
    currency: 'BRL' | 'USD'
): ViabilityResult => {
    // Base rates per follower (heuristic)
    // BRL: R$ 0.04 per follower (approx R$ 40 per 1k)
    // USD: $ 0.008 per follower (approx $ 8 per 1k)
    const baseRate = currency === 'BRL' ? 0.04 : 0.008;

    // Engagement Multiplier
    // < 1%: 0.8x (Penalty)
    // 1% - 3%: 1.0x (Standard)
    // 3% - 6%: 1.3x (Good)
    // > 6%: 1.6x (Excellent)
    let engagementMultiplier = 1.0;
    if (engagementRate < 1) engagementMultiplier = 0.8;
    else if (engagementRate >= 3 && engagementRate < 6) engagementMultiplier = 1.3;
    else if (engagementRate >= 6) engagementMultiplier = 1.6;

    // Calculate estimated fair value
    const estimatedValue = totalFollowers * baseRate * engagementMultiplier;

    // Define a "safe" range
    // Min: 50% of estimated
    // Max: 150% of estimated (Aggressive but possible)
    const minRecommended = Math.round(estimatedValue * 0.5);
    const maxRecommended = Math.round(estimatedValue * 1.5);

    // Threshold for warning: 20% above the max recommended
    const warningThreshold = maxRecommended * 1.2;

    const isViable = requestedValue <= warningThreshold;

    let message = '';
    if (!isViable) {
        const currencySymbol = currency === 'BRL' ? 'R$' : '$';
        message = `O valor solicitado está significativamente acima da média de mercado para o seu perfil (baseado em ${totalFollowers.toLocaleString()} seguidores e ${engagementRate}% de engajamento). Isso pode reduzir suas chances de fechar parcerias. Recomendamos uma faixa entre ${currencySymbol} ${minRecommended.toLocaleString()} e ${currencySymbol} ${maxRecommended.toLocaleString()}.`;
    }

    return {
        isViable,
        message,
        recommendedRange: {
            min: minRecommended,
            max: maxRecommended
        }
    };
};
