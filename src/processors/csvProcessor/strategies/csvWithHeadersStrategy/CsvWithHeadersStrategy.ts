import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IProcessor } from '@/processors/types';

import HeadersProcessorState from '../../states/headersProcessorState';
import { type ICsvProcessorState } from '../../states/types';

class CsvWithHeadersStrategy {
  #logger: ILogger;

  constructor(logger: ILogger) {
    this.#logger = logger.fork(LoggerLabels.CSV_WITH_HEADERS_STRATEGY);
  }

  buildInitialState(processor: IProcessor): ICsvProcessorState {
    return new HeadersProcessorState(this.#logger, processor);
  }
}

export default CsvWithHeadersStrategy;
