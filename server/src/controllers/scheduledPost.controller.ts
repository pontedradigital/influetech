import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const listScheduledPosts = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare(`
            SELECT sp.*, p.name as productName 
            FROM ScheduledPost sp
            LEFT JOIN Product p ON sp.productId = p.id
            ORDER BY sp.scheduledFor ASC
        `);
        const posts = stmt.all();
        res.json(posts);
    } catch (error) {
        console.error('Error listing scheduled posts:', error);
        res.status(500).json({ error: 'Erro ao listar posts agendados' });
    }
};

export const getScheduledPost = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('SELECT * FROM ScheduledPost WHERE id = ?');
        const post = stmt.get(id);
        if (!post) return res.status(404).json({ error: 'Post não encontrado' });
        res.json(post);
    } catch (error) {
        console.error('Error getting scheduled post:', error);
        res.status(500).json({ error: 'Erro ao buscar post' });
    }
};

export const createScheduledPost = (req: Request, res: Response) => {
    const { title, caption, platforms, scheduledFor, productId, mediaUrl, mediaType, userId } = req.body;

    try {
        const id = uuidv4();
        const finalUserId = userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896');

        const stmt = db.prepare(`
            INSERT INTO ScheduledPost (
                id, userId, productId, title, caption, platforms, scheduledFor, 
                status, mediaUrl, mediaType, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', ?, ?, datetime('now'), datetime('now'))
        `);

        stmt.run(id, finalUserId, productId || null, title, caption || null, platforms, scheduledFor, mediaUrl || null, mediaType || null);
        res.status(201).json({ id, title, status: 'SCHEDULED' });
    } catch (error) {
        console.error('Error creating scheduled post:', error);
        res.status(500).json({ error: 'Erro ao criar post agendado' });
    }
};

export const updateScheduledPost = (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, caption, platforms, scheduledFor, productId, mediaUrl, mediaType, status } = req.body;

    try {
        const stmt = db.prepare(`
            UPDATE ScheduledPost 
            SET title = ?, caption = ?, platforms = ?, scheduledFor = ?, 
                productId = ?, mediaUrl = ?, mediaType = ?, status = ?, updatedAt = datetime('now')
            WHERE id = ?
        `);

        const result = stmt.run(title, caption, platforms, scheduledFor, productId || null, mediaUrl, mediaType, status, id);
        if (result.changes === 0) return res.status(404).json({ error: 'Post não encontrado' });
        res.json({ message: 'Post atualizado' });
    } catch (error) {
        console.error('Error updating scheduled post:', error);
        res.status(500).json({ error: 'Erro ao atualizar post' });
    }
};

export const deleteScheduledPost = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM ScheduledPost WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) return res.status(404).json({ error: 'Post não encontrado' });
        res.json({ message: 'Post excluído' });
    } catch (error) {
        console.error('Error deleting scheduled post:', error);
        res.status(500).json({ error: 'Erro ao excluir post' });
    }
};

export const publishScheduledPost = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const now = new Date();
        const nowIso = now.toISOString();

        // Get current post to check date
        const currentPost = db.prepare('SELECT scheduledFor FROM ScheduledPost WHERE id = ?').get(id) as any;

        if (!currentPost) return res.status(404).json({ error: 'Post não encontrado' });

        const scheduledDate = new Date(currentPost.scheduledFor);
        const newScheduledFor = scheduledDate > now ? nowIso : currentPost.scheduledFor;

        const stmt = db.prepare(`
            UPDATE ScheduledPost 
            SET status = 'PUBLISHED', 
                publishedAt = ?, 
                scheduledFor = ?,
                updatedAt = ?
            WHERE id = ?
        `);

        stmt.run(nowIso, newScheduledFor, nowIso, id);
        res.json({ message: 'Post marcado como publicado' });
    } catch (error) {
        console.error('Error publishing post:', error);
        res.status(500).json({ error: 'Erro ao publicar post' });
    }
};
