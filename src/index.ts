import { createReadStream } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'csv-parse';

import { LoggerLabels } from './constants/logger';
import Processor from './processors/Processor';
import config from './config';
import { getDataFilePath } from './helpers';
import Logger from './logger';

const srcDirname = dirname(fileURLToPath(import.meta.url));

const logger = Logger.create({ srcDirname, label: LoggerLabels.MAIN });

const stream = createReadStream(getDataFilePath(srcDirname, config.csvFileName)).pipe(parse());

const processor = new Processor(logger);

logger.info('Starting');

// eslint-disable-next-line no-restricted-syntax
for await (const record of stream) {
  await processor.process(record);
}

logger.info('Finished');
