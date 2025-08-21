# 🚀 Como Rodar e Testar a API

## Passo a Passo Completo

### 1. Preparar o Ambiente

```bash
# Navegar para a pasta do projeto
cd product-api

# Instalar dependências
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# O arquivo .env já está configurado com valores padrão
```

### 3. Iniciar a Aplicação

```bash
# Modo desenvolvimento (recomendado)
npm run dev
```

**Saída esperada:**
```
🚀 Servidor rodando na porta 3000
📚 API disponível em: http://localhost:3000/api/v1
🔍 Health check: http://localhost:3000/health
🌍 Ambiente: development
```

### 4. Testar a API

#### 4.1 Health Check
```bash
curl http://localhost:3000/health
```

#### 4.2 Listar Produtos
```bash
curl http://localhost:3000/api/v1/products
```

#### 4.3 Criar um Produto
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Produto",
    "description": "Produto de teste",
    "price": 99.99,
    "category": "Teste",
    "stock": 10
  }'
```

#### 4.4 Buscar por ID
```bash
# Use o ID retornado na criação
curl http://localhost:3000/api/v1/products/[ID_DO_PRODUTO]
```

#### 4.5 Estatísticas
```bash
curl http://localhost:3000/api/v1/products/statistics
```

### 5. Executar Testes

```bash
# Todos os testes
npm test

# Testes com coverage
npm run test:coverage
```

### 6. Testar com Ferramentas

#### Postman/Insomnia
- **Base URL**: `http://localhost:3000/api/v1`
- **Headers**: `Content-Type: application/json`

#### Thunder Client (VS Code)
1. Instalar extensão Thunder Client
2. Criar collection com base URL
3. Testar endpoints

### 7. Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia com hot reload

# Build
npm run build        # Compila TypeScript
npm start           # Inicia versão buildada

# Qualidade de código
npm run lint        # Verifica problemas
npm run lint:fix    # Corrige problemas
npm run format      # Formata código

# Testes
npm test           #