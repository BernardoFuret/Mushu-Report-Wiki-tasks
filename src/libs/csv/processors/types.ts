import { type ICsvProcessorState } from '../states';
import { type ICsvWithHeadersVisitor } from '../visitors';

interface ICsvProcessor<TState extends ICsvProcessorState<ICsvWithHeadersVisitor>> {
  updateState(state: TState): this;
  process(): Promise<void>;
}

export type { ICsvProcessor };
