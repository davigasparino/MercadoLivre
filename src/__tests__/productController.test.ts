import request from 'supertest';
import { app } from '../app';

/**
 * Testes de integração para o ProductController
 */

describe('Product Controller', () => {
  const baseUrl = '/api/v1/products';

  describe('GET /api/v1/products', () => {
    it('deve retornar lista de produtos', async () => {
      const response = await request(app)
        .get(baseUrl)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve aplicar paginação corretamente', async () => {
      const response = await request(app)
        .get(`${baseUrl}?page=1&limit=5`)
        .expect(200);

      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 5,
      });
    });
  });

  describe('POST /api/v1/products', () => {
    const validProduct = {
      name: 'Produto Teste',
      description: 'Descrição do produto teste',
      price: 99.99,
      category: 'Eletrônicos',
      stock: 10,
    };

    it('deve criar produto com dados válidos', async () => {
      const response = await request(app)
        .post(baseUrl)
        .send(validProduct)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toMatchObject({
        name: validProduct.name,
        price: validProduct.price,
        category: validProduct.category,
      });
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('createdAt');
    });

    it('deve rejeitar produto com dados inválidos', async () => {
      const invalidProduct = {
        name: '',
        price: -10,
      };

      const response = await request(app)
        .post(baseUrl)
        .send(invalidProduct)
        .expect(422);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'UNPROCESSABLE_ENTITY');
    });
  });

  describe('GET /api/v1/products/statistics', () => {
    it('deve retornar estatísticas dos produtos', async () => {
      const response = await request(app)
        .get(`${baseUrl}/statistics`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('active');
      expect(response.body.data).toHaveProperty('categories');
      expect(response.body.data).toHaveProperty('averagePrice');
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('deve retornar erro para ID inválido', async () => {
      const response = await request(app)
        .get(`${baseUrl}/invalid-id`)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});

describe('Health Check', () => {
  it('deve retornar status ok', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('Root Endpoint', () => {
  it('deve retornar informações da API', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('name', 'Product API');
    expect(response.body).toHaveProperty('endpoints');
  });
});