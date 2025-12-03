/**
 * Centralized logging utility
 * Provides environment-aware logging with different log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  prefix?: string;
}

class Logger {
  private config: LoggerConfig;
  private isDev: boolean;

  constructor(config?: Partial<LoggerConfig>) {
    this.isDev = import.meta.env.DEV;
    this.config = {
      enabled: this.isDev,
      level: this.isDev ? 'debug' : 'error',
      prefix: '[Sui Studio]',
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, ...args: any[]): any[] {
    const timestamp = new Date().toISOString();
    const prefix = `${this.config.prefix} [${level.toUpperCase()}] ${timestamp}`;
    return [prefix, ...args];
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(...this.formatMessage('debug', ...args));
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(...this.formatMessage('info', ...args));
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.formatMessage('warn', ...args));
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(...this.formatMessage('error', ...args));
    }
  }

  group(label: string): void {
    if (this.isDev) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.isDev) {
      console.groupEnd();
    }
  }

  table(data: any): void {
    if (this.isDev) {
      console.table(data);
    }
  }

  time(label: string): void {
    if (this.isDev) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDev) {
      console.timeEnd(label);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for custom instances
export { Logger };

// Export type for external use
export type { LogLevel, LoggerConfig };
