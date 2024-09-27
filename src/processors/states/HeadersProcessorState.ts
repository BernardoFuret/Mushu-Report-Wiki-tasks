import { LoggerLabels } from '../../constants/logger.js';
import { type ILogger } from '../../logger/types.js';
import { type IJsonSerializable } from '../../types.js';
import { type IProcessor } from '../types.js';

import RecordProcessorState from './RecordProcessorState.js';
import { type IProcessorState } from './types.js';

class HeadersProcessorState implements IProcessorState, IJsonSerializable {
  #logger: ILogger;

  #processor: IProcessor;

  constructor(logger: ILogger, processor: IProcessor) {
    this.#logger = logger.fork(LoggerLabels.PROCESSOR_STATE_HEADERS);

    this.#processor = processor;
  }

  async handle(record: string[]): Promise<void> {
    // TODO
    this.#logger.debug('Handling record', record);

    const nextState = new RecordProcessorState(this.#logger, this.#processor, record);

    this.#processor.updateState(nextState);
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
    };
  }
}

export default HeadersProcessorState;
