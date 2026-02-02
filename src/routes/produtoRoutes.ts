import { Router } from "express";
import type { Request, Response } from "express";
import ProdutoController from "../controllers/ProdutoController.js";
import ProdutoService from "../services/ProdutoService.js";
import { validarBody } from "../middleware/validarBody.js";
import { createProdutoSchema, updateProdutoSchema } from "../validates/produtoSchema.js";

const produtoRouter = Router();
const produtoService = new ProdutoService();
const produtoController = new ProdutoController(produtoService);

// GET /api/produtos - Retorna todos os produtos
produtoRouter.get('/', (req: Request, res: Response) => produtoController.getAllProdutos(req, res));

// GET /api/produtos/:id - Retorna um produto específico
produtoRouter.get('/:id', (req: Request, res: Response) => produtoController.getProdutoById(req, res));

// POST /api/produtos - Cria um novo produto
produtoRouter.post('/', validarBody(createProdutoSchema), (req: Request, res: Response) => 
    produtoController.addProduto(req, res)
);

// PUT /api/produtos/:id - Atualiza um produto existente
produtoRouter.put('/:id', validarBody(updateProdutoSchema), (req: Request, res: Response) => 
    produtoController.updateProduto(req, res)
);

// DELETE /api/produtos/:id - Deleta um produto
produtoRouter.delete('/:id', (req: Request, res: Response) => produtoController.deleteProduto(req, res));

// PATCH /api/produtos/:id/estoque - Atualiza o estoque de um produto
produtoRouter.patch('/:id/estoque', (req: Request, res: Response) => produtoController.atualizarEstoque(req, res));

// GET /api/categorias/:categoriaId/produtos - Retorna produtos de uma categoria
produtoRouter.get('/categorias/:categoriaId/produtos', (req: Request, res: Response) => 
    produtoController.getProdutosByCategoria(req, res)
);

export default produtoRouter;
