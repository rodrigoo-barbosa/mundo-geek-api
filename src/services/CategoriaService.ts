import { AppError } from '../errors/AppError.js';
import { appDataSource } from '../database/appDataSource.js';
import { Categoria } from '../entities/Categoria.js';
import { createCategoriaSchema, updateCategoriaSchema } from '../validates/categoriaSchema.js';
import type { CreateCategoriaInput, UpdateCategoriaInput } from '../validates/categoriaSchema.js';
import { ZodError } from 'zod';

class CategoriaService {
    private categoriaRepository = appDataSource.getRepository(Categoria);

    /**
     * Obtém todas as categorias com seus produtos relacionados
     */
    public async getAllCategorias(): Promise<Categoria[]> {
        try {
            return await this.categoriaRepository.find({
                relations: ['produtos']
            });
        } catch (error) {
            throw new AppError(500, "Erro ao buscar categorias");
        }
    }

    /**
     * Obtém uma categoria por ID
     * @param id ID da categoria
     */
    public async getCategoriaById(id: string): Promise<Categoria> {
        try {
            const categoria = await this.categoriaRepository.findOne({
                where: { id },
                relations: ['produtos']
            });

            if (!categoria) {
                throw new AppError(404, "Categoria não encontrada");
            }

            return categoria;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Erro ao buscar categoria");
        }
    }

    /**
     * Cria uma nova categoria
     * @param body Dados da categoria a ser criada
     */
    public async addCategoria(body: unknown): Promise<Categoria> {
        try {
            // Validação com Zod
            const dadosValidados = createCategoriaSchema.parse(body);

            // Verifica se já existe categoria com esse nome (nome é único)
            const categoriaExistente = await this.categoriaRepository.findOneBy({ 
                nome: dadosValidados.nome 
            });
            
            if (categoriaExistente) {
                throw new AppError(400, "Já existe uma categoria com este nome");
            }

            const novaCategoria = this.categoriaRepository.create({
                nome: dadosValidados.nome,
                descricao: dadosValidados.descricao ?? null
            });

            await this.categoriaRepository.save(novaCategoria);
            return novaCategoria;
        } catch (error) {
            if (error instanceof ZodError) {
                const mensagens = error.issues.map((err) => err.message).join('; ');
                throw new AppError(400, `Validação falhou: ${mensagens}`);
            }
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Erro ao criar categoria");
        }
    }

    /**
     * Atualiza uma categoria existente
     * @param id ID da categoria
     * @param body Dados a serem atualizados
     */
    public async updateCategoria(id: string, body: unknown): Promise<Categoria> {
        try {
            // Validação com Zod
            const dadosValidados = updateCategoriaSchema.parse(body);

            const categoriaExiste = await this.categoriaRepository.findOneBy({ id });

            if (!categoriaExiste) {
                throw new AppError(404, "Categoria não encontrada");
            }

            // Verifica se o novo nome já existe em outra categoria
            if (dadosValidados.nome && dadosValidados.nome !== categoriaExiste.nome) {
                const categoriaComMesmoNome = await this.categoriaRepository.findOneBy({
                    nome: dadosValidados.nome
                });
                if (categoriaComMesmoNome) {
                    throw new AppError(400, "Já existe uma categoria com este nome");
                }
            }

            // Atualiza apenas os campos fornecidos
            if (dadosValidados.nome) categoriaExiste.nome = dadosValidados.nome;
            if (dadosValidados.descricao !== undefined) categoriaExiste.descricao = dadosValidados.descricao ?? null;

            await this.categoriaRepository.save(categoriaExiste);
            return categoriaExiste;
        } catch (error) {
            if (error instanceof ZodError) {
                const mensagens = error.issues.map((err) => err.message).join('; ');
                throw new AppError(400, `Validação falhou: ${mensagens}`);
            }
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Erro ao atualizar categoria");
        }
    }

    /**
     * Deleta uma categoria
     * @param id ID da categoria
     */
    public async deleteCategoria(id: string): Promise<void> {
        try {
            const categoria = await this.categoriaRepository.findOne({
                where: { id },
                relations: ['produtos']
            });

            if (!categoria) {
                throw new AppError(404, "Categoria não encontrada");
            }

            // Verifica se existem produtos nessa categoria
            if (categoria.produtos && categoria.produtos.length > 0) {
                throw new AppError(400, "Não é possível deletar uma categoria que possui produtos");
            }

            await this.categoriaRepository.remove(categoria);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Erro ao deletar categoria");
        }
    }
}

export default CategoriaService;