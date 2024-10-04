import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IJsonSerializable } from '@/types';

import { type IProcessor } from '../types';

import ProcessorState from './ProcessorState';
import RecordProcessorState from './recordProcessorState';
import { type IProcessorState, type THeadersRecord } from './types';

const isValidHeadersRecord = (record: string[]): record is THeadersRecord => {
  return !!record[1]?.trim();
};

class HeadersProcessorState extends ProcessorState implements IProcessorState, IJsonSerializable {
  #logger: ILogger;

  constructor(logger: ILogger) {
    super();

    this.#logger = logger.fork(LoggerLabels.PROCESSOR_STATE_HEADERS);
  }

  async consume(processor: IProcessor): Promise<void> {
    const record = processor.readStream();

    this.#logger.info('Handling record', record);

    this.#logger.debug('Validating record', record, 'as a headers record');

    if (isValidHeadersRecord(record)) {
      this.#logger.debug('Record', record, 'is a valid headers record');

      const nextState = new RecordProcessorState(this.#logger, record);

      processor.updateState(nextState);
    } else {
      this.#logger.debug('Record', record, 'is not a valid headers record');

      // TODO: update state?
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
