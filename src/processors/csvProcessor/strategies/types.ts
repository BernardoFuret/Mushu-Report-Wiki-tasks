import { type IProcessor } from '@/processors/types';
import { type ICsvWithHeadersVisitor } from '@/visitors/types';

import { type ICsvProcessorState } from '../states/types';

interface IProcessorStrategy<
  TVisitor extends ICsvWithHeadersVisitor,
  TState extends ICsvProcessorState<TVisitor>,
> {
  buildInitialState(processor: IProcessor<TState>): TState;
  getVisitor(): TVisitor;
}

export type { IProcessorStrategy };
