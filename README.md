# Mundo Geek API

API RESTful para gerenciamento de categorias e produtos da loja Mundo Geek, desenvolvida com TypeScript, Express, TypeORM e PostgreSQL.

## 🚀 Tecnologias

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **Framework Web**: Express.js
- **ORM**: TypeORM
- **Banco de Dados**: PostgreSQL
- **Validação**: Zod
- **Desenvolvimento**: Nodemon + tsx

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repositorio-url>
cd mundo-geek-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais do PostgreSQL:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=mundo_geek
NODE_ENV=development
PORT=3000
```

5. Crie o banco de dados:
```bash
# No PostgreSQL
createdb mundo_geek
```

## 🏃 Executar o Projeto

### Modo Desenvolvimento
```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`

## 📚 Estrutura do Projeto

```
src/
├── config/          # Configurações gerais
├── controllers/     # Controladores HTTP
├── database/        # Configuração do banco de dados
├── entities/        # Entidades TypeORM (Categoria, Produto)
├── errors/          # Classes de erro customizadas
├── middleware/      # Middlewares Express
├── routes/          # Rotas da API
├── services/        # Lógica de negócio
├── validates/       # Schemas de validação Zod
└── server.ts        # Arquivo principal
```

## 🔌 Endpoints da API

### Categorias

#### Listar todas as categorias
```
GET /api/categorias
```

**Resposta (200)**:
```json
{
  "statusCode": 200,
  "message": "Categorias encontradas com sucesso",
  "data": [
    {
      "id": "uuid",
      "nome": "Jogos de Tabuleiro",
      "descricao": "Jogos para diversão em família",
      "dataCriacao": "2026-02-02T10:00:00.000Z",
      "dataAtualizacao": "2026-02-02T10:00:00.000Z",
      "produtos": []
    }
  ],
  "timestamp": "2026-02-02T10:00:00.000Z"
}
```

#### Obter categoria por ID
```
GET /api/categorias/:id
```

#### Criar nova categoria
```
POST /api/categorias
Content-Type: application/json

{
  "nome": "Jogos de Tabuleiro",
  "descricao": "Jogos para diversão em família"
}
```

**Validações**:
- `nome`: obrigatório, máx 100 caracteres, único
- `descricao`: opcional, máx 500 caracteres

#### Atualizar categoria
```
PUT /api/categorias/:id
Content-Type: application/json

{
  "nome": "Novos Jogos",
  "descricao": "Descrição atualizada"
}
```

#### Deletar categoria
```
DELETE /api/categorias/:id
```

⚠️ Não é possível deletar categorias que possuem produtos associados.

### Produtos

#### Listar todos os produtos
```
GET /api/produtos
```

#### Obter produto por ID
```
GET /api/produtos/:id
```

#### Listar produtos por categoria
```
GET /api/categorias/:categoriaId/produtos
```

#### Criar novo produto
```
POST /api/produtos
Content-Type: application/json

{
  "nome": "Catan",
  "descricao": "Jogo estratégico de construção",
  "preco": 89.90,
  "estoque": 15,
  "categoriaId": "uuid-da-categoria"
}
```

**Validações**:
- `nome`: obrigatório, máx 255 caracteres
- `descricao`: opcional, máx 500 caracteres
- `preco`: obrigatório, deve ser > 0
- `estoque`: obrigatório, deve ser >= 0
- `categoriaId`: obrigatório, deve ser UUID válido

#### Atualizar produto
```
PUT /api/produtos/:id
Content-Type: application/json

{
  "nome": "Catan - Edição Premium",
  "preco": 99.90,
  "estoque": 20
}
```

#### Deletar produto
```
DELETE /api/produtos/:id
```

#### Atualizar estoque
```
PATCH /api/produtos/:id/estoque
Content-Type: application/json

{
  "quantidade": 5  // positivo para adicionar, negativo para remover
}
```

## ✅ Health Check

```
GET /api/health
```

## 🛡️ Tratamento de Erros

Todos os erros seguem o padrão:
```json
{
  "statusCode": 400,
  "message": "Descrição do erro",
  "timestamp": "2026-02-02T10:00:00.000Z"
}
```

**Códigos HTTP**:
- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Erro de validação
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor

## 🎯 Relacionamento 1:N

Uma Categoria pode ter muitos Produtos, mas um Produto pertence a apenas uma Categoria.

**Propriedades**:
- Cascade delete configurado (deleter uma categoria deleta seus produtos)
- Relacionamento eager loading para melhor performance

## 📝 Exemplo de Fluxo Completo

1. **Criar categoria**:
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ação","descricao":"Action Figures"}'
```

2. **Criar produto** (use o ID da categoria retornado):
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome":"Homem de Ferro",
    "descricao":"Figure articulada",
    "preco":150.00,
    "estoque":10,
    "categoriaId":"<category-id>"
  }'
```

3. **Listar produtos da categoria**:
```bash
curl http://localhost:3000/api/categorias/<category-id>/produtos
```

## 🧪 Testes

```bash
npm test
```

## 📦 Deploy

Certifique-se de:
- Criar arquivo `.env` com variáveis corretas
- Ter PostgreSQL funcionando
- Executar as migrations (caso existam)

```bash
npm run dev
```

## 📄 Licença

ISC

## 👤 Autor

Desenvolvido para Sr. Osvaldo - Mundo Geek
