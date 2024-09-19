import HeadersProcessorState from './states/HeadersProcessorState.js';
import { type IProcessorState } from './states/types.js';
import { type IProcessor } from './types.js';

class Processor implements IProcessor {
  #state: IProcessorState;

  constructor() {
    this.#state = new HeadersProcessorState(this);
  }

  updateState(state: IProcessorState): this {
    this.#state = state;

    return this;
  }

  async process(record: string[]): Promise<void> {
    return this.#state.handle(record);
  }
}

export default Processor;
