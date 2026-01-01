import db from '../db';
const prisma = db;

// Compatibility mapping if 'db' is named 'prisma' in this file context, 
// but simply assigning db to prisma variable avoids renaming everything below.

export const dashboardService = {
    async getStats(userId: string) {
        // const fs = require('fs');
        // Debug logging removed for cleanliness/lint fix

        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Inventory Count (Not sold/shipped)
        const inventoryCount = await prisma.product.count({
            where: {
                status: {
                    notIn: ['SOLD', 'SHIPPED']
                }
            }
        });

        // 2. Monthly Revenue
        const monthlySales = await prisma.sale.findMany({
            where: {
                saleDate: {
                    gte: firstDayOfMonth
                }
            }
        });

        // Sum numeric values from Decimal
        const revenue = monthlySales.reduce((acc: number, sale: any) => {
            return acc + (Number(sale.salePrice) || 0);
        }, 0);

        // 3. Pending Shipments
        const pendingShipments = await prisma.shipment.count({
            where: {
                status: 'pending'
            }
        });

        // 4. Next Bazar Event
        const nextBazar = await prisma.bazarEvent.findFirst({
            where: {
                date: {
                    gte: today
                },
                status: { not: 'CANCELLED' }
            },
            orderBy: {
                date: 'asc'
            }
        });

        // 5. Urgent Tasks (Top 3 TODO)
        const tasks = await prisma.task.findMany({
            where: {
                status: { not: 'DONE' }
            },
            take: 3,
            orderBy: [
                { priority: 'desc' }, // HIGH first
                { dueDate: 'asc' }    // Due soonest first
            ]
        });

        // 6. Active Financial Goal
        const goal = await prisma.financialGoal.findFirst({
            where: {
                status: 'ACTIVE'
            },
            take: 1
        });

        // 7. Recent Sales
        const recentSales = await prisma.sale.findMany({
            where: {},
            take: 3,
            orderBy: { saleDate: 'desc' },
            include: {
                product: { select: { name: true } }
            }
        });

        // 8. Charts Data
        // Revenue History (Last 6 Months)
        const revenueHistory = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('pt-BR', { month: 'short' });

            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

            const monthRevenue = await prisma.sale.aggregate({
                _sum: { salePrice: true },
                where: {
                    saleDate: { gte: start, lte: end }
                }
            });

            revenueHistory.push({
                month: monthName,
                value: Number(monthRevenue._sum.salePrice) || 0
            });
        }

        // Category Distribution
        // Efficient way:
        const soldProducts = await prisma.product.findMany({
            where: {
                sales: { some: {} } // Products that have been sold
            },
            select: {
                category: true,
                sales: {
                    select: { salePrice: true }
                }
            }
        });

        const categoryMap: Record<string, number> = {};
        soldProducts.forEach((p: any) => {
            const total = p.sales.reduce((sum: number, s: any) => sum + Number(s.salePrice), 0);
            categoryMap[p.category] = (categoryMap[p.category] || 0) + total;
        });

        const categoryDistribution = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

        return {
            inventory: { value: inventoryCount, label: 'Produtos em Estoque' },
            revenue: { value: revenue, label: 'Faturamento do Mês' },
            shipments: { value: pendingShipments, label: 'Envios Pendentes' },
            bazar: nextBazar ? { value: nextBazar.date, label: 'Próximo Bazar', title: nextBazar.title } : null,
            widgets: {
                tasks,
                goal,
                recentSales
            },
            charts: {
                revenueHistory,
                categoryDistribution
            }
        };
    },

    async generateInsights() {
        console.log('Generating insights for all users...');
        const users = await prisma.user.findMany({ where: { active: 1 } });

        for (const user of users) {
            const userId = user.id;

            // Check 1: Pending Shipments > 3 days
            const oldPendingShipments = await prisma.shipment.count({
                where: {
                    userId,
                    status: 'pending',
                    createdAt: {
                        lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
                    }
                }
            });

            if (oldPendingShipments > 0) {
                await dashboardService.createOrUpdateInsight(userId, 'ALERT', 'Envios Atrasados', `Você tem ${oldPendingShipments} envios pendentes há mais de 3 dias.`, 'HIGH');
            }

            // Check 2: Posts Scheduled for Today
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const postsToday = await prisma.scheduledPost.count({
                where: {
                    userId,
                    scheduledFor: {
                        gte: startOfDay,
                        lte: endOfDay
                    },
                    status: 'SCHEDULED'
                }
            });

            if (postsToday > 0) {
                await dashboardService.createOrUpdateInsight(userId, 'INFO', 'Posts Hoje', `Você tem ${postsToday} posts agendados para hoje. Fique atento!`, 'MEDIUM');
            }

            // Check 3: Low Inventory (Generic suggestion)
            const inventory = await prisma.product.count({ where: { userId, status: { notIn: ['SOLD', 'SHIPPED'] } } });
            if (inventory < 5) {
                await dashboardService.createOrUpdateInsight(userId, 'SUGGESTION', 'Reabastecer Estoque', 'Seu estoque está baixo. Que tal procurar novos produtos no Planejador?', 'LOW');
            }
        }
        console.log('Insights generation complete.');
    },

    async createOrUpdateInsight(userId: string, type: string, title: string, message: string, level: string) {
        // Avoid duplicate simple insights for the same day/type to prevent spam
        const existing = await (prisma as any).insight.findFirst({
            where: {
                userId,
                title,
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24h
                }
            }
        });

        if (!existing) {
            await (prisma as any).insight.create({
                data: {
                    userId,
                    type,
                    title,
                    message,
                    level
                }
            });
        }
    },

    async getInsights(userId: string) {
        return (prisma as any).insight.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
    }
};
