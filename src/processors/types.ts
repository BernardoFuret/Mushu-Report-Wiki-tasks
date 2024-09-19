import { type IProcessorState } from './states/types.js';

interface IProcessor {
  updateState(state: IProcessorState): this;
  process(record: string[]): Promise<void>;
}

export type { IProcessor };
