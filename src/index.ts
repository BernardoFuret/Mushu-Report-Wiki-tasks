import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LoggerLabels } from './constants/logger';
import CsvProcessor from './processors/csvProcessor';
import CsvWithHeadersStrategy from './processors/csvProcessor/strategies/csvWithHeadersStrategy';
import WikiClient from './services/wikiClient';
import CardTemplateVisitor from './visitors/cardTemplateVisitor/CardTemplateVisitor'; // TODO
import config from './config';
import { getDataFilePath } from './helpers';
import Logger from './logger';

const srcDirname = dirname(fileURLToPath(import.meta.url));

const logger = Logger.create({ srcDirname, label: LoggerLabels.MAIN });

const csvFilePath = getDataFilePath(srcDirname, config.csvFileName);

const wikiClient = new WikiClient(logger, {
  username: 'TODO',
  password: 'TODO',
});

const cardTemplateVisitor = new CardTemplateVisitor(logger, wikiClient);

const strategy = new CsvWithHeadersStrategy(logger, cardTemplateVisitor);

const processor = new CsvProcessor(logger, csvFilePath, strategy);

logger.info('Starting');

logger.info('Reading from file', config.csvFileName);

try {
  await processor.process();
} catch (error) {
  logger.error(error);
} finally {
  logger.info('Finished');
}
