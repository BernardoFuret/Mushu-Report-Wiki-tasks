import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import { type IJsonSerializable } from '@/types';

import { type IProcessor } from '../types';

import { type IProcessorState } from './types';

class RecordProcessorState implements IProcessorState, IJsonSerializable {
  #logger: ILogger;

  #processor: IProcessor;

  #headers: string[];

  constructor(logger: ILogger, processor: IProcessor, headers: string[]) {
    this.#logger = logger.fork(LoggerLabels.PROCESSOR_STATE_RECORDS);

    this.#processor = processor;

    this.#headers = headers;
  }

  async handle(record: string[]): Promise<void> {
    // TODO
    this.#logger.debug('Handling record', record);
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
      data: {
        headers: this.#headers,
        processor: this.#processor, // TODO: delete
      },
    };
  }
}

export default RecordProcessorState;
