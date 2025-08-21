import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

/**
 * Middleware de validação usando Zod schemas
 * Valida diferentes partes da requisição (body, query, params)
 */

interface ValidationOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (options: ValidationOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validar body se schema fornecido
      if (options.body && req.body) {
        const validatedBody = options.body.parse(req.body);
        req.body = validatedBody;
      }

      // Validar query parameters se schema fornecido
      if (options.query) {
        const validatedQuery = options.query.parse(req.query);
        req.query = validatedQuery as Record<string, unknown>;
      }

      // Validar route parameters se schema fornecido
      if (options.params) {
        const validatedParams = options.params.parse(req.params);
        req.params = validatedParams as Record<string, string>;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          received: err.received,
        }));

        logger.validation('Request validation failed', formattedErrors);

        const apiError = ApiError.unprocessableEntity(
          'Dados de entrada inválidos',
          formattedErrors
        );

        res.status(apiError.statusCode).json(apiError.toJSON());
        return;
      }

      // Se não for erro de validação, passa para o próximo middleware
      next(error);
    }
  };
};

/**
 * Middleware específico para validar UUID em parâmetros de rota
 */
export const validateUUID = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const paramValue = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!paramValue || !uuidRegex.test(paramValue)) {
      const error = ApiError.badRequest(
        `Parâmetro '${paramName}' deve ser um UUID válido`
      );
      
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    next();
  };
};