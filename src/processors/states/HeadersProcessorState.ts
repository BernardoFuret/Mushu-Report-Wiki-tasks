import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IJsonSerializable } from '@/types';

import { type IProcessor } from '../types';

import RecordProcessorState from './recordProcessorState';
import { type IProcessorState, type THeadersRecord } from './types';

const isValidHeadersRecord = (record: string[]): record is THeadersRecord => {
  return !!record[1]?.trim();
};

class HeadersProcessorState implements IProcessorState, IJsonSerializable {
  #logger: ILogger;

  #processor: IProcessor;

  constructor(logger: ILogger, processor: IProcessor) {
    this.#logger = logger.fork(LoggerLabels.PROCESSOR_STATE_HEADERS);

    this.#processor = processor;
  }

  async handle(record: string[]): Promise<void> {
    this.#logger.debug('Handling record', record);

    this.#logger.debug('Validating record', record, 'as headers');

    if (isValidHeadersRecord(record)) {
      this.#logger.debug('Record', record, 'is a valid headers record');

      const nextState = new RecordProcessorState(this.#logger, this.#processor, record);

      this.#processor.updateState(nextState);
    } else {
      this.#logger.debug('Record', record, 'is not a valid headers record');

      throw new Error(
        'Invalid headers. Expected headers record to have a pagename header and at least one template parameter header',
        { cause: { record } },
      );
    }
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
    };
  }
}

export default HeadersProcessorState;
