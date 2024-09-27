import { createReadStream } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'csv-parse';

import { LoggerLabels } from './constants/logger.js';
import Logger from './logger/index.js';
import Processor from './processors/Processor.js';
import { getDataFilePath } from './helpers.js';

const srcDirname = dirname(fileURLToPath(import.meta.url));

const logger = Logger.create({ srcDirname, label: LoggerLabels.MAIN });

const stream = createReadStream(getDataFilePath(srcDirname, 'example.csv')).pipe(parse());

const processor = new Processor();

// eslint-disable-next-line no-restricted-syntax
for await (const record of stream) {
  logger.info('««««««««««««');

  logger.debug(record);

  logger.warn('A warning', ['a'], processor, { a: { a: { a: { a: { a: { a: { a: {} } } } } } } });

  await processor.process(record);

  logger.error('An error', new Error('a', { cause: 'cause test' }), {
    o: 'an Object',
    oo: { data: [1, 2, 3] },
  });

  logger.info('»»»»»»»»»»»»');

  logger.fork('test label').info('Forked warning!');
}

// eslint-disable-next-line no-console
console.log('Finished');
