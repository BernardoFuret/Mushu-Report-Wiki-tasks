import { type IProcessor } from '../csvProcessor';
import { type ICsvProcessorState } from '../states';
import { type ICsvWithHeadersVisitor } from '../visitors';

// TODO: rename to include CSV
interface IProcessorStrategy<
  TVisitor extends ICsvWithHeadersVisitor,
  TState extends ICsvProcessorState<TVisitor>,
> {
  buildInitialState(processor: IProcessor<TState>): TState;
  getVisitor(): TVisitor;
}

export type { IProcessorStrategy };
