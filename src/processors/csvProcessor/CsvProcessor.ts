import { createReadStream } from 'node:fs';

import { parse } from 'csv-parse';

import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import { type IJsonSerializable } from '@/types';
import { type ICsvWithHeadersVisitor } from '@/visitors/types';

import { type IProcessor } from '../types';

import { type ICsvProcessorState } from './states/types';
import { type IProcessorStrategy } from './strategies/types';

class CsvProcessor implements IProcessor, IJsonSerializable {
  #logger: ILogger;

  #state: ICsvProcessorState;

  #csvFilePath: string;

  constructor(
    logger: ILogger,
    csvFilePath: string,
    strategy: IProcessorStrategy<ICsvProcessorState>,
  ) {
    this.#logger = logger.fork(LoggerLabels.CSV_PROCESSOR);

    this.#state = strategy.buildInitialState(this);

    this.#csvFilePath = csvFilePath;
  }

  updateState(state: ICsvProcessorState): this {
    this.#logger.debug('Updating state from', this.#state, 'to', state);

    this.#state = state;

    return this;
  }

  async process(visitor: ICsvWithHeadersVisitor): Promise<void> {
    this.#logger.info('Starting processing data');

    const readable = createReadStream(this.#csvFilePath).pipe(parse());

    // eslint-disable-next-line no-restricted-syntax
    for await (const record of readable) {
      await this.#state.consume(record).accept(visitor);
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
