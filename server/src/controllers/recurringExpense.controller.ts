import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

const MOCK_USER_ID = '327aa8c1-7c26-41c2-95d7-b375c25eb896';

export const listRecurringExpenses = (req: Request, res: Response) => {
    try {
        const userId = MOCK_USER_ID;
        const expenses = db.prepare('SELECT * FROM RecurringExpense WHERE userId = ? ORDER BY createdAt DESC').all(userId);
        res.json(expenses);
    } catch (error) {
        console.error('Failed to fetch recurring expenses:', error);
        res.status(500).json({ error: 'Failed to fetch recurring expenses' });
    }
};

export const createRecurringExpense = (req: Request, res: Response) => {
    try {
        const { name, amount, frequency, category, nextDueDate } = req.body;
        const userId = MOCK_USER_ID;
        const id = uuidv4();
        const transactionId = uuidv4();
        const now = new Date().toISOString();

        // 1. Create Recurring Expense
        const stmt = db.prepare(`
            INSERT INTO RecurringExpense (id, userId, name, amount, frequency, category, active, nextDueDate, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
        `);

        stmt.run(id, userId, name, amount, frequency, category, nextDueDate || null, now, now);

        // 2. Cascade: Create Financial Transaction (Expense) automatically
        // This ensures it appears in the dashboard immediately
        const stmtTransaction = db.prepare(`
            INSERT INTO FinancialTransaction (id, userId, type, amount, category, date, description, name, relatedId, relatedType, createdAt, updatedAt)
            VALUES (?, ?, 'EXPENSE', ?, ?, ?, ?, ?, ?, 'RECURRING_EXPENSE', ?, ?)
        `);

        stmtTransaction.run(transactionId, userId, amount, category, now, `Assinatura: ${name}`, name, id, now, now);

        res.json({
            id, userId, name, amount, frequency, category, active: 1, nextDueDate, createdAt: now, updatedAt: now,
            autoTransaction: true
        });
    } catch (error: any) {
        console.error('Failed to create recurring expense:', error);
        res.status(500).json({ error: `Failed to create recurring expense: ${error.message}` });
    }
};

export const toggleActive = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { active } = req.body;
        const now = new Date().toISOString();

        const stmt = db.prepare('UPDATE RecurringExpense SET active = ?, updatedAt = ? WHERE id = ?');
        const result = stmt.run(active ? 1 : 0, now, id);

        if (result.changes === 0) return res.status(404).json({ error: 'Expense not found' });

        res.json({ message: 'Updated', active: active ? 1 : 0 });
    } catch (error: any) {
        console.error('Failed to update recurring expense:', error);
        res.status(500).json({ error: `Failed to update recurring expense: ${error.message}` });
    }
};

export const deleteRecurringExpense = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = MOCK_USER_ID;

        const deleteTransaction = db.transaction(() => {
            // 1. Delete Linked Transaction
            db.prepare('DELETE FROM FinancialTransaction WHERE relatedId = ? AND relatedType = ?')
                .run(id, 'RECURRING_EXPENSE');

            // 2. Delete Expense
            const result = db.prepare('DELETE FROM RecurringExpense WHERE id = ?')
                .run(id);

            return result;
        });

        const result = deleteTransaction();

        if (result.changes === 0) return res.status(404).json({ error: 'Expense not found' });

        res.json({ message: 'Recurring expense deleted' });
    } catch (error: any) {
        console.error('Failed to delete recurring expense:', error);
        res.status(500).json({ error: `Failed to delete recurring expense: ${error.message}` });
    }
};
