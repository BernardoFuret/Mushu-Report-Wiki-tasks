import { type ICsvWithHeadersVisitor } from '@/visitors/types';

import { type ICsvProcessorState } from './csvProcessor/states/types';

interface IProcessor<TState extends ICsvProcessorState<ICsvWithHeadersVisitor>> {
  updateState(state: TState): this;
  process(): Promise<void>;
}

export type { IProcessor };
