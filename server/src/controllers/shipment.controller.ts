import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar novo envio
export const create = async (req: Request, res: Response) => {
    try {
        const shipmentData = req.body;

        const shipment = await prisma.shipment.create({
            data: {
                ...shipmentData,
                userId: req.body.userId || 'default-user-id', // TODO: Get from auth token
            },
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
        // TODO: Get from auth token - usando o mesmo userId do sistema
        const userId = req.query.userId as string || '327aa8c1-7c26-41c2-95d7-b375c25eb896';

        const shipments = await prisma.shipment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        res.json(shipments);
    } catch (error) {
        console.error('Error listing shipments:', error);
        res.status(500).json({ error: 'Failed to list shipments' });
    }
};

// Buscar envio por ID
export const getById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const shipment = await prisma.shipment.findUnique({
            where: { id },
        });

        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        res.json(shipment);
    } catch (error) {
        console.error('Error getting shipment:', error);
        res.status(500).json({ error: 'Failed to get shipment' });
    }
};

// Atualizar envio
export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const shipment = await prisma.shipment.update({
            where: { id },
            data: updateData,
        });

        res.json(shipment);
    } catch (error) {
        console.error('Error updating shipment:', error);
        res.status(500).json({ error: 'Failed to update shipment' });
    }
};

// Deletar envio
export const deleteShipment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.shipment.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting shipment:', error);
        res.status(500).json({ error: 'Failed to delete shipment' });
    }
};

// Marcar documento como gerado
export const markDocumentGenerated = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { documentType } = req.body; // 'label' ou 'declaration' ou 'both'

        let updateData: any = {};

        if (documentType === 'label') {
            updateData.labelGenerated = true;
        } else if (documentType === 'declaration') {
            updateData.declarationGenerated = true;
        } else if (documentType === 'both') {
            updateData.labelGenerated = true;
            updateData.declarationGenerated = true;
        } else {
            return res.status(400).json({ error: 'Invalid document type. Use "label", "declaration", or "both"' });
        }

        const shipment = await prisma.shipment.update({
            where: { id },
            data: updateData,
        });

        res.json(shipment);
    } catch (error) {
        console.error('Error marking document as generated:', error);
        res.status(500).json({ error: 'Failed to mark document as generated' });
    }
};

// Validar e atualizar status do envio
export const updateShipmentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Se tentando marcar como shipped, validar documentos
        if (status === 'shipped') {
            const shipment = await prisma.shipment.findUnique({
                where: { id },
            });

            if (!shipment) {
                return res.status(404).json({ error: 'Shipment not found' });
            }

            // Validar se documentos foram gerados
            if (!shipment.labelGenerated || !shipment.declarationGenerated) {
                return res.status(400).json({
                    error: 'Não é possível marcar como enviado sem gerar a Etiqueta e a Declaração de Conteúdo',
                    missingDocuments: {
                        label: !shipment.labelGenerated,
                        declaration: !shipment.declarationGenerated
                    }
                });
            }

            // Validar dados obrigatórios
            if (!shipment.recipientName || !shipment.recipientCep || !shipment.recipientAddress) {
                return res.status(400).json({
                    error: 'Dados do destinatário incompletos',
                    missingFields: {
                        name: !shipment.recipientName,
                        cep: !shipment.recipientCep,
                        address: !shipment.recipientAddress
                    }
                });
            }
        }

        // Atualizar status
        const updatedShipment = await prisma.shipment.update({
            where: { id },
            data: { status },
        });

        res.json(updatedShipment);
    } catch (error) {
        console.error('Error updating shipment status:', error);
        res.status(500).json({ error: 'Failed to update shipment status' });
    }
};

// Export delete with different name to avoid reserved keyword
export { deleteShipment as delete };
