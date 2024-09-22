import { LoggerLabels } from '../../constants/logger.js';
import { type ILogger } from '../../logger/types.js';
import { type IJsonSerializable } from '../../types.js';
import { type IProcessor } from '../types.js';

import { type IProcessorState } from './types.js';

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
