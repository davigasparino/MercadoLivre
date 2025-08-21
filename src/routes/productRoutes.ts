import { Router } from 'express';
import { z } from 'zod';
import { ProductController } from '../controllers/productController';
import { validate, validateUUID } from '../middleware/validation';
import { 
  CreateProductSchema, 
  UpdateProductSchema, 
  ProductQuerySchema 
} from '../types/product.types';

/**
 * Definição das rotas para produtos
 * Inclui validações, middlewares e documentação dos endpoints
 */

const router = Router();
const productController = new ProductController();

// Schema para validação de parâmetros de rota
const ProductParamsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

const CategoryParamsSchema = z.object({
  category: z.string().min(1, 'Categoria é obrigatória'),
});

const StockUpdateSchema = z.object({
  quantity: z.number().int().positive('Quantidade deve ser um número positivo'),
  operation: z.enum(['add', 'subtract'], {
    errorMap: () => ({ message: 'Operação deve ser "add" ou "subtract"' }),
  }),
});

/**
 * @route GET /api/v1/products
 * @desc Lista produtos com filtros, ordenação e paginação
 * @query {number} page - Página (padrão: 1)
 * @query {number} limit - Itens por página (padrão: 10, máx: 100)
 * @query {string} category - Filtrar por categoria
 * @query {string} search - Buscar em nome, descrição e tags
 * @query {string} sortBy - Ordenar por: name, price, createdAt (padrão: createdAt)
 * @query {string} sortOrder - Ordem: asc, desc (padrão: desc)
 * @query {boolean} isActive - Filtrar por status ativo
 */
router.get(
  '/',
  validate({ query: ProductQuerySchema }),
  productController.getProducts
);

/**
 * @route GET /api/v1/products/statistics
 * @desc Obtém estatísticas dos produtos
 * @returns {Object} Estatísticas gerais dos produtos
 */
router.get('/statistics', productController.getStatistics);

/**
 * @route GET /api/v1/products/search
 * @desc Busca avançada de produtos (requer parâmetro search)
 * @query {string} search - Termo de busca (obrigatório)
 * @query {number} page - Página
 * @query {number} limit - Itens por página
 */
router.get(
  '/search',
  validate({ query: ProductQuerySchema }),
  productController.searchProducts
);

/**
 * @route GET /api/v1/products/category/:category
 * @desc Busca produtos por categoria específica
 * @param {string} category - Nome da categoria
 */
router.get(
  '/category/:category',
  validate({ params: CategoryParamsSchema }),
  productController.getProductsByCategory
);

/**
 * @route GET /api/v1/products/:id
 * @desc Obtém produto específico por ID
 * @param {string} id - UUID do produto
 */
router.get(
  '/:id',
  validateUUID('id'),
  validate({ params: ProductParamsSchema }),
  productController.getProductById
);

/**
 * @route POST /api/v1/products
 * @desc Cria novo produto
 * @body {Object} product - Dados do produto
 */
router.post(
  '/',
  validate({ body: CreateProductSchema }),
  productController.createProduct
);

/**
 * @route PUT /api/v1/products/:id
 * @desc Atualiza produto existente
 * @param {string} id - UUID do produto
 * @body {Object} updates - Dados para atualização
 */
router.put(
  '/:id',
  validateUUID('id'),
  validate({ 
    params: ProductParamsSchema,
    body: UpdateProductSchema 
  }),
  productController.updateProduct
);

/**
 * @route PATCH /api/v1/products/:id/stock
 * @desc Atualiza estoque do produto
 * @param {string} id - UUID do produto
 * @body {Object} stockUpdate - Operação de estoque
 */
router.patch(
  '/:id/stock',
  validateUUID('id'),
  validate({ 
    params: ProductParamsSchema,
    body: StockUpdateSchema 
  }),
  productController.updateStock
);

/**
 * @route DELETE /api/v1/products/:id
 * @desc Remove produto
 * @param {string} id - UUID do produto
 */
router.delete(
  '/:id',
  validateUUID('id'),
  validate({ params: ProductParamsSchema }),
  productController.deleteProduct
);

export { router as productRoutes };