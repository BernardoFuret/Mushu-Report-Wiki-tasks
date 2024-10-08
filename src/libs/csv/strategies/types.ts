import { type ICsvProcessor } from '../csvProcessor';
import { type ICsvProcessorState } from '../states';
import { type ICsvWithHeadersVisitor } from '../visitors';

interface ICsvProcessorStrategy<
  TVisitor extends ICsvWithHeadersVisitor,
  TState extends ICsvProcessorState<TVisitor>,
> {
  buildInitialState(processor: ICsvProcessor<TState>): TState;
  getVisitor(): TVisitor;
}

export type { ICsvProcessorStrategy };
