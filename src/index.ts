import { createReadStream } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'csv-parse';

import { getDataFilePath } from './helpers.js';
import { processRecord } from './processor.js';

const srcDirname = dirname(fileURLToPath(import.meta.url));

const stream = createReadStream(getDataFilePath(srcDirname, 'example.csv')).pipe(parse());

const headers: string[] = [];

// eslint-disable-next-line no-restricted-syntax
for await (const record of stream) {
  // eslint-disable-next-line no-console
  console.log('>>record', record);

  if (!headers.length) {
    headers.push(...record);
  } else {
    processRecord(record, headers);
  }
}
