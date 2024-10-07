import { type ICsvWithHeadersVisitor } from '@/visitors/types';

import { type ICsvProcessorState } from './csvProcessor/states/types';

interface IProcessor {
  updateState(state: ICsvProcessorState): this;
  process(visitor: ICsvWithHeadersVisitor): Promise<void>;
}

export type { IProcessor };
