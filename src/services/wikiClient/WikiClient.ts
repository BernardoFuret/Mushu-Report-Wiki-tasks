import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IJsonSerializable } from '@/types';

import { type IBotCredentials, type IWikiClient } from './types';

// TODO: Decorators to add sleep?

class WikiClient implements IWikiClient, IJsonSerializable {
  #logger: ILogger;

  #botCredentials: IBotCredentials;

  constructor(logger: ILogger, botCredentials: IBotCredentials) {
    this.#logger = logger.fork(LoggerLabels.WIKI_CLIENT);

    this.#botCredentials = botCredentials;
  }

  async editPage(pagename: string, newContent: string): Promise<void> {
    this.#logger.info('Editing page', pagename);

    this.#logger.debug('With content', newContent);
  }

  async getPageContent(pagename: string): Promise<string> {
    this.#logger.info('Getting page content for', pagename);

    return 'TODO'; // TODO
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
      data: {
        username: this.#botCredentials.username,
      },
    };
  }
}

export default WikiClient;
