# Product API - Sistema Profissional de Gerenciamento de Produtos

> API REST moderna desenvolvida com Node.js, TypeScript, Express e padrões enterprise para gerenciamento completo de produtos.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Índice

- [Características](#-características)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação Completa](#-instalação-completa)
- [Configuração](#-configuração)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Testando com Postman](#-testando-com-postman)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Stack Tecnológica](#-stack-tecnológica)
- [Testes](#-testes)
- [Deploy](#-deploy)

## 🚀 Características

### ✅ **Padrões Enterprise Implementados**
- **Arquitetura em Camadas**: Controller → Service → Repository
- **TypeScript**: Tipagem estática completa
- **Validação Robusta**: Schemas Zod com validação de entrada
- **Tratamento de Erros**: Sistema centralizado de error handling
- **Logging Estruturado**: Logs com níveis e contexto
- **Rate Limiting**: Proteção contra DDoS e spam
- **Segurança**: CORS, Helmet, validação de entrada
- **Cache**: Sistema de cache em memória com TTL
- **Backup Automático**: Sistema de backup e recuperação de dados
- **Testes**: Suite completa com Jest e Supertest

### 🔧 **Funcionalidades**
- ✅ CRUD completo de produtos
- ✅ Busca avançada com filtros
- ✅ Paginação e ordenação
- ✅ Gestão de estoque
- ✅ Estatísticas e relatórios
- ✅ Validação de dados rigorosa
- ✅ Health check e monitoramento
- ✅ API RESTful com status codes corretos

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 8.0.0 (incluído com Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Postman** (opcional - para testes) ([Download](https://www.postman.com/))

### Verificar instalação:
```bash
node --version    # Deve mostrar v18.0.0 ou superior
npm --version     # Deve mostrar 8.0.0 ou superior
git --version     # Qualquer versão recente
```

## 🛠️ Instalação Completa

### 1. **Clone o Repositório**
```bash
git clone https://github.com/davigasparino/MercadoLivre.git
cd product-api
```

### 2. **Instale as Dependências**
```bash
npm install
```

Aguarde a instalação de todas as dependências (pode levar alguns minutos na primeira vez).

### 3. **Configure o Ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# No Windows (se o comando acima não funcionar):
copy .env.example .env
```

### 4. **Verifique a Estrutura**
```bash
# Sua estrutura deve estar assim:
tree -I node_modules
```

```
product-api/
├── src/
│   ├── controllers/
│   │   └── productController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/
│   │   └── productRoutes.ts
│   ├── services/
│   │   ├── dataService.ts
│   │   └── productService.ts
│   ├── types/
│   │   └── product.types.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   └── logger.ts
│   ├── __tests__/
│   │   ├── setup.ts
│   │   └── productController.test.ts
│   └── app.ts
├── data/
│   └── products.json
├── postman-collection.json  ← Collection do Postman
├── package.json
├── tsconfig.json
├── .env.example
├── .env
└── README.md
```

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

O arquivo `.env` já está configurado com valores padrão. Você pode personalizar:

```env
# Configuração do Servidor
PORT=3000                          # Porta da aplicação
NODE_ENV=development               # Ambiente (development/production)

# Configuração da API
API_VERSION=v1                     # Versão da API
API_PREFIX=/api                    # Prefixo das rotas

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000       # Janela de tempo (15 min)
RATE_LIMIT_MAX_REQUESTS=100       # Máximo de requests por IP

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=info                    # error, warn, info, debug
```

## 🚀 Executando a Aplicação

### Modo Desenvolvimento (Recomendado)
```bash
npm run dev
```

**Saída esperada:**
```
🚀 Servidor rodando na porta 3000
📚 API disponível em: http://localhost:3000/api/v1
🔍 Health check: http://localhost:3000/health
🌍 Ambiente: development
```

### Modo Produção
```bash
npm run build
npm start
```

### Outros Comandos Úteis
```bash
npm test              # Executar testes
npm run test:watch    # Testes em modo watch
npm run test:coverage # Testes com coverage
npm run lint          # Verificar código
npm run lint:fix      # Corrigir problemas automaticamente
npm run format        # Formatar código com Prettier
```

## 📨 Testando com Postman

### 1. **Importar Collection**

1. Abra o Postman
2. Clique em **"Import"** (canto superior esquerdo)
3. Selecione **"Upload Files"**
4. Navegue até a pasta do projeto e selecione: `Product-API.postman_collection.json`
5. Clique em **"Import"**

### 2. **Configurar Environment (Opcional)**

1. Clique no ícone de **"Environment"** (canto superior direito)
2. Clique em **"+"** para criar novo environment
3. Nome: `Product API Local`
4. Adicione a variável:
   - **Variable**: `baseUrl`
   - **Initial Value**: `http://localhost:3000`
   - **Current Value**: `http://localhost:3000`
5. Clique em **"Save"**
6. Selecione o environment criado no dropdown

### 3. **Sequência de Testes Recomendada**

Execute os endpoints nesta ordem para testar todas as funcionalidades:

#### **Passo 1: Verificações Básicas**
1. ✅ `Health Check` - Confirma que a API está funcionando
2. ✅ `API Info` - Informações gerais da API

#### **Passo 2: Operações de Leitura**
3. ✅ `Listar Produtos` - Vê produtos existentes (dados de exemplo)
4. ✅ `Obter Produto por ID` - Busca produto específico
5. ✅ `Estatísticas dos Produtos` - Relatórios e métricas

#### **Passo 3: Operações de Escrita**
6. ✅ `Criar Produto` - Adiciona novo produto
7. ✅ `Atualizar Produto` - Modifica produto existente
8. ✅ `Adicionar Estoque` - Gerencia estoque

#### **Passo 4: Buscas e Filtros**
9. ✅ `Buscar por Categoria` - Filtra por categoria
10. ✅ `Busca Avançada` - Busca por texto
11. ✅ `Produtos com Paginação` - Testa paginação

#### **Passo 5: Testes de Validação**
12. ✅ `Criar Produto - Dados Inválidos` - Testa validação
13. ✅ `Obter Produto - ID Inválido` - Testa UUID inválido
14. ✅ `Produto Não Encontrado` - Testa 404

### 4. **Dicas para Uso no Postman**

- **IDs dos Produtos**: Use os IDs dos produtos de exemplo ou os retornados na criação
- **Produtos de Exemplo**: A API já vem com 10 produtos pré-cadastrados
- **Status Codes**: Observe os códigos de status retornados (200, 201, 404, 422, etc.)
- **Headers**: Os headers corretos já estão configurados na collection

## 📚 Documentação da API

### Base URL
```
http://localhost:3000/api/v1
```

### Headers Padrão
```http
Content-Type: application/json
```

---

## 🛣️ Endpoints Detalhados

### **1. Health & Info**

#### `GET /health`
**Descrição**: Verifica se a API está funcionando  
**Autenticação**: Não requerida  

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-08-21T17:13:56.629Z",
  "version": "1.0.0",
  "environment": "development"
}
```

#### `GET /`
**Descrição**: Informações gerais da API  
**Response**:
```json
{
  "name": "Product API",
  "version": "1.0.0",
  "description": "API moderna para gerenciamento de produtos",
  "endpoints": {
    "health": "/health",
    "products": "/api/v1/products"
  }
}
```

---

### **2. Produtos - CRUD**

#### `GET /api/v1/products`
**Descrição**: Lista produtos com filtros, ordenação e paginação

**Query Parameters**:
| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `page` | number | 1 | Página atual |
| `limit` | number | 10 | Itens por página (máx: 100) |
| `category` | string | - | Filtrar por categoria |
| `search` | string | - | Buscar em nome, descrição e tags |
| `sortBy` | string | createdAt | Campo de ordenação: name, price, createdAt |
| `sortOrder` | string | desc | Ordem: asc, desc |
| `isActive` | boolean | - | Filtrar por status ativo |

**Exemplos**:
```bash
GET /api/v1/products
GET /api/v1/products?page=2&limit=5
GET /api/v1/products?category=Eletrônicos&sortBy=price&sortOrder=asc
GET /api/v1/products?search=iPhone&page=1
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "iPhone 15 Pro",
      "description": "O mais avançado iPhone com chip A17 Pro",
      "price": 7999.99,
      "category": "Eletrônicos",
      "stock": 15,
      "imageUrl": "https://example.com/iphone15pro.jpg",
      "tags": ["smartphone", "apple", "5g"],
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "totalPages": 1
  },
  "message": "10 produto(s) encontrado(s)"
}
```

#### `GET /api/v1/products/:id`
**Descrição**: Obtém produto específico por ID

**Parameters**:
- `id` (UUID): ID único do produto

**Response Sucesso**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "iPhone 15 Pro",
    "description": "O mais avançado iPhone",
    "price": 7999.99,
    "category": "Eletrônicos",
    "stock": 15,
    "imageUrl": "https://example.com/iphone15pro.jpg",
    "tags": ["smartphone", "apple"],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Produto encontrado com sucesso"
}
```

**Response Erro (404)**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Produto com ID xyz não encontrado"
  },
  "timestamp": "2024-08-21T17:13:56.629Z"
}
```

#### `POST /api/v1/products`
**Descrição**: Cria novo produto

**Body (JSON)**:
```json
{
  "name": "Produto Exemplo",
  "description": "Descrição detalhada do produto",
  "price": 299.99,
  "category": "Eletrônicos",
  "stock": 50,
  "imageUrl": "https://example.com/produto.jpg",
  "tags": ["exemplo", "teste"],
  "isActive": true
}
```

**Campos Obrigatórios**:
- `name` (string): Nome do produto
- `description` (string): Descrição do produto  
- `price` (number): Preço (> 0)
- `category` (string): Categoria do produto
- `stock` (number): Quantidade em estoque (>= 0)

**Campos Opcionais**:
- `imageUrl` (string): URL da imagem
- `tags` (array): Array de tags
- `isActive` (boolean): Status ativo (padrão: true)

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "name": "Produto Exemplo",
    "description": "Descrição detalhada do produto",
    "price": 299.99,
    "category": "Eletrônicos",
    "stock": 50,
    "imageUrl": "https://example.com/produto.jpg",
    "tags": ["exemplo", "teste"],
    "isActive": true,
    "createdAt": "2024-08-21T17:13:56.629Z",
    "updatedAt": "2024-08-21T17:13:56.629Z"
  },
  "message": "Produto criado com sucesso"
}
```

#### `PUT /api/v1/products/:id`
**Descrição**: Atualiza produto existente

**Body (JSON)** - Todos os campos são opcionais:
```json
{
  "name": "Nome Atualizado",
  "description": "Nova descrição",
  "price": 399.99,
  "stock": 25
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Nome Atualizado",
    "description": "Nova descrição",
    "price": 399.99,
    "category": "Eletrônicos",
    "stock": 25,
    "imageUrl": "https://example.com/produto.jpg",
    "tags": ["exemplo", "teste"],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-08-21T17:13:56.629Z"
  },
  "message": "Produto atualizado com sucesso"
}
```

#### `DELETE /api/v1/products/:id`
**Descrição**: Remove produto

**Response (204)**: Sem conteúdo (sucesso)

---

### **3. Buscas e Filtros**

#### `GET /api/v1/products/search?search=termo`
**Descrição**: Busca avançada por termo

**Query Parameters**:
- `search` (string, obrigatório): Termo de busca
- Demais parâmetros iguais ao endpoint de listagem

**Funcionalidade**: Busca em:
- Nome do produto
- Descrição
- Tags

#### `GET /api/v1/products/category/:category`
**Descrição**: Produtos de uma categoria específica

**Parameters**:
- `category` (string): Nome da categoria

**Exemplo**:
```bash
GET /api/v1/products/category/Eletrônicos
GET /api/v1/products/category/Games
```

---

### **4. Operações Especiais**

#### `GET /api/v1/products/statistics`
**Descrição**: Estatísticas e relatórios dos produtos

**Response**:
```json
{
  "success": true,
  "data": {
    "total": 10,
    "active": 10,
    "inactive": 0,
    "categories": {
      "Eletrônicos": 7,
      "Games": 2,
      "Wearables": 1
    },
    "averagePrice": 4959.99,
    "lowStockProducts": [
      {
        "id": "uuid",
        "name": "Produto com Pouco Estoque",
        "stock": 5
      }
    ]
  },
  "message": "Estatísticas obtidas com sucesso"
}
```

#### `PATCH /api/v1/products/:id/stock`
**Descrição**: Atualiza estoque do produto

**Body (JSON)**:
```json
{
  "quantity": 5,
  "operation": "add"
}
```

**Operações Disponíveis**:
- `add`: Adiciona ao estoque
- `subtract`: Remove do estoque

**Validações**:
- Quantidade deve ser positiva
- Operação subtract não pode deixar estoque negativo

---

### **5. Códigos de Status HTTP**

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| 200 | OK | Operação bem-sucedida |
| 201 | Created | Produto criado com sucesso |
| 204 | No Content | Produto removido com sucesso |
| 400 | Bad Request | UUID inválido ou parâmetros incorretos |
| 404 | Not Found | Produto não encontrado |
| 409 | Conflict | Produto com nome duplicado |
| 422 | Unprocessable Entity | Dados de entrada inválidos |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Erro interno do servidor |

---

### **6. Formato de Erros**

Todos os erros seguem o padrão:

```json
{
  "success": false,
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem descritiva do erro",
    "details": {
      "campo": "informações adicionais"
    }
  },
  "timestamp": "2024-08-21T17:13:56.629Z"
}
```

**Exemplo - Erro de Validação**:
```json
{
  "success": false,
  "error": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Dados de entrada inválidos",
    "details": [
      {
        "field": "name",
        "message": "Nome é obrigatório",
        "received": ""
      },
      {
        "field": "price",
        "message": "Preço deve ser positivo",
        "received": -10
      }
    ]
  },
  "timestamp": "2024-08-21T17:13:56.629Z"
}
```

## 🏗️ Estrutura do Projeto

### **Arquitetura em Camadas**

```
┌─────────────────┐
│   Controller    │  ← HTTP Requests/Responses
├─────────────────┤
│    Service      │  ← Business Logic
├─────────────────┤
│   Data Layer    │  ← Data Persistence
├─────────────────┤
│   JSON Files    │  ← Data Storage
└─────────────────┘
```

### **Responsabilidades**

#### **Controllers** (`src/controllers/`)
- Gerencia requisições HTTP
- Validação de entrada via middlewares
- Formatação de respostas
- Delegação para services

#### **Services** (`src/services/`)
- **ProductService**: Regras de negócio, validações específicas
- **DataService**: Persistência, cache, backup automático

#### **Middleware** (`src/middleware/`)
- **validation.ts**: Validação com Zod schemas
- **errorHandler.ts**: Tratamento centralizado de erros

#### **Types** (`src/types/`)
- Definições TypeScript
- Schemas de validação Zod
- Interfaces de response

#### **Utils** (`src/utils/`)
- **ApiError**: Classe customizada de erros
- **logger**: Sistema de logging estruturado

## 🧪 Testes

### **Executar Testes**

```bash
# Todos os testes
npm test

# Modo watch (reexecuta ao alterar arquivos)
npm run test:watch

# Com relatório de coverage
npm run test:coverage
```

### **Tipos de Teste**

1. **Unit Tests**: Testam funções isoladas
2. **Integration Tests**: Testam endpoints completos
3. **Validation Tests**: Testam schemas e validações

### **Coverage Esperado**
- Controllers: >90%
- Services: >95%
- Utils: >85%

## 🔧 Stack Tecnológica

### **Runtime & Language**
- **Node.js 18+**: Runtime JavaScript
- **TypeScript 5.3+**: Superset tipado do JavaScript

### **Framework & Core**
- **Express.js 4.18+**: Framework web minimalista
- **Zod 3.22+**: Schema validation library

### **Segurança & Performance**
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing  
- **Express Rate Limit**: Rate limiting
- **Compression**: Gzip compression

### **Desenvolvimento & Qualidade**
- **TSX**: TypeScript execution engine
- **ESLint**: Linting e análise estática
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Supertest**: HTTP testing

### **Logging & Monitoramento**
- **Morgan**: HTTP request logging
- **Custom Logger**: Sistema estruturado de logs

## 🚀 Deploy

### **Preparação para Produção**

1. **Build da aplicação**:
```bash
npm run build
```

2. **Configurar variáveis de ambiente**:
```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn
CORS_ORIGIN=https://seudominio.com
```

3. **Instalar apenas dependências de produção**:
```bash
npm ci --only=production
```

4. **Executar**:
```bash
npm start
```

### **Estrutura após Build**
```
dist/           ← Código compilado JavaScript
├── controllers/
├── services/
├── middleware/
├── utils/
└── app.js     ← Entry point
```

### **Health Check para Produção**
```bash
curl https://seudominio.com/health
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📞 Suporte

- **Documentação**: Este README
- **Issues**: Use o sistema de issues do repositório
- **API Collection**: Importe `Product-API.postman_collection.json` no Postman

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🎯 Próximos Passos

Agora que você tem a API rodando:

1. ✅ **Importe a collection no Postman**
2. ✅ **Execute os testes na sequência recomendada**
3. ✅ **Explore todas as funcionalidades**
4. ✅ **Execute os testes automatizados**: `npm test`
5. ✅ **Personalize conforme suas necessidades**

**Sua API está pronta para uso profissional!** 🚀