import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

const MOCK_USER_ID = '327aa8c1-7c26-41c2-95d7-b375c25eb896';

export const listPlatforms = (req: Request, res: Response) => {
    try {
        const userId = MOCK_USER_ID;
        const platforms = db.prepare('SELECT * FROM AffiliatePlatform WHERE userId = ? ORDER BY name ASC').all(userId);
        res.json(platforms);
    } catch (error) {
        console.error('Failed to fetch platforms:', error);
        res.status(500).json({ error: 'Failed to fetch platforms' });
    }
};

export const createPlatform = (req: Request, res: Response) => {
    try {
        const { name, paymentTermDays, icon } = req.body;
        const userId = MOCK_USER_ID;
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO AffiliatePlatform (id, userId, name, paymentTermDays, icon, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(id, userId, name, paymentTermDays || 30, icon || 'store', now, now);

        res.json({ id, userId, name, paymentTermDays: paymentTermDays || 30, icon, createdAt: now });
    } catch (error: any) {
        console.error('Failed to create platform:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deletePlatform = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Check for dependencies? Ideally yes, but for now simple delete
        const stmt = db.prepare('DELETE FROM AffiliatePlatform WHERE id = ?');
        stmt.run(id);
        res.json({ message: 'Platform deleted' });
    } catch (error: any) {
        console.error('Failed to delete platform:', error);
        res.status(500).json({ error: error.message });
    }
};
