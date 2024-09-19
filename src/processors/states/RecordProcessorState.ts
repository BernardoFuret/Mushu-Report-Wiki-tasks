import { type IProcessor } from '../types.js';

import { type IProcessorState } from './types.js';

class RecordProcessorState implements IProcessorState {
  constructor(
    // private logger: unknown,
    private processor: IProcessor,
    private headers: string[],
  ) {}

  async handle(record: string[]): Promise<void> {
    // TODO
    // eslint-disable-next-line no-console
    console.log('>>RecordProcessorState', record, this.headers);
  }
}

export default RecordProcessorState;
