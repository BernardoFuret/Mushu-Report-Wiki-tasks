import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IProcessor } from '@/processors/types';
import { type ICsvWithHeadersVisitor } from '@/visitors/types';

import HeadersProcessorState from '../../states/headersProcessorState';
import { type ICsvProcessorState } from '../../states/types';
import { type IProcessorStrategy } from '../types';

class CsvWithHeadersStrategy
  implements IProcessorStrategy<ICsvWithHeadersVisitor, ICsvProcessorState<ICsvWithHeadersVisitor>>
{
  #logger: ILogger;

  #visitor: ICsvWithHeadersVisitor;

  constructor(logger: ILogger, visitor: ICsvWithHeadersVisitor) {
    this.#logger = logger.fork(LoggerLabels.CSV_WITH_HEADERS_STRATEGY);

    this.#visitor = visitor;
  }

  buildInitialState(
    processor: IProcessor<ICsvProcessorState<ICsvWithHeadersVisitor>>,
  ): ICsvProcessorState<ICsvWithHeadersVisitor> {
    return new HeadersProcessorState(this.#logger, processor);
  }

  getVisitor(): ICsvWithHeadersVisitor {
    return this.#visitor;
  }
}

export default CsvWithHeadersStrategy;
