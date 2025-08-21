import { randomUUID } from 'crypto';
import { DataService } from './dataService';
import { 
  Product, 
  CreateProduct, 
  UpdateProduct, 
  ProductQuery 
} from '../types/product.types';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

/**
 * Serviço de negócio para operações com produtos
 * Implementa regras de negócio e validações específicas
 */
export class ProductService {
  private dataService: DataService;

  constructor() {
    this.dataService = new DataService();
  }

  /**
   * Lista produtos com filtros, ordenação e paginação
   */
  async getProducts(query: ProductQuery): Promise<{
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { products, total } = await this.dataService.searchProducts({
      search: query.search,
      category: query.category,
      isActive: query.isActive,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page: query.page,
      limit: query.limit,
    });

    const totalPages = Math.ceil(total / query.limit);

    logger.info('Produtos listados', {
      total,
      page: query.page,
      limit: query.limit,
      filters: {
        search: query.search,
        category: query.category,
        isActive: query.isActive,
      },
    });

    return {
      products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Obtém produto por ID
   */
  async getProductById(id: string): Promise<Product> {
    const product = await this.dataService.getProductById(id);
    
    if (!product) {
      throw ApiError.notFound(`Produto com ID ${id} não encontrado`);
    }

    logger.debug('Produto encontrado', { id, name: product.name });
    return product;
  }

  /**
   * Cria novo produto
   */
  async createProduct(productData: CreateProduct): Promise<Product> {
    // Validações de negócio
    await this.validateProductName(productData.name);
    this.validateProductPrice(productData.price);
    this.validateProductStock(productData.stock);

    const now = new Date().toISOString();
    const product: Product = {
      id: randomUUID(),
      ...productData,
      isActive: productData.isActive ?? true,
      tags: productData.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };

    const createdProduct = await this.dataService.createProduct(product);
    
    logger.info('Produto criado com sucesso', {
      id: createdProduct.id,
      name: createdProduct.name,
      category: createdProduct.category,
      price: createdProduct.price,
    });

    return createdProduct;
  }

  /**
   * Atualiza produto existente
   */
  async updateProduct(id: string, updates: UpdateProduct): Promise<Product> {
    // Verifica se produto existe
    await this.getProductById(id);

    // Validações de negócio apenas para campos sendo atualizados
    if (updates.name !== undefined) {
      await this.validateProductName(updates.name, id);
    }

    if (updates.price !== undefined) {
      this.validateProductPrice(updates.price);
    }

    if (updates.stock !== undefined) {
      this.validateProductStock(updates.stock);
    }

    const updatedProduct = await this.dataService.updateProduct(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    logger.info('Produto atualizado com sucesso', {
      id,
      updatedFields: Object.keys(updates),
    });

    return updatedProduct;
  }

  /**
   * Remove produto
   */
  async deleteProduct(id: string): Promise<void> {
    // Verifica se produto existe
    await this.getProductById(id);

    await this.dataService.deleteProduct(id);
    
    logger.info('Produto removido com sucesso', { id });
  }

  /**
   * Obtém estatísticas dos produtos
   */
  async getProductStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    categories: Record<string, number>;
    averagePrice: number;
    lowStockProducts: Product[];
  }> {
    const stats = await this.dataService.getStatistics();
    
    // Adiciona produtos com estoque baixo (menos de 10 unidades)
    const allProducts = await this.dataService.getAllProducts();
    const lowStockProducts = allProducts.filter(p => p.stock < 10 && p.isActive);

    return {
      ...stats,
      lowStockProducts,
    };
  }

  /**
   * Busca produtos por categoria
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    const { products } = await this.dataService.searchProducts({
      category,
      isActive: true,
    });

    logger.debug('Produtos buscados por categoria', { category, count: products.length });
    return products;
  }

  /**
   * Atualiza estoque do produto
   */
  async updateProductStock(id: string, quantity: number, operation: 'add' | 'subtract'): Promise<Product> {
    const product = await this.getProductById(id);
    
    let newStock: number;
    if (operation === 'add') {
      newStock = product.stock + quantity;
    } else {
      newStock = product.stock - quantity;
      if (newStock < 0) {
        throw ApiError.badRequest('Estoque não pode ficar negativo');
      }
    }

    const updatedProduct = await this.updateProduct(id, { stock: newStock });
    
    logger.info('Estoque atualizado', {
      id,
      operation,
      quantity,
      previousStock: product.stock,
      newStock,
    });

    return updatedProduct;
  }

  /**
   * Validações de negócio
   */
  private async validateProductName(name: string, excludeId?: string): Promise<void> {
    const allProducts = await this.dataService.getAllProducts();
    const duplicateName = allProducts.find(p => 
      p.name.toLowerCase() === name.toLowerCase() && p.id !== excludeId
    );

    if (duplicateName) {
      throw ApiError.conflict('Já existe um produto com este nome');
    }
  }

  private validateProductPrice(price: number): void {
    if (price <= 0) {
      throw ApiError.badRequest('Preço deve ser maior que zero');
    }

    if (price > 999999.99) {
      throw ApiError.badRequest('Preço não pode exceder R$ 999.999,99');
    }
  }

  private validateProductStock(stock: number): void {
    if (stock < 0) {
      throw ApiError.badRequest('Estoque não pode ser negativo');
    }

    if (!Number.isInteger(stock)) {
      throw ApiError.badRequest('Estoque deve ser um número inteiro');
    }
  }
}