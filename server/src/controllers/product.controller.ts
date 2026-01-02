import { Request, Response } from 'express';
import db from '../db';

export const listProducts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const products = await db.product.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, weight, height, width, length } = req.body;
    const userId = (req as any).user.id; // Get from auth

    try {
        const product = await db.product.create({
            data: {
                name,
                category,
                brand,
                model,
                marketValue,
                primaryColor,
                secondaryColor,
                shippingCost,
                condition,
                status: 'RECEIVED',
                userId: userId, // Force correct userId
                weight: weight || null,
                height: height || null,
                width: width || null,
                length: length || null
            }
        });
        res.status(201).json({ id: product.id, name: product.name, category: product.category, status: product.status });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto: ' + error.message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, status, weight, height, width, length } = req.body;
    const userId = (req as any).user.id;

    try {
        // Verify ownership
        const existing = await db.product.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Produto não encontrado' });
        if (existing.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });

        await db.product.update({
            where: { id },
            data: {
                name,
                category,
                brand,
                model,
                marketValue,
                primaryColor,
                secondaryColor,
                shippingCost,
                condition,
                status,
                weight: weight || null,
                height: height || null,
                width: width || null,
                length: length || null,
                updatedAt: new Date()
            }
        });
        res.json({ message: 'Produto atualizado' });
    } catch (error: any) {
        if (error.code === 'P2025') { // Record not found
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    try {
        // Verify ownership
        const existing = await db.product.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Produto não encontrado' });
        if (existing.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });

        // 1. Check for active shipments blocking deletion
        // We need to check if ANY sale of this product has a shipment with status SHIPPED/SENT
        const unsafeShipmentCount = await db.shipment.count({
            where: {
                sale: { productId: id },
                status: { in: ['SHIPPED', 'ENVIADO', 'SENT', 'shipped', 'enviado', 'sent'] }
            }
        });

        if (unsafeShipmentCount > 0) {
            return res.status(400).json({ error: 'Não é possível excluir este produto pois existem envios já realizados (status ENVIADO).' });
        }

        await db.product.delete({
            where: { id }
        });

        res.json({ message: 'Produto e registros associados deletados com sucesso.' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar produto: ' + error.message });
    }
};
