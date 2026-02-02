import { AppError } from '../errors/AppError.js';
import { appDataSource } from '../database/appDataSource.js';
import { Produto } from '../entities/Produto.js';
import { Categoria } from '../entities/Categoria.js';
import { createProdutoSchema, updateProdutoSchema } from '../validates/produtoSchema.js';
import type { CreateProdutoInput, UpdateProdutoInput } from '../validates/produtoSchema.js';
import { ZodError } from 'zod';

class ProdutoService {
    private produtoRepository = appDataSource.getRepository(Produto);
    private categoriaRepository = appDataSource.getRepository(Categoria);

    /**
     * Obtém todos os produtos
     */
    public async getAllProdutos(): Promise<Produto[]> {
        try {
            return await this.produtoRepository.find({
                relations: ['categoria']
            });
        } catch (error) {
            throw new AppError(500, "Erro ao buscar produtos");
        }
    }

    /**
     * Obtém um produto por ID
     * @param id ID do produto
     */
    public async getProdutoById(id: string): Promise<Produto> {
        try {
            const produto = await this.produtoRepository.findOne({
                where: { id },
                relations: ['categoria']
            });

            if (!produto) {
                throw new AppError(404, "Produto não encontrado");
            }

            return produto;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Erro ao buscar produto");
        }
    }

    /**
     * Obtém todos os produtos de uma categoria
     * @param categoriaId ID da categoria
     */
    public async getProdutosByCategoria(categoriaId: string): Promise<Produto[]> {
        try {
            // Verifica se a categoria existe
            const categoria = await this.categoriaRepository.findOneBy({ id: categoriaId });
            if (!categoria) {
                throw new AppError(404, "Categoria não encontrada");
            }

            return await this.produtoRepository.find({
                where: { categoria: { id: categoriaId } as any },
                relations: ['categoria']
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Erro ao buscar produtos da categoria");
        }
    }

    /**
     * Cria um novo produto
     * @param body Dados do produto a ser criado
     */
    public async addProduto(body: unknown): Promise<Produto> {
        try {
            // Validação com Zod
            const dadosValidados = createProdutoSchema.parse(body);

            // Verifica se a categoria existe
            const categoria = await this.categoriaRepository.findOneBy({ id: dadosValidados.categoriaId });
            if (!categoria) {
                throw new AppError(404, "Categoria não encontrada");
            }

            const novoProduto = this.produtoRepository.create({
                nome: dadosValidados.nome,
                descricao: dadosValidados.descricao ?? null,
                preco: dadosValidados.preco,
                estoque: dadosValidados.estoque,
                categoria: categoria
            });

            await this.produtoRepository.save(novoProduto);
            return novoProduto;
        } catch (error) {
            if (error instanceof ZodError) {
                const mensagens = error.issues.map((err) => err.message).join('; ');
                throw new AppError(400, `Validação falhou: ${mensagens}`);
            }
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Erro ao criar produto");
        }
    }

    /**
     * Atualiza um produto existente
     * @param id ID do produto
     * @param body Dados a serem atualizados
     */
    public async updateProduto(id: string, body: unknown): Promise<Produto> {
        try {
            // Validação com Zod
            const dadosValidados = updateProdutoSchema.parse(body);

            const produto = await this.produtoRepository.findOne({
                where: { id },
                relations: ['categoria']
            });

            if (!produto) {
                throw new AppError(404, "Produto não encontrado");
            }

            // Verifica se a nova categoria existe (se fornecida)
            if (dadosValidados.categoriaId) {
                const categoria = await this.categoriaRepository.findOneBy({ id: dadosValidados.categoriaId });
                if (!categoria) {
                    throw new AppError(404, "Categoria não encontrada");
                }
                produto.categoria = categoria;
            }

            // Atualiza apenas os campos fornecidos
            if (dadosValidados.nome) produto.nome = dadosValidados.nome;
            if (dadosValidados.descricao !== undefined) produto.descricao = dadosValidados.descricao ?? null;
            if (dadosValidados.preco !== undefined) produto.preco = dadosValidados.preco;
            if (dadosValidados.estoque !== undefined) produto.estoque = dadosValidados.estoque;

            await this.produtoRepository.save(produto);
            return produto;
        } catch (error) {
            if (error instanceof ZodError) {
                const mensagens = error.issues.map((err) => err.message).join('; ');
                throw new AppError(400, `Validação falhou: ${mensagens}`);
            }
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Erro ao atualizar produto");
        }
    }

    /**
     * Deleta um produto
     * @param id ID do produto
     */
    public async deleteProduto(id: string): Promise<void> {
        try {
            const produto = await this.produtoRepository.findOneBy({ id });

            if (!produto) {
                throw new AppError(404, "Produto não encontrado");
            }

            await this.produtoRepository.remove(produto);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Erro ao deletar produto");
        }
    }

    /**
     * Atualiza o estoque de um produto
     * @param id ID do produto
     * @param quantidade Quantidade a adicionar/remover (positivo ou negativo)
     */
    public async atualizarEstoque(id: string, quantidade: number): Promise<Produto> {
        try {
            const produto = await this.produtoRepository.findOneBy({ id });

            if (!produto) {
                throw new AppError(404, "Produto não encontrado");
            }

            const novoEstoque = produto.estoque + quantidade;
            if (novoEstoque < 0) {
                throw new AppError(400, "Estoque insuficiente");
            }

            produto.estoque = novoEstoque;
            await this.produtoRepository.save(produto);
            return produto;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Erro ao atualizar estoque");
        }
    }
}

export default ProdutoService;
