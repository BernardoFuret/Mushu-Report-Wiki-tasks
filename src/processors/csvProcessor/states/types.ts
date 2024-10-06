interface ICsvProcessorState {
  consume(record: string[]): Promise<void>;
}

export type { ICsvProcessorState };
