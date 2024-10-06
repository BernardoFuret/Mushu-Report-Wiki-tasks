import { type IProcessor } from '../../types';

interface ICsvProcessorState {
  consume(processor: IProcessor, record: string[]): Promise<void>;
}

export type { ICsvProcessorState };
