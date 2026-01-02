import { Request, Response } from 'express';
import db from '../db';

export const getAllPlans = async (req: Request, res: Response) => {
    try {
        const plans = await db.plan.findMany({
            where: { active: true },
            orderBy: { priceMonthly: 'asc' }
        });

        // Parse features JSON
        const formattedPlans = plans.map(plan => ({
            ...plan,
            features: JSON.parse(plan.features)
        }));

        res.json(formattedPlans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ error: 'Failed to fetch plans' });
    }
};

export const createPlan = async (req: Request, res: Response) => {
    try {
        const { name, description, priceMonthly, priceAnnual, features, recommended } = req.body;

        const newPlan = await db.plan.create({
            data: {
                name,
                description,
                priceMonthly,
                priceAnnual,
                features: JSON.stringify(features),
                recommended: recommended || false
            }
        });

        res.status(201).json(newPlan);
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({ error: 'Failed to create plan' });
    }
};

export const updatePlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, priceMonthly, priceAnnual, features, recommended, active } = req.body;

        const updatedPlan = await db.plan.update({
            where: { id },
            data: {
                name,
                description,
                priceMonthly,
                priceAnnual,
                features: features ? JSON.stringify(features) : undefined,
                recommended,
                active
            }
        });

        res.json(updatedPlan);
    } catch (error) {
        console.error('Error updating plan:', error);
        res.status(500).json({ error: 'Failed to update plan' });
    }
};

export const deletePlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Soft delete is handled by update active=false usually, but here we might want hard delete or soft.
        // Let's allow hard delete but catch errors if used? Or just use soft delete via update.
        // User asked to "manage" plans.
        // Let's implement hard delete for now.

        await db.plan.delete({
            where: { id }
        });

        res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({ error: 'Failed to delete plan' });
    }
};
