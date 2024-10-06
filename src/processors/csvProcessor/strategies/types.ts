import { type IProcessor } from '@/processors/types';

import { type ICsvProcessorState } from '../states/types';

interface IProcessorStrategy<S extends ICsvProcessorState> {
  buildInitialState(processor: IProcessor): S;
}

export type { IProcessorStrategy };
