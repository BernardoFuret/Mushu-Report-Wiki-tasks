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

interface ILogger {
  debug(...messageParts: unknown[]): this;
  info(...messageParts: unknown[]): this;
  warn(...messageParts: unknown[]): this;
  error(...messageParts: unknown[]): this;
}

export type { IJsonReplacer, ILogger, IMessageFormater };
