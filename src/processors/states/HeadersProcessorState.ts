import { type IProcessor } from '../types.js';

import RecordProcessorState from './RecordProcessorState.js';
import { type IProcessorState } from './types.js';

class HeadersProcessorState implements IProcessorState {
  constructor(
    // private logger: unknown,
    private processor: IProcessor,
  ) {}

  async handle(record: string[]): Promise<void> {
    // TODO
    // eslint-disable-next-line no-console
    console.log('>>HeadersProcessorState', record);

    const nextState = new RecordProcessorState(this.processor, record);

    this.processor.updateState(nextState);
  }
}

export default HeadersProcessorState;
