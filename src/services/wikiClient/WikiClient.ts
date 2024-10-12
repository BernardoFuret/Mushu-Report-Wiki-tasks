import { CookieJar } from 'tough-cookie';

import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';
import { type IJsonSerializable } from '@/types';

import {
  type IBotCredentials,
  type ILoginActionApiResponse,
  type IQueryMetaTokensApiResponse,
  type IQueryRevisionsApiResponse,
  type IWikiClient,
} from './types';

// TODO: Decorators to add sleep?

// TODO: set headers with user agent

class WikiClient implements IWikiClient, IJsonSerializable {
  #logger: ILogger;

  #wikiApiUrl: string;

  #cookieJar: CookieJar;

  constructor(logger: ILogger, wikiApiUrl: string) {
    this.#logger = logger.fork(LoggerLabels.WIKI_CLIENT);

    this.#wikiApiUrl = wikiApiUrl;

    this.#cookieJar = new CookieJar();
  }

  async #fetch<T = unknown>(
    urlSearchParams: URLSearchParams,
    fetchOptions?: RequestInit,
  ): Promise<T> {
    const url = `${this.#wikiApiUrl}?${urlSearchParams}`;

    this.#logger.debug('Fetching', {
      method: fetchOptions?.method,
      wikiApiUrl: this.#wikiApiUrl,
      urlSearchParams,
      urlSearchParamsString: urlSearchParams.toString(),
      url,
    });

    const response = await fetch(url, fetchOptions);

    const cookies = response.headers.getSetCookie();

    await cookies.reduce<Promise<unknown>>((chain, cookieString) => {
      return chain.then(() => this.#cookieJar.setCookie(cookieString, this.#wikiApiUrl));
    }, Promise.resolve());

    return response.json();
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
    } = await this.#fetch<IQueryMetaTokensApiResponse>(urlSearchParams);

    return logintoken;
  }

  async login(botCredentials: IBotCredentials): Promise<void> {
    this.#logger.info('Logging in as', botCredentials.username);

    const loginToken = await this.#getLoginToken();

    const urlSearchParams = new URLSearchParams({
      action: 'login',
      format: 'json',
    });

    const cookies = await this.#cookieJar.getCookies(this.#wikiApiUrl);

    const headers = {
      Cookie: cookies.map((cookie) => cookie.cookieString()).join(';'),
    };

    const body = new URLSearchParams({
      lgname: botCredentials.username,
      lgpassword: botCredentials.password,
      lgtoken: loginToken,
    });

    const loginResponse = await this.#fetch<ILoginActionApiResponse>(urlSearchParams, {
      method: 'POST',
      headers,
      body,
    });

    if (loginResponse.login?.result !== 'Success') {
      throw new Error('Unsuccessful login attempt', { cause: { loginResponse } });
    }

    throw new Error();
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

    const apiResult = await this.#fetch<IQueryRevisionsApiResponse>(urlSearchParams);

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
      },
    };
  }
}

export default WikiClient;
