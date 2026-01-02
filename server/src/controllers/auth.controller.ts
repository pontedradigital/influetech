import { Request, Response } from 'express';
import db from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(400).json({ error: 'Usuário não encontrado' });
            return;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            res.status(400).json({ error: 'Senha inválida' });
            return;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                role: user.role,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
};
