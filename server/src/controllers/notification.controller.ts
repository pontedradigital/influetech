import { Request, Response } from 'express';
import db from '../db';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        const notifications = await db.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        res.json(notifications);
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ error: 'Erro ao buscar notificações' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const userId = (req as any).user?.id;

        await db.notification.updateMany({
            where: {
                id: id,
                userId
            },
            data: { read: true }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Mark Read Error:', error);
        res.status(500).json({ error: 'Erro ao atualizar notificação' });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        await db.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Mark All Read Error:', error);
        res.status(500).json({ error: 'Erro ao atualizar notificações' });
    }
};

// Internal function to create notification
export const createNotification = async (userId: string, title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO', link?: string) => {
    try {
        await db.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link,
                read: false // Explicitly set default, although schema has it
            }
        });
    } catch (error) {
        console.error('Create Notification Error:', error);
    }
};
