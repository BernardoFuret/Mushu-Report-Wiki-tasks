import config from '@/config';
import { getDataFilePath } from '@/helpers';
import { CsvStreamerProcessor } from '@/libs/csv/processors';
import { CsvWithHeadersStrategy } from '@/libs/csv/strategies';
import WikiClient from '@/services/wikiClient';
import { type IContext } from '@/types';

import CardTemplateVisitor from './cardTemplateVisitor';
import { userAgent, wikiApiUrl } from './constants';

const main = async ({ logger, srcDirname }: IContext): Promise<void> => {
  logger.info('Reading from file', config.csvFileName);

  const csvFilePath = getDataFilePath(srcDirname, config.csvFileName);

  const wikiClient = new WikiClient(logger, wikiApiUrl, userAgent);

  await wikiClient.login({
    username: config.wiki.botUsername,
    password: config.wiki.botPassword,
  });

  const cardTemplateVisitor = new CardTemplateVisitor(logger, wikiClient);

  const strategy = new CsvWithHeadersStrategy(logger, cardTemplateVisitor);

  const processor = new CsvStreamerProcessor(logger, csvFilePath, strategy);

  await processor.process();
};

export default main;
