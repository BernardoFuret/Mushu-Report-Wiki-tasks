import { CookieJar } from 'tough-cookie';

import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger';

import { type IFetcher, type IGetRquestParameters, type IPostRquestParameters } from './types';

class Fetcher implements IFetcher {
  #logger: ILogger;

  #baseUrl: string;

  #cookieJar: CookieJar;

  constructor(logger: ILogger, baseUrl: string) {
    this.#logger = logger.fork(LoggerLabels.FETCHER);

    this.#baseUrl = baseUrl;

    this.#cookieJar = new CookieJar();
  }

  #buildUrl(path: string, query?: URLSearchParams) {
    const url = new URL(path, this.#baseUrl);

    if (query) {
      url.search = query.toString();
    }

    return url;
  }

  async #prepareHeaders() {
    const cookies = await this.#cookieJar.getCookies(this.#baseUrl);

    return {
      Cookie: cookies.map((cookie) => cookie.cookieString()).join(';'),
    };
  }

  async #fetch<T>(url: URL, fetchOptions: RequestInit): Promise<T> {
    this.#logger.debug('Fetching', {
      method: fetchOptions.method,
      url: url.toString(),
    });

    // TODO: baseHeaders here

    const response = await fetch(url, fetchOptions);

    const cookies = response.headers.getSetCookie();

    const [jsonData] = await Promise.all([
      response.json(),
      ...cookies.map((cookieString) => this.#cookieJar.setCookie(cookieString, this.#baseUrl)),
    ]);

    return jsonData;
  }

  async get<T>({ path = '', query, headers = {} }: IGetRquestParameters): Promise<T> {
    const url = this.#buildUrl(path, query);

    this.#logger.info('GET', url.toString());

    const baseHeaders = await this.#prepareHeaders();

    const jsonData = await this.#fetch<T>(url, {
      method: 'GET',
      headers: {
        ...baseHeaders,
        ...headers,
      },
    });

    return jsonData;
  }

  async post<T>({ path = '', query, headers = {}, body }: IPostRquestParameters): Promise<T> {
    const url = this.#buildUrl(path, query);

    this.#logger.info('POST', url.toString());

    const baseHeaders = await this.#prepareHeaders();

    const jsonData = await this.#fetch<T>(url, {
      method: 'POST',
      headers: {
        ...baseHeaders,
        ...headers,
      },
      body,
    });

    return jsonData;
  }
}

export default Fetcher;
