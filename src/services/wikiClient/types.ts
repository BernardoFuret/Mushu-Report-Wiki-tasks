interface IBotCredentials {
  username: string;
  password: string;
}

interface IWikiClient {
  getPageContent(pagename: string): Promise<string>;
  editPage(pagename: string, newContent: string, options?: unknown): Promise<void>;
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
  IBotCredentials,
  ILoginActionApiResponse,
  IQueryMetaTokensApiResponse,
  IQueryRevisionsApiResponse,
  IWikiClient,
};
