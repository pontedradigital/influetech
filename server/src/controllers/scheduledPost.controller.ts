import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const listScheduledPosts = async (req: Request, res: Response) => {
    try {
        const posts = await db.scheduledPost.findMany({
            orderBy: { scheduledFor: 'asc' },
            include: {
                product: {
                    select: { name: true }
                }
            }
        });

        const formatted = posts.map(p => ({
            ...p,
            productName: p.product?.name
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error listing scheduled posts:', error);
        res.status(500).json({ error: 'Erro ao listar posts agendados' });
    }
};

export const getScheduledPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const post = await db.scheduledPost.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ error: 'Post não encontrado' });
        res.json(post);
    } catch (error) {
        console.error('Error getting scheduled post:', error);
        res.status(500).json({ error: 'Erro ao buscar post' });
    }
};

export const createScheduledPost = async (req: Request, res: Response) => {
    const { title, caption, platforms, scheduledFor, productId, mediaUrl, mediaType, userId } = req.body;

    try {
        const finalUserId = userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896');

        // Ensure platforms is stringified if it's an array
        const platformsStr = typeof platforms === 'object' ? JSON.stringify(platforms) : platforms;

        const post = await db.scheduledPost.create({
            data: {
                userId: finalUserId,
                title,
                caption,
                platforms: platformsStr,
                scheduledFor: new Date(scheduledFor),
                productId: productId || undefined, // undefined to ignore if null/empty
                mediaUrl,
                mediaType,
                status: 'SCHEDULED'
            }
        });

        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating scheduled post:', error);
        res.status(500).json({ error: 'Erro ao criar post agendado' });
    }
};

export const updateScheduledPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, caption, platforms, scheduledFor, productId, mediaUrl, mediaType, status } = req.body;

    try {
        const platformsStr = typeof platforms === 'object' ? JSON.stringify(platforms) : platforms;

        const post = await db.scheduledPost.update({
            where: { id },
            data: {
                title,
                caption,
                platforms: platformsStr,
                scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
                productId: productId || null, // null allowed for optional relations
                mediaUrl,
                mediaType,
                status
            }
        });

        res.json({ message: 'Post atualizado', post });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Post não encontrado' });
        console.error('Error updating scheduled post:', error);
        res.status(500).json({ error: 'Erro ao atualizar post' });
    }
};

export const deleteScheduledPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.scheduledPost.delete({ where: { id } });
        res.json({ message: 'Post excluído' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Post não encontrado' });
        console.error('Error deleting scheduled post:', error);
        res.status(500).json({ error: 'Erro ao excluir post' });
    }
};

export const publishScheduledPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const now = new Date();

        // Get current post to check date
        const currentPost = await db.scheduledPost.findUnique({ where: { id } });

        if (!currentPost) return res.status(404).json({ error: 'Post não encontrado' });

        const scheduledDate = new Date(currentPost.scheduledFor);
        const newScheduledFor = scheduledDate > now ? now : currentPost.scheduledFor;

        await db.scheduledPost.update({
            where: { id },
            data: {
                status: 'PUBLISHED',
                publishedAt: now,
                scheduledFor: newScheduledFor
            }
        });

        res.json({ message: 'Post marcado como publicado' });
    } catch (error) {
        console.error('Error publishing post:', error);
        res.status(500).json({ error: 'Erro ao publicar post' });
    }
};
