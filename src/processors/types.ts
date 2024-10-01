import { type IProcessorState } from './states/types';

interface IProcessor {
  updateState(state: IProcessorState): this;
  process(record: string[]): Promise<void>;
}

export type { IProcessor };
