import { createReadStream } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'csv-parse';

import { LoggerLabels } from './constants/logger';
import Processor from './processors/Processor';
import WikiClient from './services/wikiClient';
import config from './config';
import { getDataFilePath } from './helpers';
import Logger from './logger';

const srcDirname = dirname(fileURLToPath(import.meta.url));

const logger = Logger.create({ srcDirname, label: LoggerLabels.MAIN });

const stream = createReadStream(getDataFilePath(srcDirname, config.csvFileName)).pipe(parse());

const wikiClient = new WikiClient(logger, {
  username: 'TODO',
  password: 'TODO',
});

const processor = new Processor(logger, wikiClient);

logger.info('Starting');

logger.info('Reading from file', config.csvFileName);

// eslint-disable-next-line no-restricted-syntax
for await (const record of stream) {
  try {
    await processor.process(record);
  } catch (e) {
    logger.error('Caught unexpected error:', e);

    break;
  }
}

logger.info('Finished');
