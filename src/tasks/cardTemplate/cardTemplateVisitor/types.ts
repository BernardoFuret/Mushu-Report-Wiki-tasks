type TCardTemplateParameters = Record<string, string>;

interface IParsedRecord {
  pagename: string;
  updates: Record<string, string>;
}

export type { IParsedRecord, TCardTemplateParameters };
