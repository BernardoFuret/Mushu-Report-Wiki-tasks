import { type IStreamReader } from '@/services/streamReader';

import { type IProcessor } from '../types';

import { type IProcessorState } from './types';

abstract class ProcessorState<T> implements IProcessorState<T> {
  #IS_FINAL_STATE = false;

  abstract consume(processor: IProcessor<T>, streamReader: IStreamReader<T>): Promise<void>;

  checkIsFinalState(): boolean {
    return this.#IS_FINAL_STATE;
  }
}

export default ProcessorState;
