import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

const MOCK_USER_ID = '327aa8c1-7c26-41c2-95d7-b375c25eb896';

export const listGoals = (req: Request, res: Response) => {
    try {
        const userId = MOCK_USER_ID;
        const goals = db.prepare('SELECT * FROM FinancialGoal WHERE userId = ? ORDER BY createdAt DESC').all(userId);
        res.json(goals);
    } catch (error) {
        console.error('Failed to fetch goals:', error);
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
};

export const createGoal = (req: Request, res: Response) => {
    try {
        const { name, targetAmount, deadline, color, icon } = req.body;
        const userId = MOCK_USER_ID;
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO FinancialGoal (id, userId, name, targetAmount, currentAmount, deadline, color, icon, status, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 0, ?, ?, ?, 'ACTIVE', ?, ?)
        `);

        stmt.run(id, userId, name, targetAmount, deadline || null, color, icon, now, now);

        res.json({
            id, userId, name, targetAmount, currentAmount: 0, deadline, color, icon, status: 'ACTIVE', createdAt: now, updatedAt: now
        });
    } catch (error: any) {
        console.error('Failed to create goal:', error);
        res.status(500).json({ error: `Failed to create goal: ${error.message}` });
    }
};

export const updateGoalAmount = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { amount } = req.body; // Can be positive (add) or negative (remove)
        const now = new Date().toISOString();

        const goal: any = db.prepare('SELECT * FROM FinancialGoal WHERE id = ?').get(id);
        if (!goal) return res.status(404).json({ error: 'Goal not found' });

        const newAmount = Number(goal.currentAmount) + Number(amount);
        const status = newAmount >= Number(goal.targetAmount) ? 'COMPLETED' : 'ACTIVE';

        const stmt = db.prepare(`
            UPDATE FinancialGoal 
            SET currentAmount = ?, status = ?, updatedAt = ? 
            WHERE id = ?
        `);

        stmt.run(newAmount, status, now, id);

        res.json({ ...goal, currentAmount: newAmount, status, updatedAt: now });
    } catch (error: any) {
        console.error('Failed to update goal:', error);
        res.status(500).json({ error: `Failed to update goal: ${error.message}` });
    }
};

export const addFundsWithTransaction = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { amount, createTransaction } = req.body;
        const now = new Date().toISOString();
        const userId = MOCK_USER_ID;

        const result = db.transaction(() => {
            // 1. Get Goal
            const goal: any = db.prepare('SELECT * FROM FinancialGoal WHERE id = ?').get(id);
            if (!goal) throw new Error('Goal not found');

            // 2. Update Goal Amount
            const newAmount = Number(goal.currentAmount) + Number(amount);
            const status = newAmount >= Number(goal.targetAmount) ? 'COMPLETED' : 'ACTIVE';

            db.prepare(`
                UPDATE FinancialGoal 
                SET currentAmount = ?, status = ?, updatedAt = ? 
                WHERE id = ?
            `).run(newAmount, status, now, id);

            // 3. Create Transaction if requested
            if (createTransaction) {
                const transactionId = uuidv4();
                db.prepare(`
                    INSERT INTO FinancialTransaction (id, userId, type, amount, category, date, description, name, relatedId, relatedType, createdAt, updatedAt)
                    VALUES (?, ?, 'EXPENSE', ?, 'Investimento/Meta', ?, ?, ?, ?, 'GOAL_FUNDING', ?, ?)
                `).run(transactionId, userId, amount, now, `Aporte na Meta: ${goal.name}`, `Aporte: ${goal.name}`, id, now, now);
            }

            return { ...goal, currentAmount: newAmount, status, updatedAt: now };
        })();

        res.json(result);
    } catch (error: any) {
        console.error('Failed to add funds:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteGoal = (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleteTransaction = db.transaction(() => {
            // 1. Delete Linked Transactions
            db.prepare('DELETE FROM FinancialTransaction WHERE relatedId = ? AND relatedType = ?')
                .run(id, 'GOAL_FUNDING');

            // 2. Delete Goal
            const result = db.prepare('DELETE FROM FinancialGoal WHERE id = ?').run(id);
            return result;
        });

        const result = deleteTransaction();

        if (result.changes === 0) return res.status(404).json({ error: 'Goal not found' });

        res.json({ message: 'Goal deleted' });
    } catch (error: any) {
        console.error('Failed to delete goal:', error);
        res.status(500).json({ error: `Failed to delete goal: ${error.message}` });
    }
};
