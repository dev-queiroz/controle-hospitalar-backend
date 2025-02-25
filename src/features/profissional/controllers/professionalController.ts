import { Request, Response } from 'express';
import * as professionalService from '../services/professionalService';

export const allocateProfessional = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== 'admin') throw new Error('Acesso negado');
        const { professionalId, unidadeSaudeId } = req.body;
        const professional = await professionalService.allocateProfessional(professionalId, unidadeSaudeId);
        res.status(200).json(professional);
    } catch (error) {
        res.status(403).json({ error: (error as Error).message });
    }
};