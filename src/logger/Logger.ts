import { createBaseLogger } from './helpers.js';
import {
  type IBaseLogger,
  type ILogger,
  type ILoggerConstructorOptions,
  type ILoggerFactoryOptions,
} from './types.js';

class Logger implements ILogger {
  readonly #baseLogger: IBaseLogger;

  protected constructor({ baseLogger }: ILoggerConstructorOptions) {
    this.#baseLogger = baseLogger;
  }

  static create({ srcDirname }: ILoggerFactoryOptions): ILogger {
    return new Logger({
      baseLogger: createBaseLogger({ srcDirname }),
    });
  }

  fork(): ILogger {
    return new Logger({
      baseLogger: this.#baseLogger,
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
