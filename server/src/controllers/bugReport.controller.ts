import { Request, Response } from 'express';
import db from '../db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/bug-reports');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `bug-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas (JPG, PNG, WebP)'));
        }
    }
}).array('images', 3);

// Create bug report
export const createBugReport = async (req: Request, res: Response) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const userId = (req as any).user.id;
            const { title, description } = req.body;

            if (!title || !description) {
                return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
            }

            const files = req.files as Express.Multer.File[];
            const imageUrls = files ? files.map(file => `/uploads/bug-reports/${file.filename}`) : [];

            const bugReport = await db.bugReport.create({
                data: {
                    userId,
                    title: title.slice(0, 150),
                    description: description.slice(0, 400),
                    images: imageUrls,
                    status: 'Acompanhando'
                }
            });

            res.status(201).json(bugReport);
        } catch (error: any) {
            console.error('Error creating bug report:', error);
            res.status(500).json({ error: 'Erro ao criar report' });
        }
    });
};

// Get user's bug reports
export const getUserBugReports = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const reports = await db.bugReport.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reports);
    } catch (error: any) {
        console.error('Error fetching bug reports:', error);
        res.status(500).json({ error: 'Erro ao buscar reports' });
    }
};

// Get all bug reports (Admin only)
export const getAllBugReports = async (req: Request, res: Response) => {
    try {
        const reports = await db.bugReport.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reports);
    } catch (error: any) {
        console.error('Error fetching all bug reports:', error);
        res.status(500).json({ error: 'Erro ao buscar reports' });
    }
};

// Update bug report status (Admin only)
export const updateBugReportStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, adminMessage } = req.body;

        const validStatuses = ['Acompanhando', 'Desenvolvendo', 'Declinado', 'Adicionado Melhoria'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        const updated = await db.bugReport.update({
            where: { id },
            data: {
                status,
                adminMessage: adminMessage || null
            }
        });

        res.json(updated);
    } catch (error: any) {
        console.error('Error updating bug report:', error);
        res.status(500).json({ error: 'Erro ao atualizar report' });
    }
};

// Delete bug report (Admin only)
export const deleteBugReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const report = await db.bugReport.findUnique({ where: { id } });
        if (!report) {
            return res.status(404).json({ error: 'Report não encontrado' });
        }

        // Delete associated images
        report.images.forEach(imageUrl => {
            const imagePath = path.join(__dirname, '../..', imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });

        await db.bugReport.delete({ where: { id } });

        res.json({ message: 'Report deletado com sucesso' });
    } catch (error: any) {
        console.error('Error deleting bug report:', error);
        res.status(500).json({ error: 'Erro ao deletar report' });
    }
};
