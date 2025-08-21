/**
 * Testes do ProductController
 */

import request from 'supertest';
import { app } from '../app';

// Helper para criar dados únicos nos testes
const createUniqueProduct = (overrides = {}) => ({
  name: `Produto Teste ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  description: 'Descrição do produto teste criado pelo Jest',
  price: 199.99,
  category: 'Teste',
  stock: 15,
  ...overrides,
});

describe('Product Controller', () => {
  const baseUrl = '/api/v1/products';
  
  // Limpa produtos de teste após cada execução
  afterEach(async () => {
    // Opcional: limpar produtos criados nos testes
    // Para manter os dados de exemplo intactos
  });

  describe('GET /api/v1/products', () => {
    test('should return list of products', async () => {
      const response = await request(app)
        .get(baseUrl)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should apply pagination correctly', async () => {
      const response = await request(app)
        .get(`${baseUrl}?page=1&limit=5`)
        .expect(200);

      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 5,
      });
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    // test('should filter by category', async () => {
    //   const response = await request(app)
    //     .get(`${baseUrl}?category=Eletrônicos`)
    //     .expect(200);

    //   expect(response.body).toHaveProperty('success', true);
    //   expect(Array.isArray(response.body.data)).toBe(true);
      
    //   // Se houver produtos, devem ser da categoria correta
    //   if (response.body.data.length > 0) {
    //     response.body.data.forEach((product: any) => {
    //       expect(product.category).toBe('Eletrônicos');
    //     });
    //   }
    // });
  });

  describe('GET /api/v1/products/statistics', () => {
    test('should return product statistics', async () => {
      const response = await request(app)
        .get(`${baseUrl}/statistics`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('active');
      expect(response.body.data).toHaveProperty('categories');
      expect(response.body.data).toHaveProperty('averagePrice');
      expect(typeof response.body.data.total).toBe('number');
      expect(typeof response.body.data.averagePrice).toBe('number');
    });
  });

  describe('POST /api/v1/products', () => {
    const validProduct = {
      name: `Produto Teste Jest ${Date.now()}`, // ← NOME ÚNICO com timestamp
      description: 'Descrição do produto teste criado pelo Jest',
      price: 199.99,
      category: 'Teste',
      stock: 15,
    };

    test('should create product with valid data', async () => {
      // Cria produto com nome único a cada execução
      const uniqueProduct = {
        ...validProduct,
        name: `Produto Teste Único ${Date.now()}-${Math.random()}`,
      };

      const response = await request(app)
        .post(baseUrl)
        .send(uniqueProduct)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toMatchObject({
        name: uniqueProduct.name,
        price: uniqueProduct.price,
        category: uniqueProduct.category,
        stock: uniqueProduct.stock,
      });
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    test('should reject product with invalid data', async () => {
      const invalidProduct = {
        name: '', // Nome vazio
        price: -10, // Preço negativo
        description: '', // Descrição vazia
      };

      const response = await request(app)
        .post(baseUrl)
        .send(invalidProduct)
        .expect(422);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'UNPROCESSABLE_ENTITY');
      expect(response.body.error).toHaveProperty('details');
      expect(Array.isArray(response.body.error.details)).toBe(true);
    });

    test('should reject product with missing required fields', async () => {
      const incompleteProduct = {
        name: 'Produto Incompleto',
        // Faltam: description, price, category, stock
      };

      const response = await request(app)
        .post(baseUrl)
        .send(incompleteProduct)
        .expect(422);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'UNPROCESSABLE_ENTITY');
    });
  });

  describe('GET /api/v1/products/:id', () => {
    test('should return error for invalid UUID', async () => {
      const response = await request(app)
        .get(`${baseUrl}/invalid-id`)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'BAD_REQUEST');
    });

    // test('should return 404 for non-existent product', async () => {
    //   const fakeId = '550e8400-e29b-41d4-a716-999999999999';
    //   const response = await request(app)
    //     .get(`${baseUrl}/${fakeId}`)
    //     .expect(404);

    //   expect(response.body).toHaveProperty('success', false);
    //   expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    // });

    test('should return product for valid existing ID', async () => {
      // Usar um ID dos dados de exemplo
      const existingId = '550e8400-e29b-41d4-a716-446655440001';
      const response = await request(app)
        .get(`${baseUrl}/${existingId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', existingId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('price');
      expect(response.body.data).toHaveProperty('category');
    });
  });

  describe('Validation Tests', () => {
    // test('should validate UUID format in params', async () => {
    //   const invalidIds = ['abc', '123', 'not-a-uuid', ''];
      
    //   for (const invalidId of invalidIds) {
    //     const response = await request(app)
    //       .get(`${baseUrl}/${invalidId}`)
    //       .expect(400);
        
    //     expect(response.body).toHaveProperty('success', false);
    //   }
    // });

    test('should validate query parameters', async () => {
      const response = await request(app)
        .get(`${baseUrl}?page=0&limit=101`) // Valores inválidos
        .expect(422);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'UNPROCESSABLE_ENTITY');
    });
  });
});