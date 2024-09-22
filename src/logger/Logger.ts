import winston from 'winston';

import { jsonReplacer, messageFormatter } from './formatters.js';
import { generateLogPath } from './helpers.js';
import { type ILogger } from './types.js';

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(messageFormatter),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json({ replacer: jsonReplacer }),
);

class Logger implements ILogger {
  readonly #baseLogger: winston.Logger;

  constructor(srcDirname: string) {
    this.#baseLogger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'debug', // TODO: configure via env file?
          format: consoleFormat,
        }),
        new winston.transports.File({
          level: 'info',
          filename: generateLogPath(srcDirname, 'combined.log'),
          format: fileFormat,
          options: { flags: 'w' },
        }),
        new winston.transports.File({
          level: 'error',
          filename: generateLogPath(srcDirname, 'errors.log'),
          format: fileFormat,
          options: { flags: 'w' },
        }),
      ],
    });
  }

  debug(...message: unknown[]): this {
    this.#baseLogger.debug({ message });

    return this;
  }

  info(...message: unknown[]): this {
    this.#baseLogger.info({ message });

    return this;
  }

  warn(...message: unknown[]): this {
    this.#baseLogger.warn({ message });

    return this;
  }

  error(...message: unknown[]): this {
    this.#baseLogger.error({ message });

    return this;
  }
}

export default Logger;
