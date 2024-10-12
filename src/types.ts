import { type ILogger } from './logger';

interface IJsonSerializable {
  toJSON(): unknown;
}

interface IContext {
  logger: ILogger;
  srcDirname: string;
}

export type { IContext, IJsonSerializable };
