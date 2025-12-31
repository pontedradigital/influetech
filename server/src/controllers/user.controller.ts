
import { Request, Response } from 'express';
import db from '../db';

export const updateProfile = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            isPublicProfile,
            bio,
            niche,
            location,
            socialInstagram,
            socialLinkedin,
            socialYoutube,
            socialTikTok,
            socialWhatsapp
        } = req.body;

        // First check if user exists
        const checkStmt = db.prepare('SELECT id FROM User WHERE id = ?');
        const user = checkStmt.get(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Helper to handle undefined values for update (skip update if undefined)
        // Since sqlite3 needs explicit SQL, we'll construct the SET clause dynamically or just update everything.
        // For simplicity and to match the other controller style, I'll update all fields, 
        // assuming the frontend sends the current values for fields that didn't change, 
        // OR better: fetch current values first. 
        // Actually, looking at company controller, it updates all fields. 
        // Let's assume the frontend sends everything or we use COALESCE in SQL.

        // But COALESCE(?, field) works only if we pass NULL for missing values.

        const stmt = db.prepare(`
            UPDATE User 
            SET 
                name = COALESCE(?, name),
                isPublicProfile = COALESCE(?, isPublicProfile),
                bio = COALESCE(?, bio),
                niche = COALESCE(?, niche),
                location = COALESCE(?, location),
                socialInstagram = COALESCE(?, socialInstagram),
                socialLinkedin = COALESCE(?, socialLinkedin),
                socialYoutube = COALESCE(?, socialYoutube),
                socialTikTok = COALESCE(?, socialTikTok),
                socialWhatsapp = COALESCE(?, socialWhatsapp),
                cep = COALESCE(?, cep),
                street = COALESCE(?, street),
                number = COALESCE(?, number),
                complement = COALESCE(?, complement),
                neighborhood = COALESCE(?, neighborhood),
                city = COALESCE(?, city),
                state = COALESCE(?, state),
                cpfCnpj = COALESCE(?, cpfCnpj),
                updatedAt = datetime('now')
            WHERE id = ?
        `);

        stmt.run(
            name,
            isPublicProfile === undefined ? null : (isPublicProfile ? 1 : 0), // SQLite stores booleans as 1/0
            bio,
            niche,
            location,
            socialInstagram,
            socialLinkedin,
            socialYoutube,
            socialTikTok,
            socialWhatsapp,
            req.body.cep,
            req.body.street,
            req.body.number,
            req.body.complement,
            req.body.neighborhood,
            req.body.city,
            req.body.state,
            req.body.cpfCnpj,
            id
        );

        // Fetch updated user to return
        const getStmt = db.prepare(`
            SELECT 
                id, name, email, plan, isPublicProfile, bio, niche, location, 
                socialInstagram, socialLinkedin, socialYoutube, socialTikTok, socialWhatsapp 
            FROM User WHERE id = ?
        `);
        const updatedUserRaw: any = getStmt.get(id);

        // Convert 1/0 back to boolean for isPublicProfile
        const result = {
            ...updatedUserRaw,
            isPublicProfile: Boolean(updatedUserRaw.isPublicProfile)
        };

        res.json(result);
    } catch (error: any) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil', details: error.message });
    }
};

export const getUser = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare(`
            SELECT 
                id, name, email, plan, isPublicProfile, bio, niche, location, 
                socialInstagram, socialLinkedin, socialYoutube, socialTikTok, socialWhatsapp,
                cep, street, number, complement, neighborhood, city, state, cpfCnpj
            FROM User WHERE id = ?
        `);
        const user: any = stmt.get(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Convert 1/0 back to boolean
        const result = {
            ...user,
            isPublicProfile: Boolean(user.isPublicProfile)
        };

        res.json(result);
    } catch (error: any) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
};

export const getPublicUsers = (req: Request, res: Response) => {
    try {
        const { search, niche, location } = req.query;

        let query = `
            SELECT 
                id, name, plan, bio, niche, location, 
                socialInstagram, socialLinkedin, socialYoutube, socialTikTok, socialWhatsapp,
                createdAt
            FROM User 
            WHERE isPublicProfile = 1 AND active = 1
        `;

        const params: any[] = [];

        if (search) {
            query += ` AND (name LIKE ? OR bio LIKE ? OR niche LIKE ?)`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        if (niche) {
            query += ` AND niche LIKE ?`;
            params.push(`%${niche}%`);
        }

        if (location) {
            query += ` AND location LIKE ?`;
            params.push(`%${location}%`);
        }

        query += ` ORDER BY createdAt DESC`;

        const stmt = db.prepare(query);
        const users = stmt.all(...params);

        res.json(users);
    } catch (error: any) {
        console.error('Error fetching public users:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários públicos', details: error.message });
    }
};

export const toggleLike = (req: Request, res: Response) => {
    const { fromUserId, toUserId } = req.body;

    try {
        // Check if like exists
        const checkStmt = db.prepare('SELECT id FROM ProfileLike WHERE fromUserId = ? AND toUserId = ?');
        const existingLike = checkStmt.get(fromUserId, toUserId);

        if (existingLike) {
            // Remove like (Unlike)
            const deleteStmt = db.prepare('DELETE FROM ProfileLike WHERE fromUserId = ? AND toUserId = ?');
            deleteStmt.run(fromUserId, toUserId);
            res.json({ liked: false });
        } else {
            // Add like
            const id = require('uuid').v4(); // We need uuid here, ensure it's imported or require it
            const insertStmt = db.prepare(`
                INSERT INTO ProfileLike (id, fromUserId, toUserId, createdAt)
                VALUES (?, ?, ?, datetime('now'))
            `);
            insertStmt.run(id, fromUserId, toUserId);
            res.json({ liked: true });
        }
    } catch (error: any) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Erro ao processar like' });
    }
};

export const getProfileStats = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Count likes received
        const likeStmt = db.prepare('SELECT COUNT(*) as count FROM ProfileLike WHERE toUserId = ?');
        const likeCount = likeStmt.get(id) as { count: number };

        // Count opportunities
        const oppStmt = db.prepare('SELECT COUNT(*) as count FROM Opportunity WHERE userId = ?');
        const oppCount = oppStmt.get(id) as { count: number };

        res.json({
            likesReceived: likeCount.count,
            opportunitiesPosted: oppCount.count
        });
    } catch (error: any) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
};
