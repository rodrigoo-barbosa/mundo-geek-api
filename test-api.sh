#!/bin/bash

# Mundo Geek API - Script de Teste Rápido
# Este script testa os endpoints principais da API

API="http://localhost:3000"
CATEGORY_ID=""
PRODUCT_ID=""

echo "🚀 Testando Mundo Geek API"
echo "================================"

# 1. Health Check
echo -e "\n1️⃣ Health Check"
curl -s "$API/api/health" | jq .

# 2. Criar Categoria
echo -e "\n\n2️⃣ Criando Categoria"
RESPONSE=$(curl -s -X POST "$API/api/categorias" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Action Figures",
    "descricao": "Coleção de bonecos articulados"
  }')
echo "$RESPONSE" | jq .
CATEGORY_ID=$(echo "$RESPONSE" | jq -r '.data.id')
echo "📌 Category ID: $CATEGORY_ID"

# 3. Listar Categorias
echo -e "\n\n3️⃣ Listando Categorias"
curl -s "$API/api/categorias" | jq '.data[0]'

# 4. Obter Categoria por ID
echo -e "\n\n4️⃣ Obtendo Categoria por ID"
curl -s "$API/api/categorias/$CATEGORY_ID" | jq '.data | {id, nome, descricao}'

# 5. Criar Produto
echo -e "\n\n5️⃣ Criando Produto"
RESPONSE=$(curl -s -X POST "$API/api/produtos" \
  -H "Content-Type: application/json" \
  -d "{
    \"nome\": \"Homem de Ferro\",
    \"descricao\": \"Figure articulada MCU\",
    \"preco\": 150.00,
    \"estoque\": 10,
    \"categoriaId\": \"$CATEGORY_ID\"
  }")
echo "$RESPONSE" | jq '.data | {id, nome, preco, estoque}'
PRODUCT_ID=$(echo "$RESPONSE" | jq -r '.data.id')
echo "📌 Product ID: $PRODUCT_ID"

# 6. Listar Produtos
echo -e "\n\n6️⃣ Listando Produtos"
curl -s "$API/api/produtos" | jq '.data[0] | {id, nome, preco, estoque}'

# 7. Obter Produto por ID
echo -e "\n\n7️⃣ Obtendo Produto por ID"
curl -s "$API/api/produtos/$PRODUCT_ID" | jq '.data | {id, nome, preco, estoque}'

# 8. Listar Produtos por Categoria
echo -e "\n\n8️⃣ Listando Produtos por Categoria"
curl -s "$API/api/categorias/$CATEGORY_ID/produtos" | jq '.data[0] | {id, nome, preco}'

# 9. Atualizar Produto
echo -e "\n\n9️⃣ Atualizando Produto"
curl -s -X PUT "$API/api/produtos/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "preco": 180.00,
    "estoque": 15
  }' | jq '.data | {id, nome, preco, estoque}'

# 10. Atualizar Estoque
echo -e "\n\n🔟 Atualizando Estoque (+5)"
curl -s -X PATCH "$API/api/produtos/$PRODUCT_ID/estoque" \
  -H "Content-Type: application/json" \
  -d '{
    "quantidade": 5
  }' | jq '.data | {estoque}'

# 11. Atualizar Categoria
echo -e "\n\n1️⃣1️⃣ Atualizando Categoria"
curl -s -X PUT "$API/api/categorias/$CATEGORY_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Action Figures Premium"
  }' | jq '.data | {id, nome, descricao}'

echo -e "\n\n================================"
echo "✅ Testes Concluídos!"
echo "================================"
