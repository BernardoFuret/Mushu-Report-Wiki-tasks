interface IProcessorState {
  handle(record: string[]): Promise<void>;
}

export type { IProcessorState };
