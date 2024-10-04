import { type IProcessor } from '../types';

interface IProcessorState {
  consume(processor: IProcessor): Promise<void>;
  checkIsFinalState(): boolean;
}

type THeadersRecord = [string, string, ...string[]];

export type { IProcessorState, THeadersRecord };
