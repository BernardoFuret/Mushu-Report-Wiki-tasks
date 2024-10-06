import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IJsonSerializable } from '@/types';

import { type IProcessor } from '../../../types';
import RecordProcessorState from '../recordProcessorState';
import { type ICsvProcessorState } from '../types';

import { type THeadersRecord } from './types';

/**
 * The first entry of the record is the pagename and is not necessary to be filed
 * on the headers record. But at least one more entry is needed and all entries
 * must not be empty.
 */
const isValidHeadersRecord = (record: string[]): record is THeadersRecord => {
  const [, ...recordRest] = record;

  return !!recordRest.length && !recordRest.some((recordPart) => !recordPart.trim());
};

class HeadersProcessorState implements ICsvProcessorState, IJsonSerializable {
  #logger: ILogger;

  #processor: IProcessor;

  constructor(logger: ILogger, processor: IProcessor) {
    this.#logger = logger.fork(LoggerLabels.PROCESSOR_STATE_HEADERS);

    this.#processor = processor;
  }

  async consume(record: string[]): Promise<void> {
    this.#logger.info('Handling record', record);

    this.#logger.debug('Validating record', record, 'as a headers record');

    if (isValidHeadersRecord(record)) {
      this.#logger.debug('Record', record, 'is a valid headers record');

      const nextState = new RecordProcessorState(this.#logger, this.#processor, record);

      this.#processor.updateState(nextState);
    } else {
      this.#logger.debug('Record', record, 'is not a valid headers record');

      throw new Error(
        'Invalid headers. Expected headers record to have at least one template parameter header',
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
