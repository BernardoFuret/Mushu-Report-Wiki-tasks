import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LoggerLabels } from './constants/logger';
import CsvProcessor from './processors/csvProcessor';
import HeadersProcessorState from './processors/csvProcessor/states/headersProcessorState';
import WikiClient from './services/wikiClient';
import config from './config';
import { getDataFilePath } from './helpers';
import Logger from './logger';

const srcDirname = dirname(fileURLToPath(import.meta.url));

const logger = Logger.create({ srcDirname, label: LoggerLabels.MAIN });

const csvFilePath = getDataFilePath(srcDirname, config.csvFileName);

const initialState = new HeadersProcessorState(logger);

const wikiClient = new WikiClient(logger, {
  username: 'TODO',
  password: 'TODO',
});

const processor = new CsvProcessor(logger, csvFilePath, initialState, wikiClient);

logger.info('Starting');

logger.info('Reading from file', config.csvFileName);

try {
  await processor.process();
} catch (error) {
  logger.error(error);
} finally {
  logger.info('Finished');
}
