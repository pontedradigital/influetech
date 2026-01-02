import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import db from '../db';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.error('❌ ERRO CRÍTICO: SUPABASE_URL ou SUPABASE_ANON_KEY faltando. O Auth Middleware irá falhar.');
}

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        if (!supabase) {
            console.error("Supabase client not initialized");
            return res.status(500).json({ error: 'Erro de configuração do servidor' });
        }

        // 1. Verify Token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }

        // 2. Check Role in Database
        const dbUser = await db.user.findUnique({
            where: { id: user.id },
            select: { role: true }
        });

        if (!dbUser || dbUser.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso Negado: Apenas Administradores (Master)' });
        }

        // Add user to request (optional, for controller usage)
        (req as any).user = user;

        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        res.status(500).json({ error: 'Erro interno de autenticação' });
    }
};
