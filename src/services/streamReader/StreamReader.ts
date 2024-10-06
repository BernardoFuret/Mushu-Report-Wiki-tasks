import { createReadStream } from 'node:fs';
import { type Readable } from 'node:stream';

import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';

import { type IStreamDecorator, type IStreamReader } from './types';

class StreamReader<T> implements IStreamReader<T> {
  #logger: ILogger;

  #stream: Readable;

  constructor(logger: ILogger, filePath: string, streamDecorator: IStreamDecorator) {
    this.#logger = logger.fork(LoggerLabels.STREAM_READER);

    this.#stream = streamDecorator(createReadStream(filePath));
  }

  initStream(): Promise<void> {
    this.#logger.debug('Starting stream');

    return new Promise<void>((resolve) => {
      this.#stream.on('readable', resolve);
    });
  }

  readStream(): T | null {
    this.#logger.debug('Reading stream');

    return this.#stream.read();
  }

  checkHasEnded(): boolean {
    return this.#stream.readableEnded;
  }
}

export default StreamReader;
