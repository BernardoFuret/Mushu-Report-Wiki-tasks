import { createReadStream } from 'node:fs';

import { parse, type Parser } from 'csv-parse';

import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IJsonSerializable } from '@/types';

import { type ICsvProcessorState } from '../states';
import { type ICsvProcessorStrategy } from '../strategies';
import { type ICsvWithHeadersVisitor } from '../visitors';

import { type ICsvProcessor } from './types';

class CsvStreamerProcessor<
    TVisitor extends ICsvWithHeadersVisitor,
    TState extends ICsvProcessorState<TVisitor>,
    TStrategy extends ICsvProcessorStrategy<TVisitor, TState>,
  >
  implements ICsvProcessor<TState>, IJsonSerializable
{
  #logger: ILogger;

  #csvFilePath: string;

  #state: TState;

  #strategy: TStrategy;

  constructor(logger: ILogger, csvFilePath: string, strategy: TStrategy) {
    this.#logger = logger.fork(LoggerLabels.CSV_PROCESSOR);

    this.#strategy = strategy;

    this.#state = strategy.buildInitialState(this);

    this.#csvFilePath = csvFilePath;
  }

  updateState(state: TState): this {
    this.#logger.debug('Updating state from', this.#state, 'to', state);

    this.#state = state;

    return this;
  }

  async #iterateStream(readable: Parser) {
    // eslint-disable-next-line no-restricted-syntax
    for await (const record of readable) {
      await this.#state.consume(record).accept(this.#strategy.getVisitor());
    }
  }

  async process(): Promise<void> {
    this.#logger.info('Starting processing data');

    await new Promise((resolve, reject) => {
      const stream = createReadStream(this.#csvFilePath).once('error', reject).pipe(parse());

      this.#iterateStream(stream).then(resolve, reject);
    });
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

export default CsvStreamerProcessor;
