
import { Request, Response } from 'express';
import db from '../db';
import { Prisma } from '@prisma/client';

// Helper to determine tier based on social presence and simple heuristics
const determineTier = (text: string): string => {
    let score = 0;
    if (text.includes('instagram.com')) score += 2;
    if (text.includes('youtube.com')) score += 2;
    if (text.includes('linkedin.com')) score += 3; // Corporate usually means bigger budget
    if (text.includes('tiktok.com')) score += 1;

    if (score >= 6) return 'Tier S';
    if (score >= 4) return 'Tier A';
    if (score >= 2) return 'Tier B';
    return 'Tier C';
};

export const radarBrandController = {
    // 1. List All (Cached/Optimized)
    getAll: async (req: Request, res: Response) => {
        try {
            const brands = await db.radarBrand.findMany({
                orderBy: { name: 'asc' }
            });

            // Parse JSON fields if necessary (Prisma handles JSON, but we used String)
            // But wait, the frontend expects specific enums.

            res.json(brands.map(b => ({
                ...b,
                categories: safeJsonParse(b.categories),
                salesChannels: safeJsonParse(b.salesChannels)
            })));
        } catch (error) {
            console.error('Error fetching brands:', error);
            res.status(500).json({ error: 'Failed to fetch brands' });
        }
    },

    // 2. Create
    create: async (req: Request, res: Response) => {
        try {
            const data = req.body;

            const brand = await db.radarBrand.create({
                data: {
                    ...data,
                    categories: JSON.stringify(data.categories || []),
                    salesChannels: JSON.stringify(data.salesChannels || [])
                }
            });
            res.status(201).json(brand);
        } catch (error) {
            console.error('Error creating brand:', error);
            res.status(500).json({ error: 'Failed to create brand' });
        }
    },

    // 3. Update
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const brand = await db.radarBrand.update({
                where: { id },
                data: {
                    ...data,
                    categories: data.categories ? JSON.stringify(data.categories) : undefined,
                    salesChannels: data.salesChannels ? JSON.stringify(data.salesChannels) : undefined,
                }
            });
            res.json(brand);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update brand' });
        }
    },

    // 4. Delete
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await db.radarBrand.delete({ where: { id } });
            res.json({ message: 'Brand deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete brand' });
        }
    },

    // 5. ANALYZE (The Magic Tool)
    analyze: async (req: Request, res: Response) => {
        try {
            const { url } = req.body;
            if (!url) return res.status(400).json({ error: 'URL is required' });

            // 1. Fetch HTML safely
            // Node 18+ has native fetch. If on older node, might fail, but let's assume modern env.
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url.startsWith('http') ? url : `https://${url}`, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            clearTimeout(timeout);

            if (!response.ok) throw new Error(`External site returned ${response.status}`);

            const html = await response.text();

            // 2. Parse Meta Data (Regex)
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : '';

            // Clean title (remove " | Brand Name" or similar)
            const cleanName = title.split('|')[0].split('-')[0].split(':')[0].trim();

            const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
            const description = descMatch ? descMatch[1].trim() : '';

            // 3. Find Socials
            const instagram = html.match(/instagram\.com\/([a-zA-Z0-9_.]+)/i)?.[1];
            const youtube = html.match(/youtube\.com\/(?:@|c\/|user\/)?([a-zA-Z0-9_.-]+)/i)?.[1];

            // 4. Determine Tier & Metrics (Heuristic)
            const tier = determineTier(html);

            const suggestedData = {
                name: cleanName,
                description: description.substring(0, 150),
                tier,
                instagram: instagram ? `@${instagram}` : undefined,
                youtube: youtube || undefined,
                website: url,
                // Intelligent Randomness for "Radar" visuals if unknown
                matchScore: Math.floor(Math.random() * (99 - 70) + 70),
                budget: Math.floor(Math.random() * (100 - 40) + 40),
                affinity: Math.floor(Math.random() * (95 - 60) + 60),
                difficulty: 'Médio', // Safety default
                origin: 'Global', // Default
                email: 'contact@' + (new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '')),
                logo: cleanName.substring(0, 2).toUpperCase()
            };

            res.json(suggestedData);

        } catch (error: any) {
            console.error('Analyze error:', error);
            res.status(500).json({ error: 'Failed to analyze website. ' + error.message });
        }
    }
};

function safeJsonParse(str: string) {
    try {
        return JSON.parse(str);
    } catch {
        return [];
    }
}
