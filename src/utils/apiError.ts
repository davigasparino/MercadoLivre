/**
 * Classe customizada para erros da API
 * Estende Error nativo para adicionar código de status HTTP e códigos de erro personalizados
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    // Mantém o stack trace (apenas no V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Métodos estáticos para criar erros específicos
   */
  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(message: string = 'Não autorizado'): ApiError {
    return new ApiError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message: string = 'Acesso negado'): ApiError {
    return new ApiError(message, 403, 'FORBIDDEN');
  }

  static notFound(message: string = 'Recurso não encontrado'): ApiError {
    return new ApiError(message, 404, 'NOT_FOUND');
  }

  static conflict(message: string, details?: unknown): ApiError {
    return new ApiError(message, 409, 'CONFLICT', details);
  }

  static unprocessableEntity(
    message: string,
    details?: unknown
  ): ApiError {
    return new ApiError(message, 422, 'UNPROCESSABLE_ENTITY', details);
  }

  static tooManyRequests(
    message: string = 'Muitas tentativas. Tente novamente mais tarde.'
  ): ApiError {
    return new ApiError(message, 429, 'TOO_MANY_REQUESTS');
  }

  static internal(
    message: string = 'Erro interno do servidor',
    details?: unknown
  ): ApiError {
    return new ApiError(message, 500, 'INTERNAL_ERROR', details);
  }

  static serviceUnavailable(
    message: string = 'Serviço temporariamente indisponível'
  ): ApiError {
    return new ApiError(message, 503, 'SERVICE_UNAVAILABLE');
  }

  /**
   * Converte o erro para formato JSON
   */
  toJSON(): Record<string, unknown> {
    return {
      success: false,
      error: {
        code: this.errorCode,
        message: this.message,
        ...(this.details && { details: this.details }),
      },
      timestamp: new Date().toISOString(),
    };
  }
}