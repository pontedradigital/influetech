import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

// List all sales
export const listSales = (req: Request, res: Response) => {
    try {
        const { search } = req.query;

        let query = `
      SELECT 
        s.*,
        p.name as productName,
        p.category as productCategory,
        p.brand as productBrand
      FROM Sale s
      LEFT JOIN Product p ON s.productId = p.id
      ORDER BY s.createdAt DESC
    `;

        let sales = db.prepare(query).all();

        // Apply search filter if provided
        if (search && typeof search === 'string') {
            const searchLower = search.toLowerCase();
            sales = sales.filter((sale: any) =>
                sale.customerName.toLowerCase().includes(searchLower) ||
                sale.productName?.toLowerCase().includes(searchLower) ||
                sale.status.toLowerCase().includes(searchLower) ||
                sale.contactChannel.toLowerCase().includes(searchLower)
            );
        }

        res.json(sales);
    } catch (error) {
        console.error('Error listing sales:', error);
        res.status(500).json({ error: 'Erro ao listar vendas' });
    }
};

// Get sale by ID
export const getSale = (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const sale = db.prepare(`
      SELECT 
        s.*,
        p.name as productName,
        p.category as productCategory,
        p.brand as productBrand,
        p.marketValue as productPrice
      FROM Sale s
      LEFT JOIN Product p ON s.productId = p.id
      WHERE s.id = ?
    `).get(id);

        if (!sale) {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }

        res.json(sale);
    } catch (error) {
        console.error('Error getting sale:', error);
        res.status(500).json({ error: 'Erro ao buscar venda' });
    }
};

// Create sale
export const createSale = (req: Request, res: Response) => {
    const {
        productId,
        customerName,
        contactChannel,
        contactValue,
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        salePrice,
        userId
    } = req.body;

    try {
        const id = uuidv4();
        const saleDate = new Date().toISOString();

        const stmt = db.prepare(`
      INSERT INTO Sale (
        id, productId, customerName, contactChannel, contactValue,
        cep, street, number, complement, neighborhood, city, state,
        salePrice, saleDate, status, userId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, datetime('now'), datetime('now'))
    `);

        stmt.run(
            id, productId, customerName, contactChannel, contactValue,
            cep || null, street || null, number || null, complement || null,
            neighborhood || null, city || null, state || null,
            salePrice, saleDate, userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896')
        );

        // Get product info for financial transaction
        const product = db.prepare('SELECT name FROM Product WHERE id = ?').get(productId) as any;

        // Create financial transaction (income)
        const transactionId = uuidv4();
        const description = `Venda - ${product?.name || 'Produto'} - ${customerName}`;

        db.prepare(`
      INSERT INTO FinancialTransaction (
        id, type, amount, description, date, category, status, userId, createdAt, updatedAt
      ) VALUES (?, 'INCOME', ?, ?, ?, 'Vendas', 'COMPLETED', ?, datetime('now'), datetime('now'))
    `).run(transactionId, salePrice, description, saleDate, userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896'));

        // Update product status to SOLD
        db.prepare('UPDATE Product SET status = ? WHERE id = ?').run('SOLD', productId);

        res.status(201).json({
            id,
            productId,
            customerName,
            salePrice,
            status: 'PENDING',
            message: 'Venda criada, registrado no financeiro e status do produto atualizado para Vendido'
        });
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ error: 'Erro ao criar venda' });
    }
};

// Update sale status
export const updateSale = (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const stmt = db.prepare(`
      UPDATE Sale 
      SET status = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);

        const result = stmt.run(status, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }

        res.json({ message: 'Status da venda atualizado' });
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(500).json({ error: 'Erro ao atualizar venda' });
    }
};

// Delete sale
export const deleteSale = (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare('DELETE FROM Sale WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }

        res.json({ message: 'Venda excluída' });
    } catch (error) {
        console.error('Error deleting sale:', error);
        res.status(500).json({ error: 'Erro ao excluir venda' });
    }
};
