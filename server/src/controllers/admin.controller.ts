import { Request, Response } from 'express';
import db from '../db';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️  Missing Supabase Admin credentials in .env (SUPABASE_SERVICE_ROLE_KEY)");
}

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await db.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                plan: true,
                planCycle: true,
                active: true,
                paymentStatus: true,
                nextPaymentDate: true,
                lastPaymentDate: true,
                createdAt: true,
                companies: {
                    select: { name: true },
                    take: 1
                }
            }
        });
        res.json(users);
    } catch (error: any) {
        console.error('Error listing users:', error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
};

export const inviteUser = async (req: Request, res: Response) => {
    const { email, name, plan, planCycle } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: 'Email e Nome são obrigatórios' });
    }

    try {
        // 1. Check if exists in DB
        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Usuário já existe no banco de dados' });
        }

        // 2. Invite via Supabase Admin API
        const inviteUrl = `${SUPABASE_URL}/auth/v1/invite`;
        const response = await fetch(inviteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'apikey': SUPABASE_SERVICE_ROLE_KEY as string
            },
            body: JSON.stringify({
                email,
                data: { name } // Metadata
            })
        });

        const authData: any = await response.json();

        if (!response.ok) {
            console.error('Supabase Invite Error:', authData);
            throw new Error(authData.msg || authData.message || 'Erro ao convidar usuário no Supabase');
        }

        const userId = authData.id;

        // 3. Calculate Payment Dates
        let nextPaymentDate = null;
        let paymentStatus = 'ACTIVE';

        const now = new Date();
        if (planCycle === 'MONTHLY') {
            nextPaymentDate = new Date(now.setMonth(now.getMonth() + 1));
        } else if (planCycle === 'ANNUAL') {
            nextPaymentDate = new Date(now.setFullYear(now.getFullYear() + 1));
        } else if (planCycle === 'LIFETIME' || planCycle === 'FREE') {
            nextPaymentDate = null;
            paymentStatus = 'FREE';
        }

        // 4. Create in internal DB
        const newUser = await db.user.create({
            data: {
                id: userId,
                email,
                name,
                password: 'auth_managed',
                plan: plan || 'START',
                planCycle: planCycle || 'MONTHLY',
                active: 1,
                paymentStatus,
                nextPaymentDate: nextPaymentDate,
                isPublicProfile: 0 // Default
            }
        });

        res.json({ success: true, user: newUser });

    } catch (error: any) {
        console.error('Invite Error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, plan, planCycle, active, paymentStatus, nextPaymentDate } = req.body;

    try {
        const updated = await db.user.update({
            where: { id },
            data: {
                name,
                plan,
                planCycle,
                active: active !== undefined ? Number(active) : undefined,
                paymentStatus,
                nextPaymentDate: nextPaymentDate ? new Date(nextPaymentDate) : undefined
            }
        });
        res.json(updated);
    } catch (error: any) {
        console.error('Update User Error:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // 1. Delete from Supabase Auth
        const deleteUrl = `${SUPABASE_URL}/auth/v1/admin/users/${id}`;
        await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'apikey': SUPABASE_SERVICE_ROLE_KEY as string
            }
        });

        // 2. Delete from DB (Prisma - Relations might need cascade, but user should be deleteable)
        // Note: If user has posts/sales, database constraints might fail if not cascading. 
        // We'll assume DB handles cascade or we need to clean up.
        // For now, try simple delete.
        await db.user.delete({ where: { id } });

        res.json({ success: true });
    } catch (error: any) {
        console.error('Delete User Error:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
};

export const getPaymentStats = async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

        // Total ARR (simplified: sum of monthly equivalent)
        // Overdue count
        // Due this week

        const overdueCount = await db.user.count({
            where: {
                paymentStatus: 'OVERDUE',
                planCycle: { notIn: ['LIFETIME', 'FREE'] }
            }
        });

        const dueThisWeekCount = await db.user.count({
            where: {
                nextPaymentDate: {
                    gte: startOfWeek,
                    lte: endOfWeek
                },
                planCycle: { notIn: ['LIFETIME', 'FREE'] }
            }
        });

        // Basic MRR calc
        const allUsers = await db.user.findMany({
            where: {
                active: 1,
                planCycle: { notIn: ['LIFETIME', 'FREE'] }
            },
            select: { plan: true, planCycle: true }
        });

        let estimatedMRR = 0;
        allUsers.forEach(u => {
            const price = u.plan === 'CREATOR_PLUS' ? 49.90 : 29.90;
            if (u.planCycle === 'ANNUAL') {
                estimatedMRR += (price * 12 * 0.8) / 12; // 20% diff logic approx
            } else {
                estimatedMRR += price;
            }
        });

        res.json({
            overdue: overdueCount,
            dueThisWeek: dueThisWeekCount,
            mrr: estimatedMRR
        });

    } catch (error: any) {
        console.error('Stats Error:', error);
        res.status(500).json({ error: 'Erro ao calcular estatísticas' });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        // Fetch recent transactions (limit 10 for dashboard)
        // If FinancialTransaction model exists, use it. Otherwise, simulate from Users/Sales?
        // Checking Schema: values line 57: transactions FinancialTransaction[]
        // So it exists.

        const transactions = await db.financialTransaction.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        const formatted = transactions.map(tx => ({
            id: tx.id,
            user: tx.user?.name || tx.user?.email || 'Usuário Desconhecido',
            amount: Number(tx.amount),
            status: tx.status,
            date: tx.createdAt,
            description: tx.description || 'Transação'
        }));

        res.json(formatted);

    } catch (error: any) {
        console.error('Transactions Error:', error);
        // Fallback if table is empty or issues
        res.json([]);
    }
};
