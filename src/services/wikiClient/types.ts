interface IBotCredentials {
  username: string;
  password: string;
}

interface IWikiClient {
  getPageContent(pagename: string): Promise<string>;
  editPage(pagename: string, newContent: string, options?: unknown): Promise<void>;
}

export type { IBotCredentials, IWikiClient };
