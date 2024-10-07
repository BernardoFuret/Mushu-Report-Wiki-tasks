import { type IVistorAcceptor } from '@/visitors/types';

interface ICsvProcessorState {
  consume(record: string[]): IVistorAcceptor;
}

export type { ICsvProcessorState };
