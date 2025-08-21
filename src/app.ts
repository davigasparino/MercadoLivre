import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';

import { productRoutes } from './routes/productRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Carrega variáveis de ambiente
config();

/**
 * Configuração principal da aplicação Express
 * Implementa middlewares de segurança, logging e rate limiting
 */

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api';
const API_VERSION = process.env.API_VERSION || 'v1';

// Configuração de rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests por IP
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Muitas tentativas. Tente novamente mais tarde.',
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true, // Retorna rate limit info nos headers
  legacyHeaders: false, // Desabilita headers X-RateLimit-*
});

// Configuração de CORS
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
    
    // Permite requests sem origin (ex: mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Middlewares de segurança e otimização
app.use(helmet()); // Segurança headers
app.use(compression()); // Compressão gzip
app.use(cors(corsOptions)); // CORS
app.use(limiter); // Rate limiting

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging de requisições HTTP
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use(`${API_PREFIX}/${API_VERSION}/products`, productRoutes);

// Root endpoint com informações da API
app.get('/', (req, res) => {
  res.json({
    name: 'Product API',
    version: '1.0.0',
    description: 'API moderna para gerenciamento de produtos',
    endpoints: {
      health: '/health',
      products: `${API_PREFIX}/${API_VERSION}/products`,
      documentation: `${API_PREFIX}/${API_VERSION}/docs`,
    },
    timestamp: new Date().toISOString(),
  });
});

// Middleware de tratamento de erros
app.use(notFoundHandler);
app.use(errorHandler);

// Inicialização do servidor
const startServer = (): void => {
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando na porta ${PORT}`);
    logger.info(`📚 API disponível em: http://localhost:${PORT}${API_PREFIX}/${API_VERSION}`);
    logger.info(`🔍 Health check: http://localhost:${PORT}/health`);
    logger.info(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
};

// Tratamento de erros não capturados
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido, encerrando servidor...');
  process.exit(0);
});

// Inicia o servidor apenas se não estiver sendo importado (para testes)
if (require.main === module) {
  startServer();
}

export { app };