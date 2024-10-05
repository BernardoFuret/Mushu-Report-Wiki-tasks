import { type IStreamReader } from '@/services/streamReader';

import { type IProcessor } from '../types';

interface IProcessorState<T> {
  consume(processor: IProcessor<T>, streamReader: IStreamReader<T>): Promise<void>;
  checkIsFinalState(): boolean;
}

type THeadersRecord = [string, string, ...string[]];

export type { IProcessorState, THeadersRecord };
