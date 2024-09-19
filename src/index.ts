import { createReadStream } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'csv-parse';

import Processor from './processors/Processor.js';
import { getDataFilePath } from './helpers.js';

const srcDirname = dirname(fileURLToPath(import.meta.url));

const stream = createReadStream(getDataFilePath(srcDirname, 'example.csv')).pipe(parse());

const processor = new Processor();

// eslint-disable-next-line no-restricted-syntax
for await (const record of stream) {
  await processor.process(record);
}

// eslint-disable-next-line no-console
console.log('Finished');
