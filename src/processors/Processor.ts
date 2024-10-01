import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import { type IJsonSerializable } from '@/types';

import HeadersProcessorState from './states/HeadersProcessorState';
import { type IProcessorState } from './states/types';
import { type IProcessor } from './types';

class Processor implements IProcessor, IJsonSerializable {
  #logger: ILogger;

  #state: IProcessorState;

  constructor(logger: ILogger) {
    this.#logger = logger.fork(LoggerLabels.PROCESSOR);

    this.#state = new HeadersProcessorState(logger, this);
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
