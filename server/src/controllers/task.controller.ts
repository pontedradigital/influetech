import { Request, Response } from 'express';
import db from '../db';

export const listTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await db.task.findMany({
            orderBy: [
                { dueDate: 'asc' }, // nulls last handling varies by DB, Prisma usually okay
                { createdAt: 'desc' }
            ]
        });
        res.json(tasks);
    } catch (error) {
        console.error('Error listing tasks:', error);
        res.status(500).json({ error: 'Erro ao listar tarefas' });
    }
};

export const createTask = async (req: Request, res: Response) => {
    const { title, description, category, priority, dueDate, userId } = req.body;

    try {
        const finalUserId = userId; // Auth should handle this

        const task = await db.task.create({
            data: {
                title,
                description: description || null,
                category,
                priority: priority || 'MEDIUM',
                status: 'TODO',
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: finalUserId
            }
        });

        res.status(201).json({ id: task.id, title: task.title, status: task.status });
    } catch (error: any) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, category, priority, status, dueDate } = req.body;

    try {
        await db.task.update({
            where: { id },
            data: {
                title,
                description, // prisma undefined ignores, null sets null
                category,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : (dueDate === null ? null : undefined), // handle explicit null vs undefined
                updatedAt: new Date()
            }
        });
        res.json({ message: 'Tarefa atualizada' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Tarefa não encontrada' });
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.task.delete({
            where: { id }
        });
        res.json({ message: 'Tarefa excluída' });
    } catch (error: any) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Tarefa não encontrada' });
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Erro ao excluir tarefa' });
    }
};

export const completeTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const now = new Date();

        // Get current task to check date
        const currentTask = await db.task.findUnique({ where: { id } });

        if (!currentTask) return res.status(404).json({ error: 'Tarefa não encontrada' });

        // If dueDate is null, keep it null, otherwise check if future
        let newDueDate = currentTask.dueDate;
        if (currentTask.dueDate) {
            const dueDate = new Date(currentTask.dueDate);
            if (dueDate > now) {
                newDueDate = now; // Set to now if it was in the future
            }
        }

        await db.task.update({
            where: { id },
            data: {
                status: 'DONE',
                completedAt: now,
                dueDate: newDueDate,
                updatedAt: now
            }
        });

        res.json({ message: 'Tarefa marcada como concluída' });
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'Erro ao concluir tarefa' });
    }
};
