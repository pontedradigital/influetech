import { Request, Response } from 'express';
import db from '../db';

export const getAll = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // From auth

        const brands = await db.mediaKitBrand.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { name, logo, backgroundColor } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const brand = await db.mediaKitBrand.create({
            data: {
                userId,
                name,
                logo,
                backgroundColor: backgroundColor || '#ffffff'
            }
        });

        res.json(brand);
    } catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({ error: 'Failed to create brand' });
    }
};

export const deleteBrand = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        // Verify ownership
        const brand = await db.mediaKitBrand.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        if (brand.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await db.mediaKitBrand.delete({
            where: { id }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ error: 'Failed to delete brand' });
    }
};
