import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LoggerLabels } from './constants/logger';
import { CsvStreamerProcessor } from './libs/csv/processors';
import { CsvWithHeadersStrategy } from './libs/csv/strategies';
import WikiClient from './services/wikiClient';
import CardTemplateVisitor from './tasks/cardTemplate/cardTemplateVisitor';
import config from './config';
import { getDataFilePath } from './helpers';
import Logger from './logger';

const srcDirname = dirname(fileURLToPath(import.meta.url));

const logger = Logger.create({ srcDirname, label: LoggerLabels.MAIN });

const csvFilePath = getDataFilePath(srcDirname, config.csvFileName);

const wikiApiUrl = 'https://wiki.mushureport.com/api.php'; // TODO: move somewhere else?

const wikiClient = new WikiClient(logger, wikiApiUrl);

await wikiClient.login({
  username: config.wiki.botUsername,
  password: config.wiki.botPassword,
});

const cardTemplateVisitor = new CardTemplateVisitor(logger, wikiClient);

const strategy = new CsvWithHeadersStrategy(logger, cardTemplateVisitor);

const processor = new CsvStreamerProcessor(logger, csvFilePath, strategy);

logger.info('Starting');

logger.info('Reading from file', config.csvFileName);

try {
  await processor.process();
} catch (error) {
  logger.error(error);
} finally {
  logger.info('Finished');
}
