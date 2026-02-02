import type { Request, Response } from 'express';
import CategoriaService from '../services/CategoriaService.js';
import { AppError } from '../errors/AppError.js';

class CategoriaController {
    constructor(private categoriaService: CategoriaService) {}

    /**
     * GET /api/categorias
     * Retorna todas as categorias
     */
    public async getAllCategorias(req: Request, res: Response): Promise<void> {
        try {
            const categorias = await this.categoriaService.getAllCategorias();
            res.status(200).json({
                statusCode: 200,
                message: "Categorias encontradas com sucesso",
                data: categorias,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * GET /api/categorias/:id
     * Retorna uma categoria específica
     */
    public async getCategoriaById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const categoria = await this.categoriaService.getCategoriaById(id);
            res.status(200).json({
                statusCode: 200,
                message: "Categoria encontrada com sucesso",
                data: categoria,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    
      //POST /api/categorias
    
    public async addCategoria(req: Request, res: Response): Promise<void> {
        try {
            const categoria = await this.categoriaService.addCategoria(req.body);
            res.status(201).json({
                statusCode: 201,
                message: "Categoria criada com sucesso",
                data: categoria,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    
     //PUT /api/categorias/:id
     
    public async updateCategoria(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const categoria = await this.categoriaService.updateCategoria(id, req.body);
            res.status(200).json({
                statusCode: 200,
                message: "Categoria atualizada com sucesso",
                data: categoria,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * DELETE /api/categorias/:id
     * Deleta uma categoria
     */
    public async deleteCategoria(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            await this.categoriaService.deleteCategoria(id);
            res.status(200).json({
                statusCode: 200,
                message: "Categoria deletada com sucesso",
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

export default CategoriaController;
