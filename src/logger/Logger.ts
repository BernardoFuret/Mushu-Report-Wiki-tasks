import { createBaseLogger } from './helpers.js';
import { type IBaseLogger, type ILogger, type ILoggerConstructorOptions } from './types.js';

class Logger implements ILogger {
  readonly #baseLogger: IBaseLogger;

  readonly #srcDirname: string;

  // TODO: create a base logger that abstracts winston stuff
  // The logger fork will simply call the base logger with a different label
  constructor({ srcDirname, truncateLogFiles = true }: ILoggerConstructorOptions) {
    this.#baseLogger = createBaseLogger({ srcDirname, truncateLogFiles });

    this.#srcDirname = srcDirname;
  }

  fork(): ILogger {
    return new Logger({
      srcDirname: this.#srcDirname,
      truncateLogFiles: false,
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
