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

interface IFetcher {
  get<T>(parameters: IGetRquestParameters): Promise<T>;
  post<T>(parameters: IPostRquestParameters): Promise<T>;
}

export type { IFetcher, IGetRquestParameters, IPostRquestParameters };
