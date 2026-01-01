import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';



export const listEarnings = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string; // Auth required
        // Join with Platform using Prisma include
        const earnings = await db.affiliateEarning.findMany({
            where: { userId },
            include: {
                platform: {
                    select: { name: true, icon: true }
                }
            },
            orderBy: { receiptDate: 'asc' }
        });

        // Map to flat structure as expected by frontend
        const mappedEarnings = earnings.map(e => ({
            ...e,
            platformName: e.platform.name,
            platformIcon: e.platform.icon
        }));

        res.json(mappedEarnings);
    } catch (error) {
        console.error('Failed to fetch earnings:', error);
        res.status(500).json({ error: 'Failed to fetch earnings' });
    }
};

export const createEarning = async (req: Request, res: Response) => {
    try {
        const { platformId, amount, requestDate, description } = req.body;
        const userId = req.body.userId; // Auth required
        const earningId = uuidv4(); // Manual ID generation

        // 1. Get Platform details to calculate due date
        const platform = await db.affiliatePlatform.findUnique({ where: { id: platformId } });
        if (!platform) return res.status(404).json({ error: 'Platform not found' });

        // 2. Calculate Receipt Date
        const reqDate = new Date(requestDate);
        const receiptDate = new Date(reqDate);
        receiptDate.setDate(receiptDate.getDate() + platform.paymentTermDays);

        await db.$transaction(async (tx) => {
            // 3. Create Earning Record
            const earning = await tx.affiliateEarning.create({
                data: {
                    id: earningId,
                    userId,
                    platformId,
                    amount: Number(amount),
                    requestDate: reqDate,
                    receiptDate: receiptDate,
                    status: 'PENDING',
                    description
                }
            });

            // 4. Cascade: Create Financial Transaction (Future Transaction)
            await tx.financialTransaction.create({
                data: {
                    userId,
                    type: 'INCOME',
                    amount: Number(amount),
                    category: 'Afiliação',
                    date: receiptDate,
                    description: `Comissão: ${platform.name}`,
                    name: `Ganho: ${platform.name}`,
                    relatedId: earningId,
                    relatedType: 'AFFILIATE_EARNING',
                    status: 'PENDING'
                }
            });
        });

        res.json({ message: 'Earning created successfully', receiptDate: receiptDate.toISOString() });
    } catch (error: any) {
        console.error('Failed to create earning:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteEarning = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await db.$transaction(async (tx) => {
            // 1. Delete Linked Transaction
            await tx.financialTransaction.deleteMany({
                where: {
                    relatedId: id,
                    relatedType: 'AFFILIATE_EARNING'
                }
            });

            // 2. Delete Earning
            await tx.affiliateEarning.delete({ where: { id } });
        });

        res.json({ message: 'Earning deleted' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Earning not found' });
        console.error('Failed to delete earning:', error);
        res.status(500).json({ error: error.message });
    }
};
