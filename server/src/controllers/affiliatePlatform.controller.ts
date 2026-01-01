import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

const MOCK_USER_ID = '327aa8c1-7c26-41c2-95d7-b375c25eb896';

export const listPlatforms = async (req: Request, res: Response) => {
    try {
        const userId = MOCK_USER_ID;
        const platforms = await db.affiliatePlatform.findMany({
            where: { userId },
            orderBy: { name: 'asc' }
        });
        res.json(platforms);
    } catch (error) {
        console.error('Failed to fetch platforms:', error);
        res.status(500).json({ error: 'Failed to fetch platforms' });
    }
};

export const createPlatform = async (req: Request, res: Response) => {
    try {
        const { name, paymentTermDays, icon } = req.body;
        const userId = MOCK_USER_ID;

        const platform = await db.affiliatePlatform.create({
            data: {
                id: uuidv4(),
                userId,
                name,
                paymentTermDays: paymentTermDays || 30,
                icon: icon || 'store'
            }
        });

        res.json(platform);
    } catch (error: any) {
        console.error('Failed to create platform:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deletePlatform = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.affiliatePlatform.delete({
            where: { id }
        });
        res.json({ message: 'Platform deleted' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Platform not found' });
        console.error('Failed to delete platform:', error);
        res.status(500).json({ error: error.message });
    }
};
