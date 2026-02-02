import express from 'express';
import type { Express, Request, Response } from 'express';
import 'dotenv/config';
import { appDataSource } from './database/appDataSource.js';
import categoriaRouter from './routes/categoriaRoutes.js';
import produtoRouter from './routes/produtoRoutes.js';
import { AppError } from './errors/AppError.js';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar banco de dados
appDataSource
    .initialize()
    .then(() => {
        console.log("✅ Banco de dados conectado com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao conectar ao banco de dados:", error);
        process.exit(1);
    });

// Rotas
app.use('/api/categorias', categoriaRouter);
app.use('/api/produtos', produtoRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        statusCode: 200,
        message: "API está funcionando corretamente",
        timestamp: new Date().toISOString()
    });
});

// Rota raiz
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        statusCode: 200,
        message: "Bem-vindo à Mundo Geek API",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

// Tratamento de erro 404
app.use((req: Request, res: Response) => {
    res.status(404).json({
        statusCode: 404,
        message: "Rota não encontrada",
        timestamp: new Date().toISOString()
    });
});

// Middleware de erro global
app.use((error: any, req: Request, res: Response, _next: any) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            statusCode: error.statusCode,
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }

    console.error("Erro não tratado:", error);
    res.status(500).json({
        statusCode: 500,
        message: "Erro interno do servidor",
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 Documentação das rotas disponível em http://localhost:${PORT}/api/health`);
});
