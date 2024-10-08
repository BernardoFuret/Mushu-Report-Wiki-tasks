import { type ICsvProcessorState } from '../states';
import { type ICsvWithHeadersVisitor } from '../visitors';

// TODO: rename to ICsvProcessor
interface IProcessor<TState extends ICsvProcessorState<ICsvWithHeadersVisitor>> {
  updateState(state: TState): this;
  process(): Promise<void>;
}

export type { IProcessor };
