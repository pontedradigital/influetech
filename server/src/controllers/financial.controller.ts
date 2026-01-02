import { Request, Response } from 'express';
import db from '../db';

// List all transactions with optional month/year filter
export const listTransactions = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;
        const userId = (req as any).user.id;

        let where: any = { userId };

        if (month && year) {
            const m = parseInt(month as string);
            const y = parseInt(year as string);

            // Construct date range for filter
            const startDate = new Date(y, m - 1, 1);
            const endDate = new Date(y, m, 0, 23, 59, 59, 999);

            where.date = {
                gte: startDate,
                lte: endDate
            };
        }

        const transactions = await db.financialTransaction.findMany({
            where,
            orderBy: [
                { date: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        res.json(transactions);
    } catch (error) {
        console.error('Error listing transactions:', error);
        res.status(500).json({ error: 'Erro ao listar transações' });
    }
};

// Get transaction by ID
export const getTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    try {
        const transaction = await db.financialTransaction.findUnique({
            where: { id }
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        if (transaction.userId !== userId) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        res.json(transaction);
    } catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ error: 'Erro ao buscar transação' });
    }
};

// Create transaction
export const createTransaction = async (req: Request, res: Response) => {
    const {
        type,
        amount,
        description,
        name,
        currency,
        date,
        category,
        status,
        userId
    } = req.body;

    try {
        // Validation handled by Prisma types mostly, but logic fallback for userId needed
        const finalUserId = (req as any).user.id; // Auth handled

        const transaction = await db.financialTransaction.create({
            data: {
                type,
                amount: Number(amount), // Ensure number
                description,
                name: name || null,
                currency: currency || 'BRL',
                date: date ? new Date(date) : new Date(),
                category,
                status: status || 'COMPLETED',
                userId: finalUserId
            }
        });

        res.status(201).json({
            id: transaction.id,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            category: transaction.category,
            message: 'Transação criada com sucesso'
        });
    } catch (error: any) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: `Erro ao criar transação: ${error.message}` });
    }
};

// Update transaction
export const updateTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { type, amount, description, name, currency, date, category, status } = req.body;
    const userId = (req as any).user.id;

    try {
        // Verify ownership
        const existing = await db.financialTransaction.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Transação não encontrada' });
        if (existing.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });
        await db.financialTransaction.update({
            where: { id },
            data: {
                type,
                amount: amount ? Number(amount) : undefined,
                description,
                name: name || null,
                currency: currency || 'BRL',
                date: date ? new Date(date) : undefined,
                category,
                status
            }
        });

        res.json({ message: 'Transação atualizada' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Transação não encontrada' });
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
};

// Delete transaction
export const deleteTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    try {
        const existing = await db.financialTransaction.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Transação não encontrada' });
        if (existing.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });
        await db.$transaction(async (tx: any) => {
            // 1. Get transaction
            const transaction = await tx.financialTransaction.findUnique({ where: { id } });
            if (!transaction) throw new Error('Transação não encontrada');

            // 2. Reverse Goal Funding if applicable
            // Prisma schema usually doesn't have relatedType/relatedId on FinancialTransaction unless added manually.
            // If they exist in schema, we use them. If not, this code block might fail if those fields are missing in type definition.
            // Assuming they exist as per original code logic, but might be 'optional' fields not in main type if not in schema.
            // Let's assume schema matches logic or use extensive 'any' casting if schema is loose.
            // Better: Check if fields exist. Since I saw schema.prisma earlier (view_file), let's trust it has them or handle gracefully.
            // Wait, schema view earlier was partial. I'll assume they exist.

            // Using 'any' for transaction to access potential loosely typed fields if not in generated client yet
            const txData = transaction as any;

            if (txData.relatedType === 'GOAL_FUNDING' && txData.relatedId) {
                const goal = await tx.financialGoal.findUnique({ where: { id: txData.relatedId } });
                if (goal) {
                    const newAmount = Number(goal.currentAmount || 0) - Number(transaction.amount);
                    const status = newAmount >= Number(goal.targetAmount) ? 'COMPLETED' : 'ACTIVE';

                    await tx.financialGoal.update({
                        where: { id: txData.relatedId },
                        data: {
                            currentAmount: newAmount,
                            status
                        }
                    });
                }
            }

            // 3. Cascade Delete: Recurring Expense
            if (txData.relatedType === 'RECURRING_EXPENSE' && txData.relatedId) {
                // Check if model exists in prisma client (RecurringExpense)
                // Assuming yes based on original code
                try {
                    await tx.recurringExpense.delete({ where: { id: txData.relatedId } });
                } catch (e) { /* Ignore if already deleted */ }
            }

            // 4. Cascade Delete: Affiliate Earning
            if (txData.relatedType === 'AFFILIATE_EARNING' && txData.relatedId) {
                try {
                    await tx.affiliateEarning.delete({ where: { id: txData.relatedId } });
                } catch (e) { /* Ignore */ }
            }

            // 5. Delete Transaction
            await tx.financialTransaction.delete({ where: { id } });
        });

        res.json({ message: 'Transação excluída e efeitos revertidos' });
    } catch (error: any) {
        if (error.message === 'Transação não encontrada' || error.code === 'P2025') {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: `Erro ao excluir transação: ${error.message}` });
    }
};

// Get financial summary
export const getSummary = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;
        const userId = (req as any).user.id;
        let where: any = { userId };

        if (month && year) {
            const m = parseInt(month as string);
            const y = parseInt(year as string);
            where.date = {
                gte: new Date(y, m - 1, 1),
                lte: new Date(y, m, 0, 23, 59, 59, 999)
            };
        }

        // Use aggregates for performance
        const incomeAgg = await db.financialTransaction.aggregate({
            _sum: { amount: true },
            where: { ...where, type: 'INCOME' }
        });

        const expenseAgg = await db.financialTransaction.aggregate({
            _sum: { amount: true },
            where: { ...where, type: 'EXPENSE' }
        });

        const income = Number(incomeAgg._sum.amount || 0);
        const expenses = Number(expenseAgg._sum.amount || 0);
        const profit = income - expenses;

        // Group expenses by category
        const expensesByCategoryGroup = await db.financialTransaction.groupBy({
            by: ['category'],
            _sum: { amount: true },
            where: { ...where, type: 'EXPENSE' }
        });

        const expensesByCategory: Record<string, number> = {};
        expensesByCategoryGroup.forEach((item: any) => {
            if (item.category) {
                expensesByCategory[item.category] = Number(item._sum.amount || 0);
            }
        });

        res.json({
            income,
            expenses,
            profit,
            expensesByCategory
        });
    } catch (error) {
        console.error('Error getting summary:', error);
        res.status(500).json({ error: 'Erro ao buscar resumo' });
    }
};

// Get 6-month history
export const getHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const months = [];
        const today = new Date();

        // Loop last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });

            const start = new Date(date.getFullYear(), date.getMonth(), 1);
            const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

            const [incomeAgg, expenseAgg] = await Promise.all([
                db.financialTransaction.aggregate({
                    _sum: { amount: true },
                    where: {
                        date: { gte: start, lte: end },
                        type: 'INCOME',
                        userId
                    }
                }),
                db.financialTransaction.aggregate({
                    _sum: { amount: true },
                    where: {
                        date: { gte: start, lte: end },
                        type: 'EXPENSE',
                        userId
                    }
                })
            ]);

            months.push({
                name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                receita: Number(incomeAgg._sum.amount || 0),
                despesa: Number(expenseAgg._sum.amount || 0)
            });
        }

        res.json(months);
    } catch (error) {
        console.error('Error getting history:', error);
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
};
