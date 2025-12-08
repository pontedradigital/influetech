import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

// Calendário completo de eventos comerciais brasileiros com mensagens personalizadas
const BRAZILIAN_EVENTS = [
    // Janeiro
    {
        name: 'Volta às Aulas',
        month: 1,
        day: 20,
        impact: 'VERY_HIGH',
        type: 'seasonal',
        reasons: [
            'Pais e responsáveis buscam materiais escolares e roupas novas',
            'Alta demanda por mochilas, uniformes e acessórios',
            'Período de renovação e organização para o ano letivo'
        ],
        tips: [
            'Destaque produtos para estudantes (mochilas, estojos, roupas)',
            'Crie combos "Kit Volta às Aulas" com desconto',
            'Divulgue com foco em pais e mães nas redes sociais'
        ]
    },

    // Fevereiro
    {
        name: 'Dia de São Valentim',
        month: 2,
        day: 14,
        impact: 'HIGH',
        type: 'commercial',
        reasons: [
            'Casais buscam presentes românticos para seus parceiros',
            'Crescente popularização da data no Brasil',
            'Oportunidade para produtos de moda, acessórios e cosméticos'
        ],
        tips: [
            'Foque em produtos românticos: joias, perfumes, roupas íntimas',
            'Crie embalagens especiais com tema de amor',
            'Ofereça combos para casais com desconto'
        ]
    },

    // Março
    {
        name: 'Dia da Mulher',
        month: 3,
        day: 8,
        impact: 'VERY_HIGH',
        type: 'commercial',
        reasons: [
            'Homens e mulheres buscam presentes para homenagear as mulheres',
            'Alta demanda por roupas, cosméticos e acessórios femininos',
            'Momento de valorização e celebração feminina'
        ],
        tips: [
            'Destaque produtos femininos: roupas, bolsas, maquiagem',
            'Crie promoções exclusivas "Especial Dia da Mulher"',
            'Faça lives mostrando os produtos e interagindo com o público'
        ]
    },
    {
        name: 'Dia do Consumidor',
        month: 3,
        day: 15,
        impact: 'VERY_HIGH',
        type: 'sale',
        reasons: [
            'Data comercial com descontos e promoções em todo varejo',
            'Consumidores esperam ofertas especiais e preços reduzidos',
            'Oportunidade para liquidar estoque parado'
        ],
        tips: [
            'Ofereça descontos reais de 20-40% em produtos selecionados',
            'Crie senso de urgência: "Só hoje" ou "Últimas unidades"',
            'Divulgue os descontos com antecedência para gerar expectativa'
        ]
    },

    // Abril
    {
        name: 'Páscoa',
        month: 4,
        day: 20,
        impact: 'HIGH',
        type: 'holiday',
        reasons: [
            'Famílias se reúnem e trocam presentes',
            'Momento de celebração e confraternização',
            'Oportunidade para produtos infantis e decoração'
        ],
        tips: [
            'Destaque produtos para crianças e decoração temática',
            'Crie cestas de Páscoa com produtos variados',
            'Ofereça frete grátis para compras acima de determinado valor'
        ]
    },

    // Maio
    {
        name: 'Dia das Mães',
        month: 5,
        day: 11,
        impact: 'VERY_HIGH',
        type: 'commercial',
        reasons: [
            'Segunda data comercial mais importante do ano no Brasil',
            'Filhos de todas as idades buscam presentes para suas mães',
            'Alta demanda por roupas, perfumes, joias e eletrônicos'
        ],
        tips: [
            'Destaque produtos que mães adoram: roupas, bolsas, perfumes',
            'Crie guia de presentes por faixa de preço',
            'Ofereça embalagem para presente gratuita',
            'Inicie divulgação 15 dias antes para captar compras antecipadas'
        ]
    },

    // Junho
    {
        name: 'Dia dos Namorados',
        month: 6,
        day: 12,
        impact: 'VERY_HIGH',
        type: 'commercial',
        reasons: [
            'Terceira data comercial mais importante do Brasil',
            'Casais trocam presentes para celebrar o relacionamento',
            'Alta demanda por produtos românticos e experiências'
        ],
        tips: [
            'Foque em produtos para casais: roupas íntimas, perfumes, joias',
            'Crie combos "Para Ele e Para Ela"',
            'Destaque produtos que podem ser usados a dois',
            'Divulgue histórias de amor de clientes para engajamento'
        ]
    },

    // Agosto
    {
        name: 'Dia dos Pais',
        month: 8,
        day: 10,
        impact: 'VERY_HIGH',
        type: 'commercial',
        reasons: [
            'Filhos buscam presentes para homenagear seus pais',
            'Alta demanda por produtos masculinos e tecnologia',
            'Momento de celebração da figura paterna'
        ],
        tips: [
            'Destaque produtos masculinos: roupas, acessórios, eletrônicos',
            'Crie guia "Presentes que Todo Pai Quer"',
            'Ofereça parcelamento facilitado para produtos de maior valor',
            'Faça lives mostrando os produtos em uso'
        ]
    },

    // Outubro
    {
        name: 'Dia das Crianças',
        month: 10,
        day: 12,
        impact: 'VERY_HIGH',
        type: 'commercial',
        reasons: [
            'Pais e familiares compram presentes para as crianças',
            'Alta demanda por brinquedos, roupas e calçados infantis',
            'Momento de alegria e celebração da infância'
        ],
        tips: [
            'Destaque produtos infantis: brinquedos, roupas, calçados',
            'Crie combos por faixa etária (0-3, 4-7, 8-12 anos)',
            'Ofereça brindes para compras acima de determinado valor',
            'Faça sorteios e promoções interativas nas redes sociais'
        ]
    },

    // Novembro
    {
        name: 'Black Friday',
        month: 11,
        day: 29,
        impact: 'VERY_HIGH',
        type: 'sale',
        reasons: [
            'Maior data de vendas do varejo brasileiro',
            'Consumidores esperam descontos de até 70%',
            'Oportunidade para vender grande volume com margem reduzida'
        ],
        tips: [
            'Prepare estoque com antecedência para alta demanda',
            'Ofereça descontos progressivos: quanto mais compra, mais desconto',
            'Crie contagem regressiva para gerar expectativa',
            'Divulgue "esquenta" da Black Friday dias antes',
            'Garanta atendimento rápido para não perder vendas'
        ]
    },

    // Dezembro
    {
        name: 'Natal',
        month: 12,
        day: 25,
        impact: 'VERY_HIGH',
        type: 'holiday',
        reasons: [
            'Principal data comercial do ano no Brasil',
            'Famílias trocam presentes e celebram juntas',
            'Alta demanda em todas as categorias de produtos'
        ],
        tips: [
            'Inicie divulgação no início de dezembro',
            'Crie guia de presentes por perfil: mãe, pai, irmão, amigo',
            'Ofereça embalagem natalina gratuita',
            'Destaque produtos que servem como presente universal',
            'Garanta entrega antes do Natal ou opção de retirada'
        ]
    },
];

interface BazarSuggestion {
    date: string;
    score: number;
    reasons: string[];
    nearbyEvent?: string;
    dayOfWeek: string;
    isWeekend: boolean;
    isPayday: boolean;
    tips: string[];
}

// Calcula score e retorna mensagens personalizadas
function calculateDateScore(date: Date): { score: number; reasons: string[]; nearbyEvent?: string; tips: string[] } {
    let score = 40;
    let reasons: string[] = [];
    let tips: string[] = [];
    let nearbyEvent: string | undefined;
    let bestEventMatch: any = null;
    let bestDaysUntil = 999;

    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Fim de semana
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        score += 25;
        reasons.push('Fim de semana - maior disponibilidade do público');
    }

    // Quinzenas (dias de pagamento)
    if ((dayOfMonth >= 1 && dayOfMonth <= 7) || (dayOfMonth >= 13 && dayOfMonth <= 20)) {
        score += 15;
        reasons.push('Período pós-pagamento - maior poder de compra');
    }

    // Encontra o evento mais próximo no sweet spot
    for (const event of BRAZILIAN_EVENTS) {
        let eventYear = year;
        if (month > event.month) {
            eventYear = year + 1;
        }

        const eventDate = new Date(eventYear, event.month - 1, event.day);
        const daysUntilEvent = Math.floor((eventDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        // Sweet spot: 7-14 dias antes
        if (daysUntilEvent >= 7 && daysUntilEvent <= 14) {
            if (event.impact === 'LOW') continue;

            // Pega o evento mais próximo dentro do sweet spot
            if (daysUntilEvent < bestDaysUntil) {
                bestDaysUntil = daysUntilEvent;
                bestEventMatch = event;
            }
        }

        // Penaliza datas muito próximas
        if (daysUntilEvent > 0 && daysUntilEvent < 7 && event.impact !== 'LOW') {
            score -= 15;
        }

        // Penaliza datas depois do evento
        if (daysUntilEvent < 0 && daysUntilEvent >= -3 && event.impact !== 'LOW') {
            score -= 20;
        }
    }

    // Se encontrou um evento, usa as mensagens personalizadas dele
    if (bestEventMatch) {
        const eventScore = bestEventMatch.impact === 'VERY_HIGH' ? 30 : bestEventMatch.impact === 'HIGH' ? 20 : 10;
        score += eventScore;
        nearbyEvent = bestEventMatch.name;

        // Usa as razões personalizadas do evento
        reasons = [
            `${bestDaysUntil} dias antes do ${bestEventMatch.name} - momento ideal para vender`,
            ...bestEventMatch.reasons
        ];

        // Usa as dicas personalizadas do evento
        tips = bestEventMatch.tips;
    }

    // Evitar feriados prolongados
    const longHolidays = [
        { month: 2, day: 28 }, // Carnaval
        { month: 4, day: 21 }, // Tiradentes
        { month: 11, day: 15 }, // Proclamação
        { month: 12, day: 25 }, // Natal
        { month: 1, day: 1 }, // Ano Novo
    ];

    for (const holiday of longHolidays) {
        if (month === holiday.month && Math.abs(dayOfMonth - holiday.day) <= 3) {
            score -= 25;
            if (!reasons.includes('Próximo a feriado prolongado - movimento reduzido')) {
                reasons.push('Próximo a feriado prolongado - movimento reduzido');
            }
        }
    }

    // Dicas genéricas apenas se não tiver evento
    if (tips.length === 0) {
        tips = [
            'Divulgue nas redes sociais com 7 dias de antecedência',
            'Prepare fotos de qualidade dos produtos',
            'Ofereça formas de pagamento variadas'
        ];
    }

    return { score: Math.min(100, Math.max(0, score)), reasons, nearbyEvent, tips };
}

// Gera sugestões ÚNICAS para os próximos 6 meses
export const getSuggestions = (req: Request, res: Response) => {
    try {
        const today = new Date();
        const suggestions: BazarSuggestion[] = [];
        const usedEvents = new Set<string>();
        const monthsToAnalyze = 6;

        // Para cada mês
        for (let monthOffset = 0; monthOffset < monthsToAnalyze; monthOffset++) {
            const currentMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
            const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

            const monthSuggestions: BazarSuggestion[] = [];

            // Analisa cada dia do mês
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

                if (date < today) continue;

                const { score, reasons, nearbyEvent, tips } = calculateDateScore(date);

                // Se tem evento e já foi usado, PULA
                if (nearbyEvent && usedEvents.has(nearbyEvent)) {
                    continue;
                }

                if (score >= 65) {
                    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

                    monthSuggestions.push({
                        date: date.toISOString().split('T')[0],
                        score,
                        reasons,
                        nearbyEvent,
                        dayOfWeek: dayNames[date.getDay()],
                        isWeekend: date.getDay() === 0 || date.getDay() === 6,
                        isPayday: (day >= 1 && day <= 7) || (day >= 13 && day <= 20),
                        tips
                    });

                    // Marca evento como USADO
                    if (nearbyEvent) {
                        usedEvents.add(nearbyEvent);
                    }
                }
            }

            // Ordena por score
            monthSuggestions.sort((a, b) => b.score - a.score);

            // Garante no mínimo 3 sugestões por mês
            if (monthSuggestions.length < 3) {
                for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    if (date < today) continue;

                    const dayOfWeek = date.getDay();
                    if ((dayOfWeek === 0 || dayOfWeek === 6) && !monthSuggestions.find(s => s.date === date.toISOString().split('T')[0])) {
                        const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                        monthSuggestions.push({
                            date: date.toISOString().split('T')[0],
                            score: 70,
                            reasons: ['Fim de semana - boa oportunidade para bazar'],
                            dayOfWeek: dayNames[dayOfWeek],
                            isWeekend: true,
                            isPayday: (day >= 1 && day <= 7) || (day >= 13 && day <= 20),
                            tips: ['Divulgue com antecedência', 'Prepare fotos de qualidade']
                        });

                        if (monthSuggestions.length >= 3) break;
                    }
                }
            }

            // Pega as top 5 sugestões do mês
            monthSuggestions.sort((a, b) => b.score - a.score);
            suggestions.push(...monthSuggestions.slice(0, 5));
        }

        res.json(suggestions);
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ error: 'Erro ao gerar sugestões' });
    }
};

// Lista eventos de bazar
export const listBazarEvents = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare('SELECT * FROM BazarEvent ORDER BY date ASC');
        const events = stmt.all();
        res.json(events);
    } catch (error) {
        console.error('Error listing bazar events:', error);
        res.status(500).json({ error: 'Erro ao listar bazares' });
    }
};

// Cria evento de bazar e alertas automáticos
export const createBazarEvent = async (req: Request, res: Response) => {
    const { title, description, date, location, productIds, userId } = req.body;

    try {
        const id = uuidv4();
        const finalUserId = userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896');

        const stmt = db.prepare(`
            INSERT INTO BazarEvent (
                id, userId, title, description, date, location, productIds, status, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PLANNED', datetime('now'), datetime('now'))
        `);

        stmt.run(id, finalUserId, title, description || null, date, location || null, productIds);

        const agendaId = uuidv4();
        db.prepare(`
            INSERT INTO ScheduledPost (
                id, userId, productId, title, caption, platforms, scheduledFor, status, createdAt, updatedAt
            ) VALUES (?, ?, NULL, ?, ?, '["Bazar"]', ?, 'SCHEDULED', datetime('now'), datetime('now'))
        `).run(agendaId, finalUserId, `🛍️ ${title}`, description || 'Bazar agendado', date);

        const bazarDate = new Date(date);
        const alerts = [
            { days: 30, title: 'Bazar Agendado', message: `Bazar "${title}" agendado para ${bazarDate.toLocaleDateString('pt-BR')}` },
            { days: 15, title: 'Criar Artes de Divulgação', message: `Prepare as artes para divulgar o bazar "${title}"` },
            { days: 7, title: 'Iniciar Divulgação', message: `Comece a divulgar o bazar "${title}" nas redes sociais` },
            { days: 3, title: 'Últimos Preparativos', message: `Bazar "${title}" se aproxima - revisar produtos e local` },
            { days: 1, title: 'Bazar Amanhã', message: `Bazar "${title}" acontece amanhã - últimas verificações` }
        ];

        for (const alert of alerts) {
            const alertDate = new Date(bazarDate);
            alertDate.setDate(alertDate.getDate() - alert.days);

            if (alertDate > new Date()) {
                const alertId = uuidv4();
                db.prepare(`
                    INSERT INTO Alert (
                        id, userId, type, title, message, relatedId, isRead, createdAt
                    ) VALUES (?, ?, 'POST_UPCOMING', ?, ?, ?, 0, datetime('now'))
                `).run(alertId, finalUserId, alert.title, alert.message, id);
            }
        }

        res.status(201).json({ id, title, message: 'Bazar criado com sucesso e alertas gerados' });
    } catch (error) {
        console.error('Error creating bazar event:', error);
        res.status(500).json({ error: 'Erro ao criar bazar' });
    }
};

// Atualiza evento de bazar
export const updateBazarEvent = (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, date, location, productIds, status } = req.body;

    try {
        const stmt = db.prepare(`
            UPDATE BazarEvent 
            SET title = ?, description = ?, date = ?, location = ?, productIds = ?, status = ?, updatedAt = datetime('now')
            WHERE id = ?
        `);

        const result = stmt.run(title, description, date, location, productIds, status, id);
        if (result.changes === 0) return res.status(404).json({ error: 'Bazar não encontrado' });
        res.json({ message: 'Bazar atualizado' });
    } catch (error) {
        console.error('Error updating bazar event:', error);
        res.status(500).json({ error: 'Erro ao atualizar bazar' });
    }
};

// Exclui evento de bazar
export const deleteBazarEvent = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM BazarEvent WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) return res.status(404).json({ error: 'Bazar não encontrado' });
        res.json({ message: 'Bazar excluído' });
    } catch (error) {
        console.error('Error deleting bazar event:', error);
        res.status(500).json({ error: 'Erro ao excluir bazar' });
    }
};
