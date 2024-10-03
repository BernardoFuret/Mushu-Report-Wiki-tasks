import { type IWikiClient } from '@/services/wikiClient';

import { type IProcessorState } from './states/types';

interface IProcessor {
  getWikiClient(): IWikiClient;
  updateState(state: IProcessorState): this;
  process(record: string[]): Promise<void>;
}

export type { IProcessor };
