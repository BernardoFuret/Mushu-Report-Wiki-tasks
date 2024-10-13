import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LoggerLabels } from './constants/logger';
import cardTemplateTask from './tasks/cardTemplate';
import Logger from './logger';

const srcDirname = dirname(fileURLToPath(import.meta.url));

const logger = Logger.create({ srcDirname, label: LoggerLabels.MAIN });

logger.info('Starting');

try {
  await cardTemplateTask({ logger, srcDirname });
} catch (error) {
  logger.error(error);
} finally {
  logger.info('Finished');
}
