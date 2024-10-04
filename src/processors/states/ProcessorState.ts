import { type IProcessor } from '../types';

import { type IProcessorState } from './types';

abstract class ProcessorState implements IProcessorState {
  #IS_FINAL_STATE = false;

  abstract consume(processor: IProcessor): Promise<void>;

  checkIsFinalState(): boolean {
    return this.#IS_FINAL_STATE;
  }
}

export default ProcessorState;
