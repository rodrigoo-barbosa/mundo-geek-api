import type { Request, Response } from 'express';
import ProdutoService from '../services/ProdutoService.js';
import { AppError } from '../errors/AppError.js';

class ProdutoController {
    constructor(private produtoService: ProdutoService) {}

    /**
     * GET /api/produtos
     * Retorna todos os produtos
     */
    public async getAllProdutos(req: Request, res: Response): Promise<void> {
        try {
            const produtos = await this.produtoService.getAllProdutos();
            res.status(200).json({
                statusCode: 200,
                message: "Produtos encontrados com sucesso",
                data: produtos,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * GET /api/produtos/:id
     */
    public async getProdutoById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const produto = await this.produtoService.getProdutoById(id);
            res.status(200).json({
                statusCode: 200,
                message: "Produto encontrado com sucesso",
                data: produto,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * GET /api/categorias/:categoriaId/produtos
     */
    public async getProdutosByCategoria(req: Request, res: Response): Promise<void> {
        try {
            const { categoriaId } = req.params as { categoriaId: string };
            const produtos = await this.produtoService.getProdutosByCategoria(categoriaId);
            res.status(200).json({
                statusCode: 200,
                message: "Produtos da categoria encontrados com sucesso",
                data: produtos,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Cria um novo produto
     */
    public async addProduto(req: Request, res: Response): Promise<void> {
        try {
            const produto = await this.produtoService.addProduto(req.body);
            res.status(201).json({
                statusCode: 201,
                message: "Produto criado com sucesso",
                data: produto,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * PUT /api/produtos/:id
     */
    public async updateProduto(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const produto = await this.produtoService.updateProduto(id, req.body);
            res.status(200).json({
                statusCode: 200,
                message: "Produto atualizado com sucesso",
                data: produto,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * DELETE /api/produtos/:id
     */
    public async deleteProduto(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            await this.produtoService.deleteProduto(id);
            res.status(200).json({
                statusCode: 200,
                message: "Produto deletado com sucesso",
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * PATCH /api/produtos/:id/estoque
     * Atualiza o estoque de um produto
     * Body: { "quantidade": number (positivo ou negativo) }
     */
    public async atualizarEstoque(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const { quantidade } = req.body;

            if (typeof quantidade !== 'number') {
                res.status(400).json({
                    statusCode: 400,
                    message: "A quantidade deve ser um número",
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const produto = await this.produtoService.atualizarEstoque(id, quantidade);
            res.status(200).json({
                statusCode: 200,
                message: "Estoque atualizado com sucesso",
                data: produto,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Trata erros da aplicação
     */
    private handleError(error: any, res: Response): void {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
                statusCode: 500,
                message: "Erro interno do servidor",
                timestamp: new Date().toISOString()
            });
        }
    }
}

export default ProdutoController;
