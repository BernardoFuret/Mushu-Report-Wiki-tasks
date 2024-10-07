interface IVistorAcceptor {
  accept(visitor: ICsvVisitor): Promise<void>;
}

// TODO: Csv Visitor for the CsvWithHeadersStrategy only
interface ICsvVisitor {
  visitHeadersRecord(record: string[]): Promise<void>;
  visitDataRecord(record: string[], headersRecord: string[]): Promise<void>;
}

export type { ICsvVisitor, IVistorAcceptor };
