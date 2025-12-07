
import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const listOpportunities = (req: Request, res: Response) => {
    try {
        const { type } = req.query;
        let query = `
            SELECT 
                o.*,
                u.name as userName,
                u.isPublicProfile as userIsPublic
            FROM Opportunity o
            JOIN User u ON o.userId = u.id
            WHERE 1=1
        `;

        const params: any[] = [];
        if (type) {
            query += ` AND o.type = ?`;
            params.push(type);
        }

        query += ` ORDER BY o.createdAt DESC`;

        const stmt = db.prepare(query);
        const opportunities = stmt.all(...params);

        res.json(opportunities);
    } catch (error: any) {
        console.error('Error listing opportunities:', error);
        res.status(500).json({ error: 'Erro ao listar oportunidades' });
    }
};

export const createOpportunity = (req: Request, res: Response) => {
    try {
        const { title, description, type, userId } = req.body;

        if (!title || !description || !type || !userId) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO Opportunity (id, title, description, type, status, userId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 'OPEN', ?, datetime('now'), datetime('now'))
        `);

        stmt.run(id, title, description, type, userId);

        res.status(201).json({ id, title, description, type, status: 'OPEN', userId });
    } catch (error: any) {
        console.error('Error creating opportunity:', error);
        res.status(500).json({ error: 'Erro ao criar oportunidade' });
    }
};

export const deleteOpportunity = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM Opportunity WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) return res.status(404).json({ error: 'Oportunidade não encontrada' });

        res.json({ message: 'Oportunidade removida' });
    } catch (error: any) {
        console.error('Error deleting opportunity:', error);
        res.status(500).json({ error: 'Erro ao remover oportunidade' });
    }
};
