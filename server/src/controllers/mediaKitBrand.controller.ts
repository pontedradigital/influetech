import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

// Auto-migration hack to ensure column exists
try {
    const columns = db.prepare('PRAGMA table_info(MediaKitBrand)').all();
    const hasBgColor = columns.some((col: any) => col.name === 'backgroundColor');
    if (!hasBgColor) {
        db.prepare('ALTER TABLE MediaKitBrand ADD COLUMN backgroundColor TEXT DEFAULT "#ffffff"').run();
        console.log('Added backgroundColor column to MediaKitBrand');
    }
} catch (e: any) {
    console.error('Migration error:', e);
}

export const getAll = (req: Request, res: Response) => {
    try {
        const userId = req.headers['user-id'] as string; // Simple auth for now

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const stmt = db.prepare('SELECT * FROM MediaKitBrand WHERE userId = ? ORDER BY createdAt DESC');
        const brands = stmt.all(userId);

        res.json(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
};

export const create = (req: Request, res: Response) => {
    try {
        const userId = req.headers['user-id'] as string;
        const { name, logo, backgroundColor } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO MediaKitBrand (id, userId, name, logo, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
        `);

        stmt.run(id, userId, name, logo);

        // Fetch back to return
        const newBrand = db.prepare('SELECT * FROM MediaKitBrand WHERE id = ?').get(id);

        res.json(newBrand);
    } catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({ error: 'Failed to create brand' });
    }
};

export const deleteBrand = (req: Request, res: Response) => {
    try {
        const userId = req.headers['user-id'] as string;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Verify ownership and delete in one go if possible, or select first
        const checkStmt = db.prepare('SELECT userId FROM MediaKitBrand WHERE id = ?');
        const brand = checkStmt.get(id) as { userId: string } | undefined;

        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        if (brand.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const deleteStmt = db.prepare('DELETE FROM MediaKitBrand WHERE id = ?');
        deleteStmt.run(id);

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ error: 'Failed to delete brand' });
    }
};
