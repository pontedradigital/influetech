
import { Request, Response } from 'express';
import db from '../db';



// Criar novo envio
export const create = async (req: Request, res: Response) => {
    try {
        const shipmentData = req.body;
        const userId = (req as any).user.id; // From Auth

        const shipment = await db.shipment.create({
            data: {
                userId,
                saleId: shipmentData.saleId || null,
                // Sender
                senderName: shipmentData.senderName,
                senderAddress: shipmentData.senderAddress,
                senderCity: shipmentData.senderCity,
                senderState: shipmentData.senderState,
                senderCep: shipmentData.senderCep,
                senderCpfCnpj: shipmentData.senderCpfCnpj || null,
                // Recipient
                recipientName: shipmentData.recipientName,
                recipientAddress: shipmentData.recipientAddress,
                recipientCity: shipmentData.recipientCity,
                recipientState: shipmentData.recipientState,
                recipientCep: shipmentData.recipientCep,
                recipientCpfCnpj: shipmentData.recipientCpfCnpj || null,
                // Package
                weight: Number(shipmentData.weight),
                height: Number(shipmentData.height),
                width: Number(shipmentData.width),
                length: Number(shipmentData.length),
                declaredValue: shipmentData.declaredValue ? Number(shipmentData.declaredValue) : null,
                // Carrier
                carrier: shipmentData.carrier,
                price: Number(shipmentData.price),
                deliveryTime: Number(shipmentData.deliveryTime),
                // Content
                contentDescription: shipmentData.contentDescription,
                contentQuantity: Number(shipmentData.contentQuantity || 1),
                // Metadata
                trackingCode: shipmentData.trackingCode || null,
                status: shipmentData.status || 'pending',
                labelGenerated: 0,
                declarationGenerated: 0
            }
        });

        res.status(201).json(shipment);
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({ error: 'Failed to create shipment' });
    }
};

// Listar envios do usuário
export const list = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const shipments = await db.shipment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        // Prisma automatically returns booleans for Int fields mapped IF schema is Boolean, 
        // BUT schema.prisma says: labelGenerated Int @default(0). 
        // So Prisma returns number 0 or 1.
        // We need to map to boolean for frontend compatibility manually if frontend expects strictly boolean.

        const formatted = shipments.map((s: any) => ({
            ...s,
            labelGenerated: !!s.labelGenerated,
            declarationGenerated: !!s.declarationGenerated
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error listing shipments:', error);
        res.status(500).json({ error: 'Failed to list shipments' });
    }
};

// Buscar envio por ID
export const getById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const shipment = await db.shipment.findUnique({ where: { id } });

        if (shipment && shipment.userId !== userId) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        res.json({
            ...shipment,
            labelGenerated: !!shipment.labelGenerated,
            declarationGenerated: !!shipment.declarationGenerated
        });
    } catch (error) {
        console.error('Error getting shipment:', error);
        res.status(500).json({ error: 'Failed to get shipment' });
    }
};

// Atualizar envio
export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        const data = req.body;

        // Verify ownership
        const existing = await db.shipment.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Shipment not found' });
        if (existing.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });

        // Removing special fields that shouldn't be updated directly blindly via body spread if unsafe,
        // but original code allowed typical update. We rely on frontend sending correct fields.

        // We must separate id and createdAt from data if they exist to avoid errors.
        const { id: _, createdAt, updatedAt, ...updateData } = data;

        // --- Cascade Update Logic for Tracking Code ---
        // If tracking code is updated and valid (>4 chars), we trigger status updates.
        // We use a transaction to ensure everything updates together.

        const triggerCascade = data.trackingCode && data.trackingCode.length > 4;

        await db.$transaction(async (tx: any) => {
            // 1. Update Shipment
            const updatedShipment = await tx.shipment.update({
                where: { id },
                data: {
                    ...updateData,
                    status: triggerCascade ? 'shipped' : updateData.status // Auto-update to shipped if tracking added
                }
            });

            if (triggerCascade && updatedShipment.saleId) {
                // 2. Update Sale Status
                await tx.sale.update({
                    where: { id: updatedShipment.saleId },
                    data: { status: 'SHIPPED' }
                });

                // 3. Update Product Status (Fetching Product via Sale relation would be cleaner but let's query Sale first or use relation update)
                // Prisma supports nested writes but we are doing separate updates logic wise.

                const sale = await tx.sale.findUnique({
                    where: { id: updatedShipment.saleId },
                    select: { productId: true }
                });

                if (sale && sale.productId) {
                    await tx.product.update({
                        where: { id: sale.productId },
                        data: { status: 'Enviado' }
                    });
                }
            }
        });

        res.json({ message: 'Shipment updated', ...data });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Shipment not found' });
        console.error('Error updating shipment:', error);
        res.status(500).json({ error: 'Failed to update shipment' });
    }
};

// Deletar envio
export const deleteShipment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        // Verify ownership
        const existing = await db.shipment.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Shipment not found' });
        if (existing.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });

        await db.shipment.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Shipment not found' });
        console.error('Error deleting shipment:', error);
        res.status(500).json({ error: 'Failed to delete shipment' });
    }
};

// Marcar documento como gerado
export const markDocumentGenerated = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        const { documentType } = req.body; // 'label' | 'declaration' | 'both'

        // Verify ownership
        const existing = await db.shipment.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Shipment not found' });
        if (existing.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });

        let updateData: any = {};
        if (documentType === 'label') {
            updateData.labelGenerated = 1;
        } else if (documentType === 'declaration') {
            updateData.declarationGenerated = 1;
        } else if (documentType === 'both') {
            updateData.labelGenerated = 1;
            updateData.declarationGenerated = 1;
        } else {
            return res.status(400).json({ error: 'Invalid document type' });
        }

        await db.shipment.update({
            where: { id },
            data: updateData
        });

        res.json({ message: 'Document marked as generated' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Shipment not found' });
        console.error('Error marking document:', error);
        res.status(500).json({ error: 'Failed to mark document' });
    }
};

// Validar e atualizar status do envio
export const updateShipmentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        const { status } = req.body;

        const shipment = await db.shipment.findUnique({ where: { id } });

        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
        if (shipment.userId !== userId) return res.status(403).json({ error: 'Acesso negado' });

        if (status === 'shipped') {

            if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

            if (!shipment.labelGenerated || !shipment.declarationGenerated) {
                return res.status(400).json({
                    error: 'Não é possível marcar como enviado sem gerar a Etiqueta e a Declaração de Conteúdo'
                });
            }
        }

        await db.shipment.update({
            where: { id },
            data: { status }
        });

        res.json({ message: 'Status updated' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Shipment not found' });
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};
// ... (existing exports)

// Export delete as "delete"
export { deleteShipment as delete };

// Calcular Frete (SuperFrete)
// Calcular Frete (SuperFrete)


