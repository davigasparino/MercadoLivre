/**
 * Sistema de logging personalizado
 * Suporta diferentes níveis de log e formatação colorida no desenvolvimento
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  meta?: unknown;
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.level = this.getLogLevel();
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private getLogLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(level: string, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = { timestamp, level, message };
    
    if (meta) {
      logEntry.meta = meta;
    }

    if (this.isDevelopment) {
      return this.formatForDevelopment(logEntry);
    }

    return JSON.stringify(logEntry);
  }

  private formatForDevelopment(entry: LogEntry): string {
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[36m',  // Cyan
      DEBUG: '\x1b[35m', // Magenta
      RESET: '\x1b[0m',  // Reset
    };

    const color = colors[entry.level as keyof typeof colors] || colors.INFO;
    const timestamp = entry.timestamp.substring(11, 23); // Apenas HH:mm:ss.sss
    
    let formatted = `${color}[${entry.level}]${colors.RESET} ${timestamp} ${entry.message}`;
    
    if (entry.meta) {
      formatted += `\n${JSON.stringify(entry.meta, null, 2)}`;
    }

    return formatted;
  }

  error(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, meta));
    }
  }

  warn(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, meta));
    }
  }

  info(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, meta));
    }
  }

  debug(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, meta));
    }
  }

  // Métodos específicos para diferentes contextos
  request(method: string, url: string, statusCode: number, duration: number): void {
    this.info(`${method} ${url} - ${statusCode} (${duration}ms)`);
  }

  apiError(error: Error, context?: string): void {
    this.error(`API Error${context ? ` in ${context}` : ''}: ${error.message}`, {
      stack: error.stack,
      name: error.name,
    });
  }

  validation(message: string, errors: unknown): void {
    this.warn(`Validation Error: ${message}`, errors);
  }
}

export const logger = new Logger();