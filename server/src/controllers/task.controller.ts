import { Request, Response } from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const listTasks = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare('SELECT * FROM Task ORDER BY dueDate ASC, createdAt DESC');
        const tasks = stmt.all();
        res.json(tasks);
    } catch (error) {
        console.error('Error listing tasks:', error);
        res.status(500).json({ error: 'Erro ao listar tarefas' });
    }
};

export const createTask = (req: Request, res: Response) => {
    const { title, description, category, priority, dueDate, userId } = req.body;

    try {
        const id = uuidv4();
        const finalUserId = userId === 'mock-id' ? '327aa8c1-7c26-41c2-95d7-b375c25eb896' : (userId || '327aa8c1-7c26-41c2-95d7-b375c25eb896');

        const stmt = db.prepare(`
            INSERT INTO Task (
                id, userId, title, description, category, priority, status, dueDate, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, 'TODO', ?, datetime('now'), datetime('now'))
        `);

        stmt.run(id, finalUserId, title, description || null, category, priority || 'MEDIUM', dueDate || null);
        res.status(201).json({ id, title, status: 'TODO' });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
};

export const updateTask = (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, category, priority, status, dueDate } = req.body;

    try {
        const stmt = db.prepare(`
            UPDATE Task 
            SET title = ?, description = ?, category = ?, priority = ?, status = ?, dueDate = ?, updatedAt = datetime('now')
            WHERE id = ?
        `);

        const result = stmt.run(title, description, category, priority, status, dueDate, id);
        if (result.changes === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
        res.json({ message: 'Tarefa atualizada' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
};

export const deleteTask = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM Task WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
        res.json({ message: 'Tarefa excluída' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Erro ao excluir tarefa' });
    }
};

export const completeTask = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const now = new Date();
        const nowIso = now.toISOString();

        // Get current task to check date
        const currentTask = db.prepare('SELECT dueDate FROM Task WHERE id = ?').get(id) as any;

        if (!currentTask) return res.status(404).json({ error: 'Tarefa não encontrada' });

        // If dueDate is null, keep it null, otherwise check if future
        let newDueDate = currentTask.dueDate;
        if (currentTask.dueDate) {
            const dueDate = new Date(currentTask.dueDate);
            if (dueDate > now) {
                newDueDate = nowIso;
            }
        }

        const stmt = db.prepare(`
            UPDATE Task 
            SET status = 'DONE', 
                completedAt = ?, 
                dueDate = ?,
                updatedAt = ?
            WHERE id = ?
        `);

        stmt.run(nowIso, newDueDate, nowIso, id);
        res.json({ message: 'Tarefa marcada como concluída' });
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'Erro ao concluir tarefa' });
    }
};
