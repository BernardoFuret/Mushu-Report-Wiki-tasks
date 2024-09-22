import { type Logform } from 'winston';

interface IMessageInfo extends Logform.TransformableInfo {
  message: unknown[];
}

interface IMessageFormater {
  (info: IMessageInfo): string;
}

interface IJsonReplacer {
  (key: string, value: unknown): unknown;
}

interface IBaseLoggerMethod {
  (data: { message: unknown[]; label: string }): void;
}

interface IBaseLogger {
  debug: IBaseLoggerMethod;
  info: IBaseLoggerMethod;
  warn: IBaseLoggerMethod;
  error: IBaseLoggerMethod;
}

interface IBaseLoggerOptions {
  srcDirname: string;
}

interface ILogger {
  fork(label: string): ILogger;
  debug(...messageParts: unknown[]): this;
  info(...messageParts: unknown[]): this;
  warn(...messageParts: unknown[]): this;
  error(...messageParts: unknown[]): this;
}

interface ILoggerConstructorOptions {
  baseLogger: IBaseLogger;
  label: string;
}

interface ILoggerFactoryOptions {
  srcDirname: string;
  label: string;
}

interface ILoggerConstructor {
  create(options: ILoggerFactoryOptions): ILogger;
}

export type {
  IBaseLogger,
  IBaseLoggerOptions,
  IJsonReplacer,
  ILogger,
  ILoggerConstructor,
  ILoggerConstructorOptions,
  ILoggerFactoryOptions,
  IMessageFormater,
};
