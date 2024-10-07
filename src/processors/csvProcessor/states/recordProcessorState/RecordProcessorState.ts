import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import { type IJsonSerializable } from '@/types';
import { type ICsvVisitor, type IVistorAcceptor } from '@/visitors/types';

import { type ICsvProcessorState } from '../types';

class RecordProcessorState implements ICsvProcessorState, IJsonSerializable {
  #logger: ILogger;

  #headers: string[];

  constructor(logger: ILogger, headers: string[]) {
    this.#logger = logger.fork(LoggerLabels.PROCESSOR_STATE_RECORDS);

    this.#headers = headers;
  }

  consume(record: string[]): IVistorAcceptor {
    this.#logger.debug('Consuming record', record);

    return {
      accept: async (visitor: ICsvVisitor) => {
        await visitor.visitDataRecord(record, this.#headers);
      },
    };
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
      data: {
        headers: this.#headers,
      },
    };
  }
}

export default RecordProcessorState;
