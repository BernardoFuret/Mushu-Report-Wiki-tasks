import { parse } from 'csv-parse';

import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import StreamReader from '@/services/streamReader';
import { type IWikiClient } from '@/services/wikiClient';
import { type IJsonSerializable } from '@/types';

import { type IProcessorState } from './states/types';
import { type IProcessor } from './types';

class CsvProcessor implements IProcessor<string[]>, IJsonSerializable {
  #logger: ILogger;

  #wikiClient: IWikiClient;

  #state: IProcessorState<string[]>;

  #csvFilePath: string;

  constructor(
    logger: ILogger,
    csvFilePath: string,
    initialState: IProcessorState<string[]>,
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

  updateState(state: IProcessorState<string[]>): this {
    this.#logger.debug('Updating state from', this.#state, 'to', state);

    this.#state = state;

    return this;
  }

  async process(): Promise<void> {
    this.#logger.info('Starting processing data');

    const streamReader = new StreamReader<string[]>(this.#logger, this.#csvFilePath, (readable) => {
      return readable.pipe(parse());
    });

    await streamReader.initStream();

    while (!(this.#state.checkIsFinalState() || streamReader.checkHasEnded())) {
      // eslint-disable-next-line no-await-in-loop
      await this.#state.consume(this, streamReader);
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
