import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const listOpportunities = async (req: Request, res: Response) => {
    try {
        const { type } = req.query;

        const where: any = {};
        if (type) where.type = type;

        const opportunities = await db.opportunity.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        isPublicProfile: true
                    }
                }
            }
        });

        const formatted = opportunities.map(o => ({
            ...o,
            userName: o.user.name,
            userIsPublic: o.user.isPublicProfile
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error listing opportunities:', error);
        res.status(500).json({ error: 'Erro ao listar oportunidades' });
    }
};

export const createOpportunity = async (req: Request, res: Response) => {
    try {
        const { title, description, type, userId } = req.body;

        if (!title || !description || !type || !userId) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const opportunity = await db.opportunity.create({
            data: {
                title,
                description,
                type,
                status: 'OPEN',
                userId
            }
        });

        res.status(201).json(opportunity);
    } catch (error) {
        console.error('Error creating opportunity:', error);
        res.status(500).json({ error: 'Erro ao criar oportunidade' });
    }
};

export const deleteOpportunity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.opportunity.delete({
            where: { id }
        });
        res.json({ message: 'Oportunidade removida' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Oportunidade não encontrada' });
        console.error('Error deleting opportunity:', error);
        res.status(500).json({ error: 'Erro ao remover oportunidade' });
    }
};
