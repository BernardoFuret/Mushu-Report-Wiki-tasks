import { type IProcessor } from '../types';

interface IProcessorState<T> {
  consume(processor: IProcessor<T>, record: T): Promise<void>;
}

type THeadersRecord = [string, string, ...string[]];

export type { IProcessorState, THeadersRecord };
