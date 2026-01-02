import { Request, Response } from 'express';
import db from '../db';

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id; // From auth

        // 1. Strict Check: Can only update own profile
        if (id !== userId) {
            return res.status(403).json({ error: 'Você só pode editar seu próprio perfil.' });
        }

        const {
            name,
            isPublicProfile,
            bio,
            niche,
            location,
            socialInstagram,
            socialLinkedin,
            socialYoutube,
            socialTikTok,
            socialWhatsapp
        } = req.body;

        // Check if user exists
        const existingUser = await db.user.findUnique({ where: { id } });

        if (!existingUser) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Prepare data for update.
        // Prisma updates only what is provided in 'data'.
        // We use undefined for fields not present in req.body so Prisma ignores them.
        // Since sqlite had explicit COALESCE logic, effectively keeping old value if new is null/undefined.
        // Prisma does this automatically if we only pass defined fields.
        // However, we need to handle the isPublicProfile conversion (boolean <-> int) if schema still uses Int.
        // Checking schema: isPublicProfile Int @default(0)

        const updateData: any = {
            name: name ?? undefined,
            isPublicProfile: isPublicProfile !== undefined ? (isPublicProfile ? 1 : 0) : undefined,
            bio: bio ?? undefined,
            niche: niche ?? undefined,
            location: location ?? undefined,
            socialInstagram: socialInstagram ?? undefined,
            socialLinkedin: socialLinkedin ?? undefined,
            socialYoutube: socialYoutube ?? undefined,
            socialTikTok: socialTikTok ?? undefined,
            socialWhatsapp: socialWhatsapp ?? undefined,
            cep: req.body.cep ?? undefined,
            street: req.body.street ?? undefined,
            number: req.body.number ?? undefined,
            complement: req.body.complement ?? undefined,
            neighborhood: req.body.neighborhood ?? undefined,
            city: req.body.city ?? undefined,
            state: req.body.state ?? undefined,
            cpfCnpj: req.body.cpfCnpj ?? undefined,
        };

        const updatedUser = await db.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true, name: true, email: true, plan: true, isPublicProfile: true, bio: true, niche: true, location: true,
                socialInstagram: true, socialLinkedin: true, socialYoutube: true, socialTikTok: true, socialWhatsapp: true
            }
        });

        const result = {
            ...updatedUser,
            isPublicProfile: Boolean(updatedUser.isPublicProfile)
        };

        res.json(result);
    } catch (error: any) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil', details: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await db.user.findUnique({
            where: { id },
            select: {
                id: true, name: true, email: true, plan: true, isPublicProfile: true, bio: true, niche: true, location: true,
                socialInstagram: true, socialLinkedin: true, socialYoutube: true, socialTikTok: true, socialWhatsapp: true,
                cep: true, street: true, number: true, complement: true, neighborhood: true, city: true, state: true, cpfCnpj: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const result = {
            ...user,
            isPublicProfile: Boolean(user.isPublicProfile)
        };

        res.json(result);
    } catch (error: any) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
};

export const getPublicUsers = async (req: Request, res: Response) => {
    try {
        const { search, niche, location } = req.query;

        const where: any = {
            isPublicProfile: 1,
            active: 1
        };

        if (search) {
            where.OR = [
                { name: { contains: String(search), mode: 'insensitive' } },
                { bio: { contains: String(search), mode: 'insensitive' } },
                { niche: { contains: String(search), mode: 'insensitive' } }
            ];
        }

        if (niche) {
            where.niche = { contains: String(niche), mode: 'insensitive' };
        }

        if (location) {
            where.location = { contains: String(location), mode: 'insensitive' };
        }

        const users = await db.user.findMany({
            where,
            select: {
                id: true, name: true, plan: true, bio: true, niche: true, location: true,
                socialInstagram: true, socialLinkedin: true, socialYoutube: true, socialTikTok: true, socialWhatsapp: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(users);
    } catch (error: any) {
        console.error('Error fetching public users:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários públicos', details: error.message });
    }
};

export const toggleLike = async (req: Request, res: Response) => {
    const { toUserId } = req.body;
    const fromUserId = (req as any).user.id; // Force from authenticated user

    try {
        // Check if like exists
        const existingLike = await db.profileLike.findFirst({
            where: { fromUserId, toUserId }
        });

        if (existingLike) {
            // Remove like (Unlike)
            await db.profileLike.delete({
                where: { id: existingLike.id }
            });
            res.json({ liked: false });
        } else {
            // Add like
            await db.profileLike.create({
                data: {
                    fromUserId,
                    toUserId
                }
            });
            res.json({ liked: true });
        }
    } catch (error: any) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Erro ao processar like' });
    }
};

export const getProfileStats = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const likesReceived = await db.profileLike.count({
            where: { toUserId: id }
        });

        const opportunitiesPosted = await db.opportunity.count({
            where: { userId: id }
        });

        res.json({
            likesReceived,
            opportunitiesPosted
        });
    } catch (error: any) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
};
