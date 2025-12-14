import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

const MOCK_USER_ID = '327aa8c1-7c26-41c2-95d7-b375c25eb896';

export const listEarnings = (req: Request, res: Response) => {
    try {
        const userId = MOCK_USER_ID;
        // Join with Platform to get platform name
        const earnings = db.prepare(`
            SELECT ae.*, ap.name as platformName, ap.icon as platformIcon
            FROM AffiliateEarning ae
            JOIN AffiliatePlatform ap ON ae.platformId = ap.id
            WHERE ae.userId = ?
            ORDER BY ae.receiptDate ASC
        `).all(userId);
        res.json(earnings);
    } catch (error) {
        console.error('Failed to fetch earnings:', error);
        res.status(500).json({ error: 'Failed to fetch earnings' });
    }
};

export const createEarning = (req: Request, res: Response) => {
    try {
        const { platformId, amount, requestDate, description } = req.body;
        const userId = MOCK_USER_ID;
        const id = uuidv4();
        const now = new Date().toISOString();

        // 1. Get Platform details to calculate due date
        const platform: any = db.prepare('SELECT * FROM AffiliatePlatform WHERE id = ?').get(platformId);
        if (!platform) return res.status(404).json({ error: 'Platform not found' });

        // 2. Calculate Receipt Date
        const reqDate = new Date(requestDate);
        const receiptDate = new Date(reqDate);
        receiptDate.setDate(receiptDate.getDate() + platform.paymentTermDays);
        const receiptDateStr = receiptDate.toISOString();

        const createTx = db.transaction(() => {
            // 3. Create Earning Record
            db.prepare(`
                INSERT INTO AffiliateEarning (id, userId, platformId, amount, requestDate, receiptDate, status, description, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?)
            `).run(id, userId, platformId, amount, requestDate, receiptDateStr, description, now, now);

            // 4. Cascade: Create Financial Transaction (Future Transaction)
            const transactionId = uuidv4();
            db.prepare(`
                INSERT INTO FinancialTransaction (id, userId, type, amount, category, date, description, name, relatedId, relatedType, createdAt, updatedAt)
                VALUES (?, ?, 'INCOME', ?, 'Afiliação', ?, ?, ?, ?, 'AFFILIATE_EARNING', ?, ?)
            `).run(
                transactionId,
                userId,
                amount,
                receiptDateStr, // Use receipt date as the transaction date!
                `Comissão: ${platform.name}`,
                `Ganho: ${platform.name}`,
                id,
                now,
                now
            );
        });

        createTx();
        res.json({ message: 'Earning created successfully', receiptDate: receiptDateStr });
    } catch (error: any) {
        console.error('Failed to create earning:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteEarning = (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleteTx = db.transaction(() => {
            // 1. Delete Linked Transaction
            db.prepare('DELETE FROM FinancialTransaction WHERE relatedId = ? AND relatedType = ?')
                .run(id, 'AFFILIATE_EARNING');

            // 2. Delete Earning
            db.prepare('DELETE FROM AffiliateEarning WHERE id = ?').run(id);
        });

        deleteTx();
        res.json({ message: 'Earning deleted' });
    } catch (error: any) {
        console.error('Failed to delete earning:', error);
        res.status(500).json({ error: error.message });
    }
};
