import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { 
  ProductQuery, 
  CreateProduct, 
  UpdateProduct,
  ProductResponse,
  ProductsResponse
} from '../types/product.types';
import { logger } from '../utils/logger';

/**
 * Controller para endpoints de produtos
 * Gerencia requisições HTTP e delega lógica de negócio para o ProductService
 */
export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * GET /api/v1/products
   * Lista produtos com filtros, ordenação e paginação
   */
  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as ProductQuery;
      const result = await this.productService.getProducts(query);

      const response: ProductsResponse = {
        success: true,
        data: result.products,
        pagination: result.pagination,
        message: `${result.products.length} produto(s) encontrado(s)`,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/products/:id
   * Obtém produto específico por ID
   */
  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      const response: ProductResponse = {
        success: true,
        data: product,
        message: 'Produto encontrado com sucesso',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/products
   * Cria novo produto
   */
  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productData = req.body as CreateProduct;
      const product = await this.productService.createProduct(productData);

      const response: ProductResponse = {
        success: true,
        data: product,
        message: 'Produto criado com sucesso',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/products/:id
   * Atualiza produto existente
   */
  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body as UpdateProduct;
      
      const product = await this.productService.updateProduct(id, updates);

      const response: ProductResponse = {
        success: true,
        data: product,
        message: 'Produto atualizado com sucesso',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/products/:id
   * Remove produto
   */
  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/products/statistics
   * Obtém estatísticas dos produtos
   */
  getStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.productService.getProductStatistics();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Estatísticas obtidas com sucesso',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/products/category/:category
   * Busca produtos por categoria
   */
  getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category } = req.params;
      const products = await this.productService.getProductsByCategory(category);

      const response: ProductsResponse = {
        success: true,
        data: products,
        pagination: {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1,
        },
        message: `${products.length} produto(s) encontrado(s) na categoria ${category}`,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/v1/products/:id/stock
   * Atualiza estoque do produto
   */
  updateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { quantity, operation } = req.body as { quantity: number; operation: 'add' | 'subtract' };

      if (!quantity || !operation) {
        res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Quantidade e operação são obrigatórias',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const product = await this.productService.updateProductStock(id, quantity, operation);

      const response: ProductResponse = {
        success: true,
        data: product,
        message: `Estoque ${operation === 'add' ? 'adicionado' : 'subtraído'} com sucesso`,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/products/search
   * Busca avançada de produtos
   */
  searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as ProductQuery;
      
      // Força a busca por texto se fornecido
      if (!query.search) {
        res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Parâmetro de busca é obrigatório',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await this.productService.getProducts(query);

      const response: ProductsResponse = {
        success: true,
        data: result.products,
        pagination: result.pagination,
        message: `${result.products.length} produto(s) encontrado(s) para "${query.search}"`,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}