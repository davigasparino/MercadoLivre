/**
 * Configuração global para testes
 */

// Configuração de timeout para testes
jest.setTimeout(10000);

// Mock de variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';
process.env.PORT = '3001';

// Suprime logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};