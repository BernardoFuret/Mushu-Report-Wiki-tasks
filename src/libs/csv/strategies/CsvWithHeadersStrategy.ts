import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';

import { type ICsvProcessor } from '../processors';
import { HeadersProcessorState } from '../states';
import { type ICsvProcessorState } from '../states';
import { type ICsvWithHeadersVisitor } from '../visitors';

import { type ICsvProcessorStrategy } from './types';

class CsvWithHeadersStrategy
  implements
    ICsvProcessorStrategy<ICsvWithHeadersVisitor, ICsvProcessorState<ICsvWithHeadersVisitor>>
{
  #logger: ILogger;

  #visitor: ICsvWithHeadersVisitor;

  constructor(logger: ILogger, visitor: ICsvWithHeadersVisitor) {
    this.#logger = logger.fork(LoggerLabels.CSV_WITH_HEADERS_STRATEGY);

    this.#visitor = visitor;
  }

  buildInitialState(
    processor: ICsvProcessor<ICsvProcessorState<ICsvWithHeadersVisitor>>,
  ): ICsvProcessorState<ICsvWithHeadersVisitor> {
    return new HeadersProcessorState(this.#logger, processor);
  }

  getVisitor(): ICsvWithHeadersVisitor {
    return this.#visitor;
  }
}

export default CsvWithHeadersStrategy;
