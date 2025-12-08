import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const listAlerts = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare('SELECT * FROM Alert ORDER BY createdAt DESC');
        const alerts = stmt.all();
        res.json(alerts);
    } catch (error) {
        console.error('Error listing alerts:', error);
        res.status(500).json({ error: 'Erro ao listar alertas' });
    }
};

export const createAlert = (req: Request, res: Response) => {
    const { type, title, message, relatedId, userId } = req.body;

    try {
        const id = uuidv4();
        const finalUserId = userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896');

        const stmt = db.prepare(`
            INSERT INTO Alert (
                id, userId, type, title, message, relatedId, isRead, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'))
        `);

        stmt.run(id, finalUserId, type, title, message, relatedId || null);
        res.status(201).json({ id, title, isRead: false });
    } catch (error) {
        console.error('Error creating alert:', error);
        res.status(500).json({ error: 'Erro ao criar alerta' });
    }
};

export const markAlertAsRead = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('UPDATE Alert SET isRead = 1 WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) return res.status(404).json({ error: 'Alerta não encontrado' });
        res.json({ message: 'Alerta marcado como lido' });
    } catch (error) {
        console.error('Error marking alert as read:', error);
        res.status(500).json({ error: 'Erro ao marcar alerta como lido' });
    }
};

export const deleteAlert = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM Alert WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) return res.status(404).json({ error: 'Alerta não encontrado' });
        res.json({ message: 'Alerta excluído' });
    } catch (error) {
        console.error('Error deleting alert:', error);
        res.status(500).json({ error: 'Erro ao excluir alerta' });
    }
};

// Função para gerar alertas automáticos
export const generateAutomaticAlerts = (req: Request, res: Response) => {
    try {
        const userId = '327aa8c1-7c26-41c2-95d7-b375c25eb896';
        const alerts: Array<{ id: string; type: string }> = [];

        // 1. Alertas de posts próximos (1 dia antes)
        const upcomingPosts = db.prepare(`
            SELECT * FROM ScheduledPost 
            WHERE status = 'SCHEDULED' 
            AND datetime(scheduledFor) BETWEEN datetime('now') AND datetime('now', '+1 day')
        `).all();

        upcomingPosts.forEach((post: any) => {
            const alertId = uuidv4();
            db.prepare(`
                INSERT INTO Alert (id, userId, type, title, message, relatedId, isRead, createdAt)
                VALUES (?, ?, 'POST_UPCOMING', ?, ?, ?, 0, datetime('now'))
            `).run(alertId, userId, 'Post Próximo', `Post "${post.title}" agendado para amanhã`, post.id);
            alerts.push({ id: alertId, type: 'POST_UPCOMING' });
        });

        // 2. Alertas de tarefas vencendo (deadline em 24h)
        const dueTasks = db.prepare(`
            SELECT * FROM Task 
            WHERE status != 'DONE' 
            AND dueDate IS NOT NULL
            AND datetime(dueDate) BETWEEN datetime('now') AND datetime('now', '+1 day')
        `).all();

        dueTasks.forEach((task: any) => {
            const alertId = uuidv4();
            db.prepare(`
                INSERT INTO Alert (id, userId, type, title, message, relatedId, isRead, createdAt)
                VALUES (?, ?, 'TASK_DUE', ?, ?, ?, 0, datetime('now'))
            `).run(alertId, userId, 'Tarefa Vencendo', `Tarefa "${task.title}" vence em breve`, task.id);
            alerts.push({ id: alertId, type: 'TASK_DUE' });
        });

        // 3. Alertas de produtos sem post agendado (recebidos há 7+ dias)
        const productsWithoutPost = db.prepare(`
            SELECT p.* FROM Product p
            WHERE p.status = 'RECEIVED'
            AND datetime(p.createdAt) <= datetime('now', '-7 days')
            AND NOT EXISTS (
                SELECT 1 FROM ScheduledPost sp 
                WHERE sp.productId = p.id AND sp.status != 'CANCELLED'
            )
        `).all();

        productsWithoutPost.forEach((product: any) => {
            const alertId = uuidv4();
            db.prepare(`
                INSERT INTO Alert (id, userId, type, title, message, relatedId, isRead, createdAt)
                VALUES (?, ?, 'PRODUCT_NO_POST', ?, ?, ?, 0, datetime('now'))
            `).run(alertId, userId, 'Produto Sem Post', `Produto "${product.name}" recebido há mais de 7 dias sem post agendado`, product.id);
            alerts.push({ id: alertId, type: 'PRODUCT_NO_POST' });
        });

        res.json({ message: `${alerts.length} alertas gerados`, alerts });
    } catch (error) {
        console.error('Error generating alerts:', error);
        res.status(500).json({ error: 'Erro ao gerar alertas' });
    }
};
