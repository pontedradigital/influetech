import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const createPost = async (req: Request, res: Response) => {
    try {
        const { userId, content } = req.body;

        const post = await db.communityPost.create({
            data: {
                userId,
                content,
                likesCount: 0,
                hypesCount: 0,
                commentsCount: 0
            }
        });

        res.status(201).json({ message: 'Post criado com sucesso', id: post.id });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Erro ao criar post' });
    }
};

export const getFeed = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query as { userId: string };

        const posts = await db.communityPost.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                user: {
                    select: { name: true, niche: true }
                },
                reactions: {
                    where: { userId }
                }
            }
        });

        const formattedPosts = posts.map(post => {
            const isLiked = post.reactions.some(r => r.type === 'LIKE');
            const isHyped = post.reactions.some(r => r.type === 'HYPE');

            // Remove 'reactions' from the mapped object to keep response clean if desired, 
            // but effectively we just return the computed flags.
            return {
                ...post,
                userName: post.user.name,
                userNiche: post.user.niche,
                isLiked,
                isHyped,
                reactions: undefined // Hide raw reactions list
            };
        });

        res.json(formattedPosts);
    } catch (error) {
        console.error('Error fetching feed:', error);
        res.status(500).json({ error: 'Erro ao buscar feed' });
    }
};

export const toggleReaction = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const { userId, type } = req.body;

        if (!['LIKE', 'HYPE'].includes(type)) {
            return res.status(400).json({ error: 'Invalid reaction type' });
        }

        const countColumn = type === 'LIKE' ? 'likesCount' : 'hypesCount';

        // Check if exists
        const existing = await db.postReaction.findFirst({
            where: { postId, userId, type }
        });

        if (existing) {
            // Remove reaction
            await db.$transaction([
                db.postReaction.delete({ where: { id: existing.id } }),
                db.communityPost.update({
                    where: { id: postId },
                    data: { [countColumn]: { decrement: 1 } }
                })
            ]);
            res.json({ active: false });
        } else {
            // Add reaction
            await db.$transaction([
                db.postReaction.create({
                    data: { postId, userId, type }
                }),
                db.communityPost.update({
                    where: { id: postId },
                    data: { [countColumn]: { increment: 1 } }
                })
            ]);
            res.json({ active: true });
        }
    } catch (error) {
        console.error('Error toggling reaction:', error);
        res.status(500).json({ error: 'Erro ao reagir' });
    }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const { userId, content } = req.body;

        const [, comment] = await db.$transaction([
            db.communityPost.update({
                where: { id: postId },
                data: { commentsCount: { increment: 1 } }
            }),
            db.postComment.create({
                data: { postId, userId, content }
            })
        ]);

        res.status(201).json({ message: 'Comentário adicionado', id: comment.id });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Erro ao comentar' });
    }
};

export const getComments = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;

        const comments = await db.postComment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: { select: { name: true } }
            }
        });

        const mappedComments = comments.map(c => ({
            ...c,
            userName: c.user.name
        }));

        res.json(mappedComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const { userId } = req.body;

        const post = await db.communityPost.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Prisma cascade delete should handle reactions/comments if defined in schema.
        // If not defined with onDelete: Cascade in schema, we need manual delete.
        // Assuming database handles it or we do it manually. Let's do transaction for safety.

        await db.$transaction([
            db.postReaction.deleteMany({ where: { postId } }),
            db.postComment.deleteMany({ where: { postId } }),
            db.communityPost.delete({ where: { id: postId } })
        ]);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Erro ao deletar post' });
    }
};
