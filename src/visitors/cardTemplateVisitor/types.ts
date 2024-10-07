type TCardTemplateParameters = Record<string, string>;

interface IParsedRecord {
  pagename: string;
  content: Record<string, string>;
}

export type { IParsedRecord, TCardTemplateParameters };
