import { Router } from "express";
import type { Request, Response } from "express";
import CategoriaController from "../controllers/CategoriaController.js";
import CategoriaService from "../services/CategoriaService.js";
import { validarBody } from "../middleware/validarBody.js";
import { createCategoriaSchema, updateCategoriaSchema } from "../validates/categoriaSchema.js";

const categoriaRouter = Router();
const categoriaService = new CategoriaService();
const categoriaController = new CategoriaController(categoriaService);

// GET /api/categorias - Retorna todas as categorias
categoriaRouter.get('/', (req: Request, res: Response) => categoriaController.getAllCategorias(req, res));

// GET /api/categorias/:id - Retorna uma categoria específica
categoriaRouter.get('/:id', (req: Request, res: Response) => categoriaController.getCategoriaById(req, res));

// POST /api/categorias - Cria uma nova categoria
categoriaRouter.post('/', validarBody(createCategoriaSchema), (req: Request, res: Response) => 
    categoriaController.addCategoria(req, res)
);

// PUT /api/categorias/:id - Atualiza uma categoria existente
categoriaRouter.put('/:id', validarBody(updateCategoriaSchema), (req: Request, res: Response) => 
    categoriaController.updateCategoria(req, res)
);

// DELETE /api/categorias/:id - Deleta uma categoria
categoriaRouter.delete('/:id', (req: Request, res: Response) => categoriaController.deleteCategoria(req, res));

export default categoriaRouter;
