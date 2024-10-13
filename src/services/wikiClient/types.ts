interface IBotCredentials {
  username: string;
  password: string;
}

interface IWikiClient {
  getPageContent(pagename: string): Promise<string>;
  editPage(pagename: string, newContent: string, options?: unknown): Promise<void>;
}

interface IRevisionsApiResponse {
  batchcomplete: boolean;
  query?: {
    pages: {
      title: string;
      revisions?: { slots: { main: { content: string } } }[];
    }[];
  };
}

export type { IBotCredentials, IRevisionsApiResponse, IWikiClient };
