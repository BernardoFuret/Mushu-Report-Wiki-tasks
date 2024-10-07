interface IVistorAcceptor {
  accept(visitor: ICsvWithHeadersVisitor): Promise<void>;
}

interface ICsvWithHeadersVisitor {
  visitHeadersRecord(record: string[]): Promise<void>;
  visitDataRecord(record: string[], headersRecord: string[]): Promise<void>;
}

export type { ICsvWithHeadersVisitor, IVistorAcceptor };
