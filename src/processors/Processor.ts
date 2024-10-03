import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import { type IWikiClient } from '@/services/wikiClient';
import { type IJsonSerializable } from '@/types';

import HeadersProcessorState from './states/HeadersProcessorState';
import { type IProcessorState } from './states/types';
import { type IProcessor } from './types';

class Processor implements IProcessor, IJsonSerializable {
  #logger: ILogger;

  #wikiClient: IWikiClient;

  #state: IProcessorState;

  constructor(logger: ILogger, wikiClient: IWikiClient) {
    this.#logger = logger.fork(LoggerLabels.PROCESSOR);

    this.#wikiClient = wikiClient;

    this.#state = new HeadersProcessorState(logger, this);
  }

  getWikiClient(): IWikiClient {
    return this.#wikiClient;
  }

  updateState(state: IProcessorState): this {
    this.#logger.debug('Updating state from', this.#state, 'to', state);

    this.#state = state;

    return this;
  }

  async process(record: string[]): Promise<void> {
    this.#logger.debug('Processing record', record, 'using state', this.#state);

    return this.#state.handle(record);
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
    };
  }
}

export default Processor;
