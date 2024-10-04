import { type IWikiClient } from '@/services/wikiClient';

import { type IProcessorState } from './states/types';

interface IProcessor {
  getWikiClient(): IWikiClient;
  updateState(state: IProcessorState): this;
  readStream(): string[];
  process(): Promise<void>;
}

export type { IProcessor };
