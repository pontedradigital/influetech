import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const listCompanies = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const companies = await db.company.findMany({
            where: { userId },
            orderBy: { name: 'asc' }
        });
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar empresas' });
    }
};

export const createCompany = async (req: Request, res: Response) => {
    const { name, contactName, email, phone, country, website, contactMethod, contactValue, partnershipStatus, userId } = req.body;
    try {
        const company = await db.company.create({
            data: {
                name,
                contactName,
                email,
                phone,
                country,
                website,
                contactMethod,
                contactValue,
                partnershipStatus: partnershipStatus || 'Solicitada',
                status: 'ACTIVE',
                rating: 0,
                userId: (req as any).user.id // Force correct userId from auth
            }
        });
        res.status(201).json(company);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: `Erro ao criar empresa: ${error.message}` });
    }
};

export const updateCompany = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, contactName, email, phone, country, website, contactMethod, contactValue, partnershipStatus, status, rating } = req.body;
    try {
        const userId = (req as any).user.id;

        // Verify ownership
        const existing = await db.company.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Empresa não encontrada' });
        if (existing.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });

        // Prisma generic update leads to clean code
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (contactName !== undefined) updateData.contactName = contactName;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (country !== undefined) updateData.country = country;
        if (website !== undefined) updateData.website = website;
        if (contactMethod !== undefined) updateData.contactMethod = contactMethod;
        if (contactValue !== undefined) updateData.contactValue = contactValue;
        if (partnershipStatus !== undefined) updateData.partnershipStatus = partnershipStatus;
        if (status !== undefined) updateData.status = status;
        if (rating !== undefined) updateData.rating = rating;

        await db.company.update({
            where: { id },
            data: updateData
        });
        res.json({ message: 'Empresa atualizada' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Empresa não encontrada' });
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
};

export const deleteCompany = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const userId = (req as any).user.id;

        // Verify ownership
        const existing = await db.company.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Empresa não encontrada' });
        if (existing.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });

        await db.company.delete({
            where: { id }
        });
        res.json({ message: 'Empresa deletada' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Empresa não encontrada' });
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar empresa' });
    }
};
