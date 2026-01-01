import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';



export const listRecurringExpenses = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string; // Auth required
        const expenses = await db.recurringExpense.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(expenses);
    } catch (error) {
        console.error('Failed to fetch recurring expenses:', error);
        res.status(500).json({ error: 'Failed to fetch recurring expenses' });
    }
};

export const createRecurringExpense = async (req: Request, res: Response) => {
    try {
        const { name, amount, frequency, category, nextDueDate } = req.body;
        const userId = req.body.userId; // Auth required
        const id = uuidv4();

        // Transaction to create expense + initial financial transaction
        const result = await db.$transaction(async (tx) => {
            // 1. Create Recurring Expense
            const expense = await tx.recurringExpense.create({
                data: {
                    id,
                    userId,
                    name,
                    amount: Number(amount),
                    frequency,
                    category,
                    active: 1, // 1=true
                    nextDueDate: nextDueDate ? new Date(nextDueDate) : null
                }
            });

            // 2. Cascade: Create Financial Transaction (Expense) automatically
            await tx.financialTransaction.create({
                data: {
                    userId,
                    type: 'EXPENSE',
                    amount: Number(amount),
                    category,
                    date: new Date(),
                    description: `Assinatura: ${name}`,
                    name: name,
                    relatedId: id,
                    relatedType: 'RECURRING_EXPENSE',
                    status: 'COMPLETED'
                }
            });

            return expense;
        });

        res.json({
            ...result,
            autoTransaction: true
        });
    } catch (error: any) {
        console.error('Failed to create recurring expense:', error);
        res.status(500).json({ error: `Failed to create recurring expense: ${error.message}` });
    }
};

export const toggleActive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { active } = req.body; // boolean from frontend

        const updated = await db.recurringExpense.update({
            where: { id },
            data: {
                active: active ? 1 : 0
            }
        });

        res.json({ message: 'Updated', active: updated.active });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Expense not found' });
        console.error('Failed to update recurring expense:', error);
        res.status(500).json({ error: `Failed to update recurring expense: ${error.message}` });
    }
};

export const deleteRecurringExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await db.$transaction(async (tx) => {
            // 1. Delete Linked Transaction
            await tx.financialTransaction.deleteMany({
                where: {
                    relatedId: id,
                    relatedType: 'RECURRING_EXPENSE'
                }
            });

            // 2. Delete Expense
            await tx.recurringExpense.delete({ where: { id } });
        });

        res.json({ message: 'Recurring expense deleted' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Expense not found' });
        console.error('Failed to delete recurring expense:', error);
        res.status(500).json({ error: `Failed to delete recurring expense: ${error.message}` });
    }
};
