import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

// List all transactions with optional month/year filter
export const listTransactions = (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;

        let query = `
      SELECT * FROM FinancialTransaction
      ORDER BY date DESC, createdAt DESC
    `;

        let transactions = db.prepare(query).all();

        // Apply month/year filter if provided
        if (month && year) {
            transactions = transactions.filter((t: any) => {
                const date = new Date(t.date);
                return date.getMonth() + 1 === parseInt(month as string) &&
                    date.getFullYear() === parseInt(year as string);
            });
        }

        res.json(transactions);
    } catch (error) {
        console.error('Error listing transactions:', error);
        res.status(500).json({ error: 'Erro ao listar transações' });
    }
};

// Get transaction by ID
export const getTransaction = (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const transaction = db.prepare('SELECT * FROM FinancialTransaction WHERE id = ?').get(id);

        if (!transaction) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }

        res.json(transaction);
    } catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ error: 'Erro ao buscar transação' });
    }
};

// Create transaction
export const createTransaction = (req: Request, res: Response) => {
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
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
      INSERT INTO FinancialTransaction (
        id, type, amount, description, name, currency, date, category, status, userId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

        stmt.run(
            id,
            type,
            amount,
            description,
            name || null,
            currency || 'BRL',
            date || now,
            category,
            status || 'COMPLETED',
            userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896')
        );

        res.status(201).json({
            id,
            type,
            amount,
            description,
            category,
            message: 'Transação criada com sucesso'
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Erro ao criar transação' });
    }
};

// Update transaction
export const updateTransaction = (req: Request, res: Response) => {
    const { id } = req.params;
    const { type, amount, description, name, currency, date, category, status } = req.body;

    try {
        const stmt = db.prepare(`
      UPDATE FinancialTransaction 
      SET type = ?, amount = ?, description = ?, name = ?, currency = ?, date = ?, category = ?, status = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);

        const result = stmt.run(type, amount, description, name || null, currency || 'BRL', date, category, status, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }

        res.json({ message: 'Transação atualizada' });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
};

// Delete transaction
export const deleteTransaction = (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare('DELETE FROM FinancialTransaction WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }

        res.json({ message: 'Transação excluída' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Erro ao excluir transação' });
    }
};

// Get financial summary
export const getSummary = (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;

        let transactions: any[] = db.prepare('SELECT * FROM FinancialTransaction').all();

        // Filter by month/year if provided
        if (month && year) {
            transactions = transactions.filter((t: any) => {
                const date = new Date(t.date);
                return date.getMonth() + 1 === parseInt(month as string) &&
                    date.getFullYear() === parseInt(year as string);
            });
        }

        const income = transactions
            .filter((t: any) => t.type === 'INCOME')
            .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

        const expenses = transactions
            .filter((t: any) => t.type === 'EXPENSE')
            .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

        const profit = income - expenses;

        // Group expenses by category
        const expensesByCategory: { [key: string]: number } = {};
        transactions
            .filter((t: any) => t.type === 'EXPENSE')
            .forEach((t: any) => {
                if (!expensesByCategory[t.category]) {
                    expensesByCategory[t.category] = 0;
                }
                expensesByCategory[t.category] += parseFloat(t.amount);
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
export const getHistory = (req: Request, res: Response) => {
    try {
        const transactions: any[] = db.prepare('SELECT * FROM FinancialTransaction').all();

        // Get last 6 months
        const months = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const monthTransactions = transactions.filter((t: any) => {
                const tDate = new Date(t.date);
                return tDate.getMonth() + 1 === month && tDate.getFullYear() === year;
            });

            const income = monthTransactions
                .filter((t: any) => t.type === 'INCOME')
                .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

            const expenses = monthTransactions
                .filter((t: any) => t.type === 'EXPENSE')
                .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

            months.push({
                name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                receita: income,
                despesa: expenses
            });
        }

        res.json(months);
    } catch (error) {
        console.error('Error getting history:', error);
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
};
