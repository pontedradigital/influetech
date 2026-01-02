import { Request, Response } from 'express';
import db from '../db';

export const getAll = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // From auth

        // 1. Fetch Manual Brands
        const manualBrands = await db.mediaKitBrand.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Fetch "Approved" Companies
        // User requested "ACEITA". We check for variants to be safe given the schema default "Solicitada".
        const companyBrands = await db.company.findMany({
            where: {
                userId,
                partnershipStatus: { in: ['Aceita', 'ACEITA', 'aceita'] }
            },
            select: {
                id: true,
                name: true,
                logoUrl: true
            }
        });

        // 3. Map Companies to MediaKitBrand shape
        const mappedCompanies = companyBrands.map(c => ({
            id: c.id,
            userId,
            name: c.name,
            logo: c.logoUrl,
            backgroundColor: '#ffffff',
            createdAt: new Date(), // Placeholder
            updatedAt: new Date(),
            isCompany: true // Optional marker
        }));

        // 4. Merge results
        const combined = [...manualBrands, ...mappedCompanies];

        res.json(combined);
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { name, logo, backgroundColor } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const brand = await db.mediaKitBrand.create({
            data: {
                userId,
                name,
                logo,
                backgroundColor: backgroundColor || '#ffffff'
            }
        });

        res.json(brand);
    } catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({ error: 'Failed to create brand' });
    }
};

export const deleteBrand = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        // Verify ownership
        const brand = await db.mediaKitBrand.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        if (brand.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await db.mediaKitBrand.delete({
            where: { id }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ error: 'Failed to delete brand' });
    }
};
