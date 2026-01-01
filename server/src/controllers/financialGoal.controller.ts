import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';



export const listGoals = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string; // Auth required
        const goals = await db.financialGoal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(goals);
    } catch (error) {
        console.error('Failed to fetch goals:', error);
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
};

export const createGoal = async (req: Request, res: Response) => {
    try {
        const { name, targetAmount, deadline, color, icon } = req.body;
        const userId = req.body.userId; // Auth required

        const goal = await db.financialGoal.create({
            data: {
                userId,
                name,
                targetAmount,
                currentAmount: 0,
                deadline: deadline ? new Date(deadline) : null,
                color,
                icon,
                status: 'ACTIVE'
            }
        });

        res.json(goal);
    } catch (error: any) {
        console.error('Failed to create goal:', error);
        res.status(500).json({ error: `Failed to create goal: ${error.message}` });
    }
};

export const updateGoalAmount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { amount } = req.body; // Can be positive (add) or negative (remove)

        const goal = await db.financialGoal.findUnique({ where: { id } });
        if (!goal) return res.status(404).json({ error: 'Goal not found' });

        const newAmount = Number(goal.currentAmount) + Number(amount);
        const status = newAmount >= Number(goal.targetAmount) ? 'COMPLETED' : 'ACTIVE';

        const updatedGoal = await db.financialGoal.update({
            where: { id },
            data: {
                currentAmount: newAmount,
                status
            }
        });

        res.json(updatedGoal);
    } catch (error: any) {
        console.error('Failed to update goal:', error);
        res.status(500).json({ error: `Failed to update goal: ${error.message}` });
    }
};

export const addFundsWithTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { amount, createTransaction } = req.body;
        const userId = req.body.userId; // Auth required

        const result = await db.$transaction(async (tx) => {
            // 1. Get Goal
            const goal = await tx.financialGoal.findUnique({ where: { id } });
            if (!goal) throw new Error('Goal not found');

            // 2. Update Goal Amount
            const newAmount = Number(goal.currentAmount) + Number(amount);
            const status = newAmount >= Number(goal.targetAmount) ? 'COMPLETED' : 'ACTIVE';

            const updatedGoal = await tx.financialGoal.update({
                where: { id },
                data: {
                    currentAmount: newAmount,
                    status
                }
            });

            // 3. Create Transaction if requested
            if (createTransaction) {
                await tx.financialTransaction.create({
                    data: {
                        userId,
                        type: 'EXPENSE',
                        amount: Number(amount),
                        category: 'Investimento/Meta',
                        date: new Date(),
                        description: `Aporte na Meta: ${goal.name}`,
                        name: `Aporte: ${goal.name}`,
                        relatedId: id,
                        relatedType: 'GOAL_FUNDING',
                        status: 'COMPLETED'
                    }
                });
            }

            return updatedGoal;
        });

        res.json(result);
    } catch (error: any) {
        if (error.message === 'Goal not found') return res.status(404).json({ error: 'Goal not found' });
        console.error('Failed to add funds:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteGoal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await db.$transaction(async (tx) => {
            // 1. Delete Linked Transactions
            await tx.financialTransaction.deleteMany({
                where: {
                    relatedId: id,
                    relatedType: 'GOAL_FUNDING'
                }
            });

            // 2. Delete Goal
            await tx.financialGoal.delete({ where: { id } });
        });

        res.json({ message: 'Goal deleted' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Goal not found' });
        console.error('Failed to delete goal:', error);
        res.status(500).json({ error: `Failed to delete goal: ${error.message}` });
    }
};
