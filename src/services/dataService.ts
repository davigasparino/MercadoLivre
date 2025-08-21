import * as fs from 'fs/promises';
import * as path from 'path';
import { Product } from '../types/product.types';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';

/**
 * Serviço responsável pela persistência de dados em arquivo JSON
 * Implementa operações CRUD com sistema de backup e recuperação
 */

export class DataService {
  private readonly dataPath: string;
  private readonly backupPath: string;
  private cache: Product[] | null = null;
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutos
  private cacheTimestamp: number = 0;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'products.json');
    this.backupPath = path.join(process.cwd(), 'data', 'products.backup.json');
    this.ensureDataDirectory();
  }

  /**
   * Garante que o diretório de dados existe
   */
  private async ensureDataDirectory(): Promise<void> {
    const dataDir = path.dirname(this.dataPath);
    
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
      logger.info('Diretório de dados criado', { path: dataDir });
    }
  }

  /**
   * Verifica se o cache ainda é válido
   */
  private isCacheValid(): boolean {
    return this.cache !== null && 
           (Date.now() - this.cacheTimestamp) < this.cacheTimeout;
  }

  /**
   * Lê os dados do arquivo JSON
   */
  private async readFromFile(): Promise<Product[]> {
    try {
      await fs.access(this.dataPath);
      const data = await fs.readFile(this.dataPath, 'utf-8');
      const products = JSON.parse(data) as Product[];
      
      // Atualiza o cache
      this.cache = products;
      this.cacheTimestamp = Date.now();
      
      return products;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // Arquivo não existe, cria um array vazio
        logger.info('Arquivo de dados não encontrado, criando novo');
        return this.initializeEmptyData();
      }
      
      logger.error('Erro ao ler arquivo de dados', error);
      
      // Tenta recuperar do backup
      return this.recoverFromBackup();
    }
  }

  /**
   * Inicializa arquivo de dados vazio
   */
  private async initializeEmptyData(): Promise<Product[]> {
    const emptyData: Product[] = [];
    await this.writeToFile(emptyData);
    return emptyData;
  }

  /**
   * Recupera dados do arquivo de backup
   */
  private async recoverFromBackup(): Promise<Product[]> {
    try {
      await fs.access(this.backupPath);
      const backupData = await fs.readFile(this.backupPath, 'utf-8');
      const products = JSON.parse(backupData) as Product[];
      
      logger.info('Dados recuperados do backup');
      
      // Restaura o arquivo principal
      await this.writeToFile(products);
      
      return products;
    } catch {
      logger.error('Falha ao recuperar backup, inicializando dados vazios');
      return this.initializeEmptyData();
    }
  }

  /**
   * Escreve dados no arquivo JSON com backup automático
   */
  private async writeToFile(products: Product[]): Promise<void> {
    try {
      // Cria backup do arquivo atual antes de sobrescrever
      try {
        await fs.access(this.dataPath);
        await fs.copyFile(this.dataPath, this.backupPath);
      } catch {
        // Arquivo principal não existe, sem problema
      }

      // Escreve os novos dados
      const dataString = JSON.stringify(products, null, 2);
      await fs.writeFile(this.dataPath, dataString, 'utf-8');
      
      // Atualiza o cache
      this.cache = [...products];
      this.cacheTimestamp = Date.now();
      
      logger.debug('Dados salvos com sucesso', { count: products.length });
    } catch (error) {
      logger.error('Erro ao salvar dados', error);
      throw ApiError.internal('Falha ao salvar dados');
    }
  }

  /**
   * Obtém todos os produtos (com cache)
   */
  async getAllProducts(): Promise<Product[]> {
    if (this.isCacheValid()) {
      logger.debug('Retornando dados do cache');
      return [...this.cache!];
    }

    return this.readFromFile();
  }

  /**
   * Obtém produto por ID
   */
  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getAllProducts();
    return products.find(product => product.id === id) || null;
  }

  /**
   * Cria novo produto
   */
  async createProduct(product: Product): Promise<Product> {
    const products = await this.getAllProducts();
    
    // Verifica se já existe produto com mesmo ID
    const existingProduct = products.find(p => p.id === product.id);
    if (existingProduct) {
      throw ApiError.conflict('Produto com este ID já existe');
    }

    products.push(product);
    await this.writeToFile(products);
    
    logger.info('Produto criado', { id: product.id, name: product.name });
    return product;
  }

  /**
   * Atualiza produto existente
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = await this.getAllProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw ApiError.notFound('Produto não encontrado');
    }

    // Merge das atualizações mantendo dados existentes
    const updatedProduct: Product = {
      ...products[productIndex],
      ...updates,
      id, // Garante que o ID não seja alterado
      updatedAt: new Date().toISOString(),
    };

    products[productIndex] = updatedProduct;
    await this.writeToFile(products);
    
    logger.info('Produto atualizado', { id, updates: Object.keys(updates) });
    return updatedProduct;
  }

  /**
   * Remove produto
   */
  async deleteProduct(id: string): Promise<void> {
    const products = await this.getAllProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw ApiError.notFound('Produto não encontrado');
    }

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    await this.writeToFile(products);
    
    logger.info('Produto removido', { id, name: deletedProduct.name });
  }

  /**
   * Busca produtos com filtros e paginação
   */
  async searchProducts(filters: {
    search?: string;
    category?: string;
    isActive?: boolean;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    let products = await this.getAllProducts();

    // Aplica filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category) {
      products = products.filter(product => 
        product.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.isActive !== undefined) {
      products = products.filter(product => product.isActive === filters.isActive);
    }

    // Ordenação
    if (filters.sortBy) {
      products.sort((a, b) => {
        const field = filters.sortBy!;
        let comparison = 0;

        if (field === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (field === 'price') {
          comparison = a.price - b.price;
        } else if (field === 'createdAt') {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    const total = products.length;

    // Paginação
    if (filters.page && filters.limit) {
      const startIndex = (filters.page - 1) * filters.limit;
      products = products.slice(startIndex, startIndex + filters.limit);
    }

    return { products, total };
  }

  /**
   * Limpa o cache (útil para testes)
   */
  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
    logger.debug('Cache limpo');
  }

  /**
   * Obtém estatísticas dos produtos
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    categories: Record<string, number>;
    averagePrice: number;
  }> {
    const products = await this.getAllProducts();
    
    const stats = {
      total: products.length,
      active: products.filter(p => p.isActive).length,
      inactive: products.filter(p => !p.isActive).length,
      categories: {} as Record<string, number>,
      averagePrice: 0,
    };

    // Conta produtos por categoria
    products.forEach(product => {
      stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
    });

    // Calcula preço médio
    if (products.length > 0) {
      const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
      stats.averagePrice = Math.round((totalPrice / products.length) * 100) / 100;
    }

    return stats;
  }
}