import { z } from 'zod';

export const createCategoriaSchema = z.object({
    nome: z.string()
        .min(1, "O nome da categoria é obrigatório")
        .max(100, "O nome da categoria não pode ter mais de 100 caracteres"),
    descricao: z.string()
        .max(500, "A descrição não pode ter mais de 500 caracteres")
        .optional()
        .nullable()
});

export const updateCategoriaSchema = z.object({
    nome: z.string()
        .min(1, "O nome da categoria é obrigatório")
        .max(100, "O nome da categoria não pode ter mais de 100 caracteres")
        .optional(),
    descricao: z.string()
        .max(500, "A descrição não pode ter mais de 500 caracteres")
        .optional()
        .nullable()
}).strict();

export type CreateCategoriaInput = z.infer<typeof createCategoriaSchema>;
export type UpdateCategoriaInput = z.infer<typeof updateCategoriaSchema>;
