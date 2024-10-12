interface IConfig {
  readonly isDebug: boolean;

  readonly csvFileName: string;
  readonly wiki: {
    readonly botUsername: string;
    readonly botPassword: string;
  };
}

export type { IConfig };
