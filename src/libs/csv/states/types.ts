import { type ICsvWithHeadersVisitor, type IVistorAcceptor } from '../visitors';

interface ICsvProcessorState<TVisitor extends ICsvWithHeadersVisitor> {
  consume(record: string[]): IVistorAcceptor<TVisitor>;
}

export type { ICsvProcessorState };
