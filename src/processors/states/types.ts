import { type IProcessor } from '../types';

interface IProcessorState<T> {
  consume(processor: IProcessor<T>, record: T): Promise<void>;
}

export type { IProcessorState };
