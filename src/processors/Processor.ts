import { LoggerLabels } from '../constants/logger.js';
import { type ILogger } from '../logger/types.js';
import { type IJsonSerializable } from '../types.js';

import HeadersProcessorState from './states/HeadersProcessorState.js';
import { type IProcessorState } from './states/types.js';
import { type IProcessor } from './types.js';

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
