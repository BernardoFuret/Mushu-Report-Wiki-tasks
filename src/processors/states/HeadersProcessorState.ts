import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IJsonSerializable } from '@/types';

import { type IProcessor } from '../types';

import RecordProcessorState from './RecordProcessorState';
import { type IProcessorState } from './types';

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
