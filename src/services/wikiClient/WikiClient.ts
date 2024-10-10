import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IJsonSerializable } from '@/types';

import { type IBotCredentials, type IRevisionsApiResponse, type IWikiClient } from './types';

// TODO: Decorators to add sleep?

class WikiClient implements IWikiClient, IJsonSerializable {
  #logger: ILogger;

  #wikiApiUrl: string;

  #botCredentials: IBotCredentials;

  constructor(logger: ILogger, wikiApiUrl: string, botCredentials: IBotCredentials) {
    this.#logger = logger.fork(LoggerLabels.WIKI_CLIENT);

    this.#wikiApiUrl = wikiApiUrl;

    this.#botCredentials = botCredentials;
  }

  async #fetch<T = unknown>(urlSearchParams: URLSearchParams): Promise<T> {
    const url = `${this.#wikiApiUrl}?${urlSearchParams}`;

    this.#logger.debug('Fetching', {
      wikiApiUrl: this.#wikiApiUrl,
      urlSearchParams,
      urlSearchParamsString: urlSearchParams.toString(),
      url,
    });

    const response = await fetch(url);

    return response.json();
  }

  async editPage(pagename: string, newContent: string): Promise<void> {
    this.#logger.info('Editing page', pagename);

    this.#logger.debug('With content', newContent);
  }

  async getPageContent(pagename: string): Promise<string> {
    this.#logger.info('Getting page content for', pagename);

    const urlSearchParams = new URLSearchParams({
      action: 'query',
      prop: 'revisions',
      rvprop: 'content',
      rvslots: '*',
      titles: pagename,
      formatversion: '2',
      format: 'json',
    });

    const apiResult = await this.#fetch<IRevisionsApiResponse>(urlSearchParams);

    const content = apiResult?.query?.pages[0]?.revisions?.[0]?.slots.main.content;

    if (!content) {
      throw new Error(`Could not fetch content for page ${pagename}`, {
        cause: {
          pagename,
          apiResult,
          urlSearchParams,
          urlSearchParamsString: urlSearchParams.toString(),
        },
      });
    }

    return content;
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
      data: {
        wikiApiUrl: this.#wikiApiUrl,
        username: this.#botCredentials.username,
      },
    };
  }
}

export default WikiClient;
