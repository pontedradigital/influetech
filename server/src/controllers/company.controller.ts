import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const listCompanies = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare('SELECT * FROM Company ORDER BY name ASC');
        const companies = stmt.all();
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar empresas' });
    }
};

export const createCompany = (req: Request, res: Response) => {
    const { name, contactName, email, phone, country, website, contactMethod, contactValue, partnershipStatus, userId } = req.body;
    try {
        const id = uuidv4();
        const stmt = db.prepare(`
      INSERT INTO Company (id, name, contactName, email, phone, country, website, contactMethod, contactValue, partnershipStatus, status, rating, userId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 0, ?, datetime('now'), datetime('now'))
    `);
        stmt.run(id, name, contactName, email, phone, country, website, contactMethod, contactValue, partnershipStatus || 'Solicitada', userId || 'mock-id');
        res.status(201).json({ id, name, contactName, email, phone, country, website, contactMethod, contactValue, partnershipStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar empresa' });
    }
};

export const updateCompany = (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, contactName, email, phone, country, website, contactMethod, contactValue, partnershipStatus, status, rating } = req.body;
    try {
        const stmt = db.prepare(`
      UPDATE Company 
      SET name = ?, contactName = ?, email = ?, phone = ?, country = ?, website = ?, contactMethod = ?, contactValue = ?, partnershipStatus = ?, status = ?, rating = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);
        const result = stmt.run(name, contactName, email, phone, country, website, contactMethod, contactValue, partnershipStatus, status, rating, id);
        if (result.changes === 0) return res.status(404).json({ error: 'Empresa não encontrada' });
        res.json({ message: 'Empresa atualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
};

export const deleteCompany = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM Company WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) return res.status(404).json({ error: 'Empresa não encontrada' });
        res.json({ message: 'Empresa deletada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar empresa' });
    }
};
