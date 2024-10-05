import { type IWikiClient } from '@/services/wikiClient';

import { type IProcessorState } from './states/types';

interface IProcessor<T> {
  getWikiClient(): IWikiClient;
  updateState(state: IProcessorState<T>): this;
  process(): Promise<void>;
}

export type { IProcessor };
