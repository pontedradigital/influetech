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
    const { name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, userId } = req.body;
    try {
        const id = uuidv4();
        const stmt = db.prepare(`
      INSERT INTO Product (id, name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, status, userId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'RECEIVED', ?, datetime('now'), datetime('now'))
    `);
        stmt.run(id, name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, userId || 'mock-id');
        res.status(201).json({ id, name, category, status: 'RECEIVED' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};

export const updateProduct = (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, status } = req.body;
    try {
        const stmt = db.prepare(`
      UPDATE Product 
      SET name = ?, category = ?, brand = ?, model = ?, marketValue = ?, primaryColor = ?, secondaryColor = ?, shippingCost = ?, condition = ?, status = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);
        const result = stmt.run(name, category, brand, model, marketValue, primaryColor, secondaryColor, shippingCost, condition, status, id);
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
        const stmt = db.prepare('DELETE FROM Product WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json({ message: 'Produto deletado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
};
