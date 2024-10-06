import { type Readable } from 'stream';

interface IStreamReader<T> {
  initStream(): Promise<void>;
  readStream(): T | null;
  checkHasEnded(): boolean;
}

interface IStreamDecorator {
  (stream: Readable): Readable;
}

export type { IStreamDecorator, IStreamReader };
