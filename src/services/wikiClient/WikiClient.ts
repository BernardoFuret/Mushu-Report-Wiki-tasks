import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import Fetcher, { type IFetcher } from '@/services/fetcher';
import { type IJsonSerializable } from '@/types';

import { checkIsApiError } from './helpers';
import {
  type IApiErrorResponse,
  type IBotCredentials,
  type IEditApiResponse,
  type ILoginActionApiResponse,
  type IQueryMetaTokensApiResponse,
  type IQueryRevisionsApiResponse,
  type IWikiClient,
} from './types';

// TODO: Decorators to add sleep?

// TODO: set headers with user agent

// TODO: receive bot rednetials on instantiation and have a retry in case the login fails
//  (decorator to assert if it's logged in and login if it isn't?)

class WikiClient implements IWikiClient, IJsonSerializable {
  #logger: ILogger;

  #wikiApiUrl: string;

  #fetcher: IFetcher;

  #editToken: string | null = null;

  constructor(logger: ILogger, wikiApiUrl: string) {
    this.#logger = logger.fork(LoggerLabels.WIKI_CLIENT);

    this.#wikiApiUrl = wikiApiUrl;

    this.#fetcher = new Fetcher(logger, wikiApiUrl);
  }

  async #getLoginToken() {
    this.#logger.info('Getting login token');

    const urlSearchParams = new URLSearchParams({
      action: 'query',
      meta: 'tokens',
      type: 'login',
      formatversion: '2',
      format: 'json',
    });

    const {
      query: {
        tokens: { logintoken },
      },
    } = await this.#fetcher.get<IQueryMetaTokensApiResponse<'logintoken'>>({
      query: urlSearchParams,
    });

    return logintoken;
  }

  async login(botCredentials: IBotCredentials): Promise<void> {
    this.#logger.info('Logging in as', botCredentials.username);

    const loginToken = await this.#getLoginToken();

    const urlSearchParams = new URLSearchParams({
      action: 'login',
      format: 'json',
    });

    const body = new URLSearchParams({
      lgname: botCredentials.username,
      lgpassword: botCredentials.password,
      lgtoken: loginToken,
    });

    const loginResponse = await this.#fetcher.post<ILoginActionApiResponse>({
      query: urlSearchParams,
      body,
    });

    if (loginResponse.login?.result !== 'Success') {
      throw new Error('Unsuccessful login attempt', { cause: { loginResponse } });
    }

    this.#logger.info('Successful login as', botCredentials.username);
  }

  async getPageContent(pagename: string): Promise<string> {
    this.#logger.info('Getting page content for', pagename);

    const urlSearchParams = new URLSearchParams({
      action: 'query',
      prop: 'revisions',
      rvprop: 'content',
      rvslots: '*',
      titles: pagename,
      assert: 'user',
      formatversion: '2',
      format: 'json',
    });

    const apiResult = await this.#fetcher.get<IQueryRevisionsApiResponse | IApiErrorResponse>({
      query: urlSearchParams,
    });

    const isApiError = checkIsApiError(apiResult);

    if (isApiError) {
      throw new Error('Received an error from the API', {
        cause: {
          pagename,
          apiResult,
          urlSearchParams,
          urlSearchParamsString: urlSearchParams.toString(),
        },
      });
    }

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

  async #getEditToken(): Promise<string> {
    // TODO
    this.#logger.info('Getting edit token');

    const urlSearchParams = new URLSearchParams({
      action: 'query',
      meta: 'tokens',
      type: 'csrf',
      formatversion: '2',
      format: 'json',
    });

    const {
      query: {
        tokens: { csrftoken },
      },
    } = await this.#fetcher.get<IQueryMetaTokensApiResponse<'csrftoken'>>({
      query: urlSearchParams,
    });

    return csrftoken;
  }

  async editPage(pagename: string, newContent: string): Promise<void> {
    this.#logger.info('Editing page', pagename);

    this.#logger.debug('With new content', newContent);

    const editToken = this.#editToken || (await this.#getEditToken());

    const urlSearchParams = new URLSearchParams({
      action: 'edit',
      title: pagename,
      text: newContent,
      nocreate: 'true',
      bot: 'true',
      token: editToken,
      assert: 'user',
      formatversion: '2',
      format: 'json',
    });

    const apiResult = await this.#fetcher.post<IEditApiResponse | IApiErrorResponse>({
      body: urlSearchParams,
    });

    const isApiError = checkIsApiError(apiResult);

    if (isApiError) {
      throw new Error('Received an error from the API', {
        cause: {
          pagename,
          apiResult,
          urlSearchParams,
          urlSearchParamsString: urlSearchParams.toString(),
        },
      });
    }

    if (apiResult.edit.result !== 'Success') {
      throw new Error(`Could not edit page ${pagename}`, {
        cause: {
          pagename,
          apiResult,
          urlSearchParams,
          urlSearchParamsString: urlSearchParams.toString(),
        },
      });
    }

    this.#logger.info('Edited page successfully. New revision ID is', apiResult.edit.newrevid);
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
      data: {
        wikiApiUrl: this.#wikiApiUrl,
      },
    };
  }
}

export default WikiClient;
