import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

// Criar novo envio
export const create = (req: Request, res: Response) => {
    try {
        const shipmentData = req.body;
        const id = uuidv4();
        const userId = req.body.userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896'; // TODO: Auth

        const stmt = db.prepare(`
            INSERT INTO Shipment (
                id, userId, saleId,
                senderName, senderAddress, senderCity, senderState, senderCep, senderCpfCnpj,
                recipientName, recipientAddress, recipientCity, recipientState, recipientCep, recipientCpfCnpj,
                weight, height, width, length, declaredValue,
                carrier, price, deliveryTime,
                contentDescription, contentQuantity,
                trackingCode, status, labelGenerated, declarationGenerated,
                createdAt, updatedAt
            ) VALUES (
                ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?,
                ?, ?,
                ?, ?, ?, ?,
                datetime('now'), datetime('now')
            )
        `);

        stmt.run(
            id, userId, shipmentData.saleId || null,
            shipmentData.senderName, shipmentData.senderAddress, shipmentData.senderCity, shipmentData.senderState, shipmentData.senderCep, shipmentData.senderCpfCnpj || null,
            shipmentData.recipientName, shipmentData.recipientAddress, shipmentData.recipientCity, shipmentData.recipientState, shipmentData.recipientCep, shipmentData.recipientCpfCnpj || null,
            shipmentData.weight, shipmentData.height, shipmentData.width, shipmentData.length, shipmentData.declaredValue || null,
            shipmentData.carrier, shipmentData.price, shipmentData.deliveryTime,
            shipmentData.contentDescription, shipmentData.contentQuantity || 1,
            shipmentData.trackingCode || null, shipmentData.status || 'pending', 0, 0
        );

        res.status(201).json({ id, ...shipmentData });
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({ error: 'Failed to create shipment' });
    }
};

// Listar envios do usuário
export const list = (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string || '327aa8c1-7c26-41c2-95d7-b375c25eb896';

        const shipments = db.prepare(`
            SELECT * FROM Shipment 
            WHERE userId = ? 
            ORDER BY createdAt DESC
        `).all(userId);

        // Map sqlite 0/1 to boolean if needed, though frontend handles truthy usually. 
        // Prisma maps 0/1 to booleans automatically. Let's replicate strict boolean for crucial flags.
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
export const getById = (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const shipment = db.prepare('SELECT * FROM Shipment WHERE id = ?').get(id) as any;

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
export const update = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Dynamic Update Query
        const fields = Object.keys(data).filter(k => k !== 'id' && k !== 'createdAt');
        if (fields.length === 0) return res.json({ message: 'No fields to update' });

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = fields.map(f => data[f]);

        values.push(id); // For WHERE clause

        const stmt = db.prepare(`UPDATE Shipment SET ${setClause}, updatedAt = datetime('now') WHERE id = ?`);
        const result = stmt.run(...values);

        if (result.changes === 0) return res.status(404).json({ error: 'Shipment not found' });

        // --- Cascade Update Logic for Tracking Code ---
        if (data.trackingCode && data.trackingCode.length > 4) { // Basic validation
            try {
                // 1. Auto-update Shipment status to 'shipped' if not already
                db.prepare("UPDATE Shipment SET status = 'shipped' WHERE id = ?").run(id);

                // 2. Get Sale ID
                const shipmentStr = db.prepare('SELECT saleId FROM Shipment WHERE id = ?').get(id) as any;

                if (shipmentStr && shipmentStr.saleId) {
                    // 3. Update Sale Status
                    db.prepare("UPDATE Sale SET status = 'SHIPPED', updatedAt = datetime('now') WHERE id = ?").run(shipmentStr.saleId);

                    // 4. Update Product Status
                    const saleRow = db.prepare('SELECT productId FROM Sale WHERE id = ?').get(shipmentStr.saleId) as any;
                    if (saleRow && saleRow.productId) {
                        db.prepare("UPDATE Product SET status = 'Enviado' WHERE id = ?").run(saleRow.productId);
                    }
                    console.log('Cascade update successful for shipment:', id);
                }
            } catch (cascadeError) {
                console.error('Error in cascade update:', cascadeError);
                // Don't fail the request, just log
            }
        }
        // ----------------------------------------------

        res.json({ message: 'Shipment updated', ...data });
    } catch (error) {
        console.error('Error updating shipment:', error);
        res.status(500).json({ error: 'Failed to update shipment' });
    }
};

// Deletar envio
export const deleteShipment = (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const stmt = db.prepare('DELETE FROM Shipment WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) return res.status(404).json({ error: 'Shipment not found' });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting shipment:', error);
        res.status(500).json({ error: 'Failed to delete shipment' });
    }
};

// Marcar documento como gerado
export const markDocumentGenerated = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { documentType } = req.body; // 'label' | 'declaration' | 'both'

        let updateSql = '';
        if (documentType === 'label') {
            updateSql = 'labelGenerated = 1';
        } else if (documentType === 'declaration') {
            updateSql = 'declarationGenerated = 1';
        } else if (documentType === 'both') {
            updateSql = 'labelGenerated = 1, declarationGenerated = 1';
        } else {
            return res.status(400).json({ error: 'Invalid document type' });
        }

        const stmt = db.prepare(`UPDATE Shipment SET ${updateSql}, updatedAt = datetime('now') WHERE id = ?`);
        const result = stmt.run(id);

        if (result.changes === 0) return res.status(404).json({ error: 'Shipment not found' });

        res.json({ message: 'Document marked as generated' });
    } catch (error) {
        console.error('Error marking document:', error);
        res.status(500).json({ error: 'Failed to mark document' });
    }
};

// Validar e atualizar status do envio
export const updateShipmentStatus = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (status === 'shipped') {
            const shipment = db.prepare('SELECT * FROM Shipment WHERE id = ?').get(id) as any;

            if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

            if (!shipment.labelGenerated || !shipment.declarationGenerated) {
                return res.status(400).json({
                    error: 'Não é possível marcar como enviado sem gerar a Etiqueta e a Declaração de Conteúdo'
                });
            }
        }

        const stmt = db.prepare(`UPDATE Shipment SET status = ?, updatedAt = datetime('now') WHERE id = ?`);
        const result = stmt.run(status, id);

        if (result.changes === 0) return res.status(404).json({ error: 'Shipment not found' });

        res.json({ message: 'Status updated' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// Export delete as "delete"
export { deleteShipment as delete };
