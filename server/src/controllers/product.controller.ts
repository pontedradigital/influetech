import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const listProducts = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare('SELECT * FROM Product ORDER BY createdAt DESC');
        const products = stmt.all();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
};

export const createProduct = (req: Request, res: Response) => {
    const { name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, userId, weight, height, width, length } = req.body;
    try {
        const id = uuidv4();
        const stmt = db.prepare(`
      INSERT INTO Product (id, name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, status, userId, weight, height, width, length, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'RECEIVED', ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
        stmt.run(
            id, name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition,
            userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896'),
            weight || null, height || null, width || null, length || null
        );
        res.status(201).json({ id, name, category, status: 'RECEIVED' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};

export const updateProduct = (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, status, weight, height, width, length } = req.body;
    try {
        const stmt = db.prepare(`
      UPDATE Product 
      SET name = ?, category = ?, brand = ?, model = ?, marketValue = ?, primaryColor = ?, secondaryColor = ?, shippingCost = ?, condition = ?, status = ?, weight = ?, height = ?, width = ?, length = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);
        const result = stmt.run(name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, status, weight || null, height || null, width || null, length || null, id);
        if (result.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json({ message: 'Produto atualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
};

export const deleteProduct = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // 1. Check for active shipments blocking deletion
        const checkStmt = db.prepare(`
            SELECT count(*) as count
            FROM Shipment s
            JOIN Sale sa ON s.saleId = sa.id
            WHERE sa.productId = ? AND upper(s.status) IN ('SHIPPED', 'ENVIADO', 'SENT')
        `);
        const checkResult = checkStmt.get(id) as { count: number };

        if (checkResult && checkResult.count > 0) {
            return res.status(400).json({ error: 'Não é possível excluir este produto pois existem envios já realizados (status ENVIADO).' });
        }

        // 2. Perform Manual Cascade Deletion (Database transaction ideally, but sequential here)
        // Delete Shipments first (to avoid FK constraint on Sale)
        // Select Sales IDs first to delete shipments
        const getSalesStmt = db.prepare('SELECT id FROM Sale WHERE productId = ?');
        const sales = getSalesStmt.all(id) as { id: string }[];

        if (sales.length > 0) {
            const saleIds = sales.map(s => s.id);
            // Delete Shipments for these sales
            // better-sqlite3 doesn't support arrays in IN clause easily directly without mapping, 
            // but we can delete by saleId in a loop or query. 
            // Simpler: DELETE FROM Shipment WHERE saleId IN (SELECT id FROM Sale WHERE productId = ?)
            const deleteShipmentsStmt = db.prepare('DELETE FROM Shipment WHERE saleId IN (SELECT id FROM Sale WHERE productId = ?)');
            deleteShipmentsStmt.run(id);

            // 3. Delete Sales
            const deleteSalesStmt = db.prepare('DELETE FROM Sale WHERE productId = ?');
            deleteSalesStmt.run(id);
        }

        // 4. Handle ScheduledPost (Set NULL is handled by Schema if SetNull works, otherwise manual set null)
        // Schema has onDelete: SetNull for ScheduledPost, assuming that part of schema matched or we do it manually safely.
        // Let's manually set it to null to be safe if schema didn't update.
        const updatePostsStmt = db.prepare('UPDATE ScheduledPost SET productId = NULL WHERE productId = ?');
        updatePostsStmt.run(id);

        // 5. Delete Product
        const stmt = db.prepare('DELETE FROM Product WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });

        res.json({ message: 'Produto e registros associados deletados com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar produto: ' + (error as any).message });
    }
};
