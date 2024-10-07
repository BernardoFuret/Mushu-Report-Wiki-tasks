import { type ICsvVisitor } from '@/visitors/types';

import { type ICsvProcessorState } from './csvProcessor/states/types';

interface IProcessor {
  updateState(state: ICsvProcessorState): this;
  process(visitor: ICsvVisitor): Promise<void>;
}

export type { IProcessor };
