interface IFetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface IGetRquestParameters {
  path?: string;
  query?: URLSearchParams;
  headers?: Record<string, string>;
}

interface IPostRquestParameters {
  path?: string;
  query?: URLSearchParams;
  headers?: Record<string, string>;
  body?: BodyInit;
}

interface IFetcherOptions {
  headers?: Record<string, string>;
}

interface IFetcher {
  get<T>(parameters: IGetRquestParameters): Promise<T>;
  post<T>(parameters: IPostRquestParameters): Promise<T>;
}

export type {
  IFetcher,
  IFetcherOptions,
  IFetchOptions,
  IGetRquestParameters,
  IPostRquestParameters,
};
