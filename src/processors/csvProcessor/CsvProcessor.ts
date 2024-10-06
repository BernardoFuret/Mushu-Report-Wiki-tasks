import { createReadStream } from 'node:fs';

import { parse } from 'csv-parse';

import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import { type IWikiClient } from '@/services/wikiClient';
import { type IJsonSerializable } from '@/types';

import { type IProcessor } from '../types';

import { type ICsvProcessorState } from './states/types';

class CsvProcessor implements IProcessor, IJsonSerializable {
  #logger: ILogger;

  #wikiClient: IWikiClient;

  #state: ICsvProcessorState;

  #csvFilePath: string;

  constructor(
    logger: ILogger,
    csvFilePath: string,
    initialState: ICsvProcessorState,
    wikiClient: IWikiClient,
  ) {
    this.#logger = logger.fork(LoggerLabels.CSV_PROCESSOR);

    this.#wikiClient = wikiClient;

    this.#state = initialState;

    this.#csvFilePath = csvFilePath;
  }

  getWikiClient(): IWikiClient {
    return this.#wikiClient;
  }

  updateState(state: ICsvProcessorState): this {
    this.#logger.debug('Updating state from', this.#state, 'to', state);

    this.#state = state;

    return this;
  }

  async process(): Promise<void> {
    this.#logger.info('Starting processing data');

    const readable = createReadStream(this.#csvFilePath).pipe(parse());

    // eslint-disable-next-line no-restricted-syntax
    for await (const record of readable) {
      await this.#state.consume(this, record);
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
