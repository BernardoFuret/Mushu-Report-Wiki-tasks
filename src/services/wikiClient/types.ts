interface IBotCredentials {
  username: string;
  password: string;
}

interface IWikiClient {
  login(botCredentials: IBotCredentials): Promise<void>;
  getPageContent(pagename: string): Promise<string>;
  editPage(pagename: string, newContent: string, options?: unknown): Promise<void>;
}

interface IApiErrorResponse {
  error: {
    code: string;
    info: string;
  };
}

interface ILoginActionApiResponse {
  login?: { result?: string };
}

type TTokenTypes =
  | 'createaccounttoken'
  | 'csrftoken'
  | 'logintoken'
  | 'patroltoken'
  | 'rollbacktoken'
  | 'userrightstoken'
  | 'watchtoken';

interface IQueryMetaTokensApiResponse<T extends TTokenTypes> {
  batchcomplete: boolean;
  query: {
    tokens: { [K in T]: string };
  };
}

interface IQueryRevisionsApiResponse {
  batchcomplete: boolean;
  query?: {
    pages: {
      title: string;
      revisions?: { slots: { main: { content: string } } }[];
    }[];
  };
}

interface IEditApiResponse {
  edit: {
    result: 'Success';
    newrevid: number;
  };
}

export type {
  IApiErrorResponse,
  IBotCredentials,
  IEditApiResponse,
  ILoginActionApiResponse,
  IQueryMetaTokensApiResponse,
  IQueryRevisionsApiResponse,
  IWikiClient,
};
