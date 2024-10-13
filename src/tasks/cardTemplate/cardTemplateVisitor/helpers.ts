import { type IParsedRecord } from './types';

/**
 * The first entry of the record is the pagename and is not necessary to be filed
 * on the headers record. But at least one more entry is needed and all entries
 * must not be empty.
 */
const isValidHeadersRecord = (record: string[]): boolean => {
  const [, ...recordRest] = record;

  return !!recordRest.length && !recordRest.some((recordPart) => !recordPart.trim());
};

const isValidDataRecord = (record: string[]): record is [string, ...string[]] => {
  return !!record?.[0]?.trim();
};

const parseRecord = (record: [string, ...string[]], headers: string[]): IParsedRecord => {
  const [, ...headersRest] = headers;

  const [pagename, ...recordRest] = record;

  return {
    pagename,
    updates: headersRest.reduce((acc, header, index) => {
      const contentValue = recordRest[index];

      return contentValue ? { ...acc, [header]: contentValue } : acc;
    }, {}),
  };
};

export { isValidDataRecord, isValidHeadersRecord, parseRecord };
