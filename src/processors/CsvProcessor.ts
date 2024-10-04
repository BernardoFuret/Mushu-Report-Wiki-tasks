import { createReadStream } from 'node:fs';

import { parse, type Parser } from 'csv-parse';

import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import { type IWikiClient } from '@/services/wikiClient';
import { type IJsonSerializable } from '@/types';

import { type IProcessorState } from './states/types';
import { type IProcessor } from './types';

class CsvProcessor implements IProcessor, IJsonSerializable {
  #logger: ILogger;

  #wikiClient: IWikiClient;

  #state: IProcessorState;

  #csvFilePath: string;

  #stream: Parser;

  constructor(
    logger: ILogger,
    csvFilePath: string,
    initialState: IProcessorState,
    wikiClient: IWikiClient,
  ) {
    this.#logger = logger.fork(LoggerLabels.CSV_PROCESSOR);

    this.#wikiClient = wikiClient;

    this.#state = initialState;

    this.#csvFilePath = csvFilePath;

    this.#stream = createReadStream(csvFilePath).pipe(parse());
  }

  getWikiClient(): IWikiClient {
    return this.#wikiClient;
  }

  updateState(state: IProcessorState): this {
    this.#logger.debug('Updating state from', this.#state, 'to', state);

    this.#state = state;

    return this;
  }

  #initStream() {
    return new Promise((resolve) => {
      this.#stream.on('readable', resolve);
    });
  }

  readStream(): string[] {
    return this.#stream.read();
  }

  async process(): Promise<void> {
    this.#logger.info('Starting processing data');

    await this.#initStream();

    while (!(this.#state.checkIsFinalState() || this.#stream.readableEnded)) {
      // eslint-disable-next-line no-await-in-loop
      await this.#state.consume(this);
    }
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
      data: {
        csvFilePath: this.#csvFilePath,
        currentState: this.#state,
      },
    };
  }
}

export default CsvProcessor;
