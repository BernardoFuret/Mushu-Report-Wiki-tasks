import { LoggerLabels } from '@/constants/logger';
import { type ICsvWithHeadersVisitor } from '@/libs/csv/visitors';
import { type ILogger } from '@/logger';
import { type IWikiClient } from '@/services/wikiClient';

import { isValidDataRecord, isValidHeadersRecord, parseRecord } from './helpers';
import { processPageContent } from './transformers';

class CardTemplateVisitor implements ICsvWithHeadersVisitor {
  #logger: ILogger;

  #wikiClient: IWikiClient;

  constructor(logger: ILogger, wikiClient: IWikiClient) {
    this.#logger = logger.fork(LoggerLabels.CARD_TEMPLATE_VISITOR);

    this.#wikiClient = wikiClient;
  }

  async visitHeadersRecord(record: string[]): Promise<void> {
    this.#logger.info('Handling headers record', record);

    if (!isValidHeadersRecord(record)) {
      throw new Error(
        'Invalid headers. Expected headers record to have at least one template parameter header',
        { cause: { record } },
      );
    }
  }

  async #handleValidDataRecord(dataRecord: [string, ...string[]], headersRecord: string[]) {
    const parsedRecord = parseRecord(dataRecord, headersRecord);

    const pageContent = await this.#wikiClient.getPageContent(parsedRecord.pagename);

    const updatedPageContent = processPageContent(pageContent, parsedRecord.content);

    this.#logger.debug('Transformed page content', {
      pageContent,
      updatedPageContent,
    });

    if (updatedPageContent !== pageContent) {
      await this.#wikiClient.editPage(parsedRecord.pagename, updatedPageContent);
    } else {
      this.#logger.warn(
        'No changes detected between the current content and updated content.',
        'Skipping',
        parsedRecord,
      );
    }
  }

  async visitDataRecord(record: string[], headersRecord: string[]): Promise<void> {
    this.#logger.info('Handling data record', record);

    if (isValidDataRecord(record)) {
      await this.#handleValidDataRecord(record, headersRecord).catch((error) => {
        this.#logger.error(error);
      });
    } else {
      this.#logger.error('Missing pagename on data record', record);
    }
  }
}

export default CardTemplateVisitor;
