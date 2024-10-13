interface IBotCredentials {
  username: string;
  password: string;
}

interface IWikiClient {
  login(botCredentials: IBotCredentials): Promise<void>;
  getPageContent(pagename: string): Promise<string>;
  editPage(pagename: string, newContent: string, options?: unknown): Promise<void>;
}

interface IAssertApiResponse {
  error: {
    code: string;
  };
}

interface ILoginActionApiResponse {
  login?: { result?: string };
}

interface IQueryMetaTokensApiResponse {
  batchcomplete: boolean;
  query: {
    tokens: { logintoken: string };
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

export type {
  IAssertApiResponse,
  IBotCredentials,
  ILoginActionApiResponse,
  IQueryMetaTokensApiResponse,
  IQueryRevisionsApiResponse,
  IWikiClient,
};
