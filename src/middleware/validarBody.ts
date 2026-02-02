import type { Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../errors/AppError.js';

export const validarBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: any) => {
        try {
            const dadosValidados = schema.parse(req.body);
            req.body = dadosValidados;
            next();
        } catch (error: any) {
            const statusCode = 400;
            const message = error.errors?.map((e: any) => e.message).join('; ') || 'Erro na validação';
            return res.status(statusCode).json({
                statusCode,
                message,
                timestamp: new Date().toISOString()
        });
    }
};
};
