export const HOLIDAYS = [
    // 2025
    { date: '2025-01-01', name: 'Confraternização Universal', type: 'feriado' },
    { date: '2025-03-04', name: 'Carnaval', type: 'feriado' },
    { date: '2025-04-18', name: 'Sexta-feira Santa', type: 'feriado' },
    { date: '2025-04-20', name: 'Páscoa', type: 'comemorativo' },
    { date: '2025-04-21', name: 'Tiradentes', type: 'feriado' },
    { date: '2025-05-01', name: 'Dia do Trabalho', type: 'feriado' },
    { date: '2025-05-11', name: 'Dia das Mães', type: 'comemorativo', important: true },
    { date: '2025-06-12', name: 'Dia dos Namorados', type: 'comemorativo', important: true },
    { date: '2025-06-19', name: 'Corpus Christi', type: 'feriado' },
    { date: '2025-08-10', name: 'Dia dos Pais', type: 'comemorativo', important: true },
    { date: '2025-09-07', name: 'Independência do Brasil', type: 'feriado' },
    { date: '2025-10-12', name: 'Nossa Senhora Aparecida / Dia das Crianças', type: 'feriado', important: true },
    { date: '2025-11-02', name: 'Finados', type: 'feriado' },
    { date: '2025-11-15', name: 'Proclamação da República', type: 'feriado' },
    { date: '2025-11-20', name: 'Dia da Consciência Negra', type: 'feriado' },
    { date: '2025-11-28', name: 'Black Friday', type: 'comemorativo', important: true },
    { date: '2025-12-25', name: 'Natal', type: 'feriado', important: true },

    // 2026
    { date: '2026-01-01', name: 'Confraternização Universal', type: 'feriado' },
    { date: '2026-02-17', name: 'Carnaval', type: 'feriado' },
    { date: '2026-04-03', name: 'Sexta-feira Santa', type: 'feriado' },
    { date: '2026-04-05', name: 'Páscoa', type: 'comemorativo' },
    { date: '2026-04-21', name: 'Tiradentes', type: 'feriado' },
    { date: '2026-05-01', name: 'Dia do Trabalho', type: 'feriado' },
    { date: '2026-05-10', name: 'Dia das Mães', type: 'comemorativo', important: true },
    { date: '2026-06-11', name: 'Corpus Christi', type: 'feriado' },
    { date: '2026-06-12', name: 'Dia dos Namorados', type: 'comemorativo', important: true },
];

interface ScoreResult {
    score: number;
    reasons: string[];
    tips: string[];
    nearbyEvent?: string;
    isHoliday?: boolean;
}

export function calculateDateScore(date: Date): ScoreResult {
    let score = 50; // Base score
    const reasons: string[] = [];
    const tips: string[] = [];
    let nearbyEvent: string | undefined;

    const day = date.getDate();
    const month = date.getMonth(); // 0-11
    const dayOfWeek = date.getDay(); // 0-6 (Sun-Sat)
    const dateString = date.toISOString().split('T')[0];

    // --- 1. Day of Week Logic ---
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        score += 20;
        reasons.push('Fim de semana: maior disponibilidade dos clientes');
    } else if (dayOfWeek === 5) {
        score += 10;
        reasons.push('Sexta-feira: bom para engajamento pré-fim de semana');
    } else {
        score -= 5;
        // reasons.push('Dia de semana: movimento tende a ser menor');
    }

    // --- 2. Payday Logic (approximate) ---
    // 5th working day (approx 5-7), 15th (advance), 30th (salary)
    if ((day >= 5 && day <= 10) || (day >= 28 || day === 1)) {
        score += 25;
        reasons.push('Período de pagamento: poder de compra elevado');
        tips.push('Aproveite o salário recém-recebido dos clientes!');
    } else if (day >= 14 && day <= 16) {
        score += 15;
        reasons.push('Vale/Adiantamento (dia 15): bom momento de vendas');
    } else if (day >= 18 && day <= 25) {
        score -= 15;
        reasons.push('Fim de mês: orçamento dos clientes mais apertado');
        tips.push('Ofereça descontos ou condições especiais para incentivar');
    }

    // --- 3. Holiday/Event Logic ---
    const checkDate = (d: Date) => d.toISOString().split('T')[0];

    // Check exact date matches
    const exactHoliday = HOLIDAYS.find(h => h.date === dateString);
    if (exactHoliday) {
        if (exactHoliday.important) {
            score += 10; // Can be good or bad depending on niche, usually good for specific items
            nearbyEvent = exactHoliday.name;
            reasons.push(`${exactHoliday.name}: data comercial fortíssima`);
        } else {
            score -= 20; // Generic holiday -> people travel or rest
            reasons.push(`${exactHoliday.name}: Feriado, risco de baixo engajamento`);
            tips.push('Foque em vendas online ou antecipadas');
            return { score: Math.max(0, Math.min(100, score)), reasons, tips, nearbyEvent: exactHoliday.name, isHoliday: true };
        }
    }

    // Check upcoming holidays (Preparation window)
    // 7-14 days before is good for "Gift" holidays (Mother's day, Christmas)
    for (const holiday of HOLIDAYS) {
        const holidayDate = new Date(holiday.date);
        // Reset time to avoid timezone issues affecting diff
        const dTime = new Date(dateString).getTime();
        const hTime = new Date(holiday.date).getTime();
        const diffDays = Math.ceil((hTime - dTime) / (1000 * 60 * 60 * 24));

        if (diffDays > 0 && diffDays <= 14 && holiday.important) {
            if (diffDays <= 7) {
                score += 30;
                nearbyEvent = `Pré-${holiday.name}`;
                reasons.push(`Semana do(a) ${holiday.name}: Alta demanda por presentes`);
                tips.push(`Crie kits especiais para o(a) ${holiday.name}`);
            } else {
                score += 15;
                nearbyEvent = `Chegando: ${holiday.name}`;
                reasons.push(`Antecipação ${holiday.name}: Clientes pesquisando presentes`);
            }
        }
    }

    // --- 4. Seasonal Adjustments ---
    // January (Post-Christmas slump)
    if (month === 0 && day < 15) {
        score -= 20;
        reasons.push('Início de ano: Pós-gastos de Natal e contas (IPVA/IPTU)');
        tips.push('Foque em promoções de queima de estoque');
    }

    // Black Friday Month (November)
    if (month === 10 && day >= 15 && day < 28) {
        score += 10;
        reasons.push('Aquecimento Black Friday');
    }

    // --- Cap Score ---
    score = Math.max(0, Math.min(100, score));

    return {
        score,
        reasons: [...new Set(reasons)], // Unique
        tips: [...new Set(tips)],
        nearbyEvent
    };
}
