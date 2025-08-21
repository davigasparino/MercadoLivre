import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

/**
 * Middleware global de tratamento de erros
 * Captura todos os erros não tratados e retorna resposta padronizada
 */

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log do erro
  logger.apiError(error, `${req.method} ${req.originalUrl}`);

  // Se já foi enviada resposta, delega para o handler padrão do Express
  if (res.headersSent) {
    next(error);
    return;
  }

  // Se é um ApiError, retorna com o status e estrutura definidos
  if (error instanceof ApiError) {
    res.status(error.statusCode).json(error.toJSON());
    return;
  }

  // Para erros não tratados, retorna erro interno genérico
  const genericError = ApiError.internal(
    process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : error.message
  );

  res.status(genericError.statusCode).json(genericError.toJSON());
};

/**
 * Middleware para capturar rotas não encontradas
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = ApiError.notFound(
    `Rota ${req.method} ${req.originalUrl} não encontrada`
  );
  
  res.status(error.statusCode).json(error.toJSON());
};