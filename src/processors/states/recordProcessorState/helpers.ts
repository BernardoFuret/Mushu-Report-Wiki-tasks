import { type THeadersRecord } from '../types';

import { type IParsedRecord, type TRecord } from './types';

const isValidRecord = (record: string[]): record is TRecord => {
  return !!record?.[0]?.trim();
};

const parseRecord = (record: TRecord, headers: THeadersRecord): IParsedRecord => {
  const [, ...headersRest] = headers;

  const [pagename, ...recordRest] = record;

  return {
    pagename,
    content: headersRest.reduce((acc, header, index) => {
      const contentValue = recordRest[index];

      return contentValue ? { ...acc, [header]: contentValue } : acc;
    }, {}),
  };
};

export { isValidRecord, parseRecord };
