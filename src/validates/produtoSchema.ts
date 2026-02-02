import { z } from 'zod';

export const createProdutoSchema = z.object({
    nome: z.string()
        .min(1, "O nome do produto é obrigatório")
        .max(255, "O nome do produto não pode ter mais de 255 caracteres"),
    descricao: z.string()
        .max(500, "A descrição não pode ter mais de 500 caracteres")
        .optional()
        .nullable(),
    preco: z.number()
        .positive("O preço deve ser um número maior que zero"),
    estoque: z.number()
        .int("O estoque deve ser um número inteiro")
        .nonnegative("O estoque não pode ser negativo")
        .default(0),
    categoriaId: z.string()
        .uuid("ID da categoria deve ser um UUID válido")
});

export const updateProdutoSchema = z.object({
    nome: z.string()
        .min(1, "O nome do produto é obrigatório")
        .max(255, "O nome do produto não pode ter mais de 255 caracteres")
        .optional(),
    descricao: z.string()
        .max(500, "A descrição não pode ter mais de 500 caracteres")
        .optional()
        .nullable(),
    preco: z.number()
        .positive("O preço deve ser um número maior que zero")
        .optional(),
    estoque: z.number()
        .int("O estoque deve ser um número inteiro")
        .nonnegative("O estoque não pode ser negativo")
        .optional(),
    categoriaId: z.string()
        .uuid("ID da categoria deve ser um UUID válido")
        .optional()
}).strict();

export type CreateProdutoInput = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoInput = z.infer<typeof updateProdutoSchema>;
