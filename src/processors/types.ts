import { type IWikiClient } from '@/services/wikiClient';

import { type ICsvProcessorState } from './csvProcessor/states/types';

interface IProcessor {
  getWikiClient(): IWikiClient;
  updateState(state: ICsvProcessorState): this;
  process(): Promise<void>;
}

export type { IProcessor };
