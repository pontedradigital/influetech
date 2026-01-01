import { Request, Response } from 'express';
import db from '../db';

export const listProducts = async (req: Request, res: Response) => {
    try {
        const products = await db.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, userId, weight, height, width, length } = req.body;
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
                userId: userId,
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
    try {
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
    try {
        // 1. Check for active shipments blocking deletion
        // We need to check if ANY sale of this product has a shipment with status SHIPPED/SENT
        const activeShipmentsCount = await db.shipment.count({
            where: {
                sale: {
                    productId: id
                },
                status: {
                    in: ['SHIPPED', 'ENVIADO', 'SENT'],
                    // Case insensitive check is harder in basic prisma without raw, but typically status is normalized.
                    // If we strictly follow the values stored. Let's assume standard values.
                }
            }
        });

        // Prisma doesn't support case-insensitive IN easily (Postgres does ILIKE but for single values).
        // Since we are migrating to Postgres, 'in' is case sensitive.
        // However, usually status is lowercase 'shipped' or uppercase 'SHIPPED'.
        // Let's do a raw query for safety OR assume consistent data if possible?
        // Better safest for migration: check without casing issue or fetch and filter?
        // Let's stick to the common status values found in database or code.
        // The original code checked upper(s.status) IN ...

        // Let's try raw query for this check to be 100% equivalent to original robustness
        // OR refine the prisma query to include lowercase variants.

        /*
        const checkResult = await db.$queryRaw`
            SELECT count(*) as count
            FROM "Shipment" s
            JOIN "Sale" sa ON s."saleId" = sa.id
            WHERE sa."productId" = ${id} AND UPPER(s.status) IN ('SHIPPED', 'ENVIADO', 'SENT')
        `;
        */

        // Actually, let's stick to Prisma clean way first. If status is normalized (e.g. 'shipped' in schema default is 'pending'), 
        // usually we use 'shipped'. The original code checked 'SHIPPED', 'ENVIADO', 'SENT'.
        // I will include lowercase versions too.

        const unsafeShipmentCount = await db.shipment.count({
            where: {
                sale: { productId: id },
                status: { in: ['SHIPPED', 'ENVIADO', 'SENT', 'shipped', 'enviado', 'sent'] }
            }
        });

        if (unsafeShipmentCount > 0) {
            return res.status(400).json({ error: 'Não é possível excluir este produto pois existem envios já realizados (status ENVIADO).' });
        }

        // 2. Delete Product (Cascade will handle Sales and Shipments)
        // Note: ScheduledPost has relation to Product. Schema says:
        // productId String?
        // product Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
        // So SetNull is automatic.

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
