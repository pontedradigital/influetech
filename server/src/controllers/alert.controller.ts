import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const listAlerts = async (req: Request, res: Response) => {
    try {
        const alerts = await db.alert.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(alerts);
    } catch (error) {
        console.error('Error listing alerts:', error);
        res.status(500).json({ error: 'Erro ao listar alertas' });
    }
};

export const createAlert = async (req: Request, res: Response) => {
    const { type, title, message, relatedId, userId } = req.body;

    try {
        const finalUserId = userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896');

        const alert = await db.alert.create({
            data: {
                userId: finalUserId,
                type,
                title,
                message,
                relatedId: relatedId || null,
                isRead: 0
            }
        });

        res.status(201).json({ id: alert.id, title: alert.title, isRead: alert.isRead === 1 });
    } catch (error: any) {
        console.error('Error creating alert:', error);
        res.status(500).json({ error: 'Erro ao criar alerta' });
    }
};

export const markAlertAsRead = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.alert.update({
            where: { id },
            data: { isRead: 1 }
        });
        res.json({ message: 'Alerta marcado como lido' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Alerta não encontrado' });
        console.error('Error marking alert as read:', error);
        res.status(500).json({ error: 'Erro ao marcar alerta como lido' });
    }
};

export const deleteAlert = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.alert.delete({
            where: { id }
        });
        res.json({ message: 'Alerta excluído' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Alerta não encontrado' });
        console.error('Error deleting alert:', error);
        res.status(500).json({ error: 'Erro ao excluir alerta' });
    }
};

// Função para gerar alertas automáticos
export const generateAutomaticAlerts = async (req: Request, res: Response) => {
    try {
        const userId = '327aa8c1-7c26-41c2-95d7-b375c25eb896';
        const alertsCreated: Array<{ id: string; type: string }> = [];

        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // 1. Alertas de posts próximos (1 dia antes)
        // SQL: WHERE ... datetime(scheduledFor) BETWEEN datetime('now') AND datetime('now', '+1 day')
        const upcomingPosts = await db.scheduledPost.findMany({
            where: {
                status: 'SCHEDULED',
                scheduledFor: {
                    gte: now,
                    lte: tomorrow
                }
            }
        });

        for (const post of upcomingPosts) {
            // Check duplication if needed, but original code didn't check strictly inside loop, it just inserted.
            // Assuming repetition is handled elsewhere or acceptable for now as per original logic.
            // But actually, blindly inserting will spam alerts. Original code did blindly insert. I will mimic that behavior but usually unique check is better.
            // For faithful port, I will insert.
            const alert = await db.alert.create({
                data: {
                    userId,
                    type: 'POST_UPCOMING',
                    title: 'Post Próximo',
                    message: `Post "${post.title}" agendado para amanhã`, // or 'em breve'
                    relatedId: post.id,
                    isRead: 0
                }
            });
            alertsCreated.push({ id: alert.id, type: 'POST_UPCOMING' });
        }

        // 2. Alertas de tarefas vencendo (deadline em 24h)
        const dueTasks = await db.task.findMany({
            where: {
                status: { not: 'DONE' },
                dueDate: {
                    gte: now,
                    lte: tomorrow
                }
            }
        });

        for (const task of dueTasks) {
            const alert = await db.alert.create({
                data: {
                    userId,
                    type: 'TASK_DUE',
                    title: 'Tarefa Vencendo',
                    message: `Tarefa "${task.title}" vence em breve`,
                    relatedId: task.id,
                    isRead: 0
                }
            });
            alertsCreated.push({ id: alert.id, type: 'TASK_DUE' });
        }

        // 3. Alertas de produtos sem post agendado (recebidos há 7+ dias)
        // SQL: ... NOT EXISTS (SELECT 1 FROM ScheduledPost sp WHERE sp.productId = p.id ...)
        const productsWithoutPost = await db.product.findMany({
            where: {
                status: 'RECEIVED',
                createdAt: {
                    lte: sevenDaysAgo
                },
                scheduledPosts: {
                    none: {
                        status: { not: 'CANCELLED' }
                    }
                }
            }
        });

        for (const product of productsWithoutPost) {
            const alert = await db.alert.create({
                data: {
                    userId,
                    type: 'PRODUCT_NO_POST',
                    title: 'Produto Sem Post',
                    message: `Produto "${product.name}" recebido há mais de 7 dias sem post agendado`,
                    relatedId: product.id,
                    isRead: 0
                }
            });
            alertsCreated.push({ id: alert.id, type: 'PRODUCT_NO_POST' });
        }

        res.json({ message: `${alertsCreated.length} alertas gerados`, alerts: alertsCreated });
    } catch (error) {
        console.error('Error generating alerts:', error);
        res.status(500).json({ error: 'Erro ao gerar alertas' });
    }
};
