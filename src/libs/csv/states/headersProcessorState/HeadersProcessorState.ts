import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IJsonSerializable } from '@/types';

import { type ICsvProcessor } from '../../csvProcessor';
import { type ICsvWithHeadersVisitor, type IVistorAcceptor } from '../../visitors';
import RecordProcessorState from '../recordProcessorState';
import { type ICsvProcessorState } from '../types';

class HeadersProcessorState
  implements ICsvProcessorState<ICsvWithHeadersVisitor>, IJsonSerializable
{
  #logger: ILogger;

  #processor: ICsvProcessor<ICsvProcessorState<ICsvWithHeadersVisitor>>;

  constructor(
    logger: ILogger,
    processor: ICsvProcessor<ICsvProcessorState<ICsvWithHeadersVisitor>>,
  ) {
    this.#logger = logger.fork(LoggerLabels.PROCESSOR_STATE_HEADERS);

    this.#processor = processor;
  }

  consume(record: string[]): IVistorAcceptor<ICsvWithHeadersVisitor> {
    this.#logger.debug('Consuming record', record);

    return {
      accept: async (visitor) => {
        await visitor.visitHeadersRecord(record);

        const nextState = new RecordProcessorState(this.#logger, record);

        this.#processor.updateState(nextState);
      },
    };
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
    };
  }
}

export default HeadersProcessorState;
