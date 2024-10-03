interface IProcessorState {
  handle(record: string[]): Promise<void>;
}

type THeadersRecord = [string, string, ...string[]];

export type { IProcessorState, THeadersRecord };
