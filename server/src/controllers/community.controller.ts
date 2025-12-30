import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const createPost = (req: Request, res: Response) => {
    try {
        const { userId, content } = req.body;
        const id = uuidv4();

        const stmt = db.prepare(`
            INSERT INTO CommunityPost (id, userId, content)
            VALUES (?, ?, ?)
        `);
        stmt.run(id, userId, content);

        res.status(201).json({ message: 'Post criado com sucesso', id });
    } catch (error: any) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Erro ao criar post' });
    }
};

export const getFeed = (req: Request, res: Response) => {
    try {
        const { userId } = req.query; // Current user ID to check if liked/hyped

        // Fetch posts with user details
        const postsStmt = db.prepare(`
            SELECT 
                p.*,
                u.name as userName,
                u.niche as userNiche,
                EXISTS (SELECT 1 FROM PostReaction WHERE postId = p.id AND userId = ? AND type = 'LIKE') as isLiked,
                EXISTS (SELECT 1 FROM PostReaction WHERE postId = p.id AND userId = ? AND type = 'HYPE') as isHyped
            FROM CommunityPost p
            JOIN User u ON p.userId = u.id
            ORDER BY p.createdAt DESC
            LIMIT 50
        `);

        // Need to pass userId twice for the two subqueries
        const posts = postsStmt.all(userId, userId);

        // Convert 1/0 from SQLite to booleans
        const formattedPosts = posts.map((post: any) => ({
            ...post,
            isLiked: Boolean(post.isLiked),
            isHyped: Boolean(post.isHyped)
        }));

        res.json(formattedPosts);
    } catch (error: any) {
        console.error('Error fetching feed:', error);
        res.status(500).json({ error: 'Erro ao buscar feed' });
    }
};

export const toggleReaction = (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const { userId, type } = req.body; // type: 'LIKE' or 'HYPE'

        if (!['LIKE', 'HYPE'].includes(type)) {
            return res.status(400).json({ error: 'Invalid reaction type' });
        }

        // Check if exists
        const checkStmt = db.prepare('SELECT id FROM PostReaction WHERE postId = ? AND userId = ? AND type = ?');
        const existing = checkStmt.get(postId, userId, type);

        const countColumn = type === 'LIKE' ? 'likesCount' : 'hypesCount';

        if (existing) {
            // Remove reaction
            const deleteStmt = db.prepare('DELETE FROM PostReaction WHERE postId = ? AND userId = ? AND type = ?');
            deleteStmt.run(postId, userId, type);

            // Decrement count
            db.prepare(`UPDATE CommunityPost SET ${countColumn} = ${countColumn} - 1 WHERE id = ?`).run(postId);

            res.json({ active: false });
        } else {
            // Add reaction
            const reactionId = uuidv4();
            const insertStmt = db.prepare('INSERT INTO PostReaction (id, postId, userId, type) VALUES (?, ?, ?, ?)');
            insertStmt.run(reactionId, postId, userId, type);

            // Increment count
            db.prepare(`UPDATE CommunityPost SET ${countColumn} = ${countColumn} + 1 WHERE id = ?`).run(postId);

            res.json({ active: true });
        }
    } catch (error: any) {
        console.error('Error toggling reaction:', error);
        res.status(500).json({ error: 'Erro ao reagir' });
    }
};

export const createComment = (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const { userId, content } = req.body;
        const commentId = uuidv4();

        const stmt = db.prepare(`
            INSERT INTO PostComment (id, postId, userId, content)
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(commentId, postId, userId, content);

        // Increment comments count
        db.prepare('UPDATE CommunityPost SET commentsCount = commentsCount + 1 WHERE id = ?').run(postId);

        res.status(201).json({ message: 'Comentário adicionado', id: commentId });
    } catch (error: any) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Erro ao comentar' });
    }
};

export const getComments = (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;

        const stmt = db.prepare(`
            SELECT 
                c.*,
                u.name as userName
            FROM PostComment c
            JOIN User u ON c.userId = u.id
            WHERE c.postId = ?
            ORDER BY c.createdAt ASC
        `);

        const comments = stmt.all(postId);
        res.json(comments);
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
};

export const deletePost = (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const { userId } = req.body; // In a real app this comes from auth token, using body for now to match current pattern

        // Check ownership
        const post = db.prepare('SELECT userId FROM CommunityPost WHERE id = ?').get(postId) as any;
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Allow if user is owner. (In a real app also allow admins)
        // Note: For now we trust the userId sent in body/query or we just allow delete if it matches. 
        // Ideally we check req.user.id from middleware.
        // Assuming the frontend sends the correct userId asking for deletion.

        // Since we are mocking auth somewhat, we will check if the post belongs to the requested user
        // But the user didn't explicitly say "only own posts", but it's implied. 
        // Let's rely on the frontend sending the userId to verify or just delete it for now if we don't have auth middleware active on this route.
        // Let's assume the body contains the valid userId requesting the delete.

        if (post.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Transaction to delete everything
        const deleteTransaction = db.transaction(() => {
            db.prepare('DELETE FROM PostReaction WHERE postId = ?').run(postId);
            db.prepare('DELETE FROM PostComment WHERE postId = ?').run(postId);
            db.prepare('DELETE FROM CommunityPost WHERE id = ?').run(postId);
        });

        deleteTransaction();

        res.json({ message: 'Post deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Erro ao deletar post' });
    }
};
