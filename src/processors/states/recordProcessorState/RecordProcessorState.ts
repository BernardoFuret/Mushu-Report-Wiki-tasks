import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import { type IWikiClient } from '@/services/wikiClient';
import { type IJsonSerializable } from '@/types';

import { type IProcessor } from '../../types';
import { type IProcessorState, type THeadersRecord } from '../types';

import { isValidRecord, parseRecord } from './helpers';
import { processPageContent } from './transformers';

class RecordProcessorState implements IProcessorState, IJsonSerializable {
  #logger: ILogger;

  #wikiClient: IWikiClient;

  #headers: THeadersRecord;

  constructor(logger: ILogger, processor: IProcessor, headers: THeadersRecord) {
    this.#logger = logger.fork(LoggerLabels.PROCESSOR_STATE_RECORDS);

    this.#wikiClient = processor.getWikiClient(); // TODO: use DI?

    this.#headers = headers;
  }

  async handle(record: string[]): Promise<void> {
    this.#logger.debug('Handling record', record);

    this.#logger.debug('Validating record', record);

    // TODO: handle errors

    if (isValidRecord(record)) {
      this.#logger.debug('Record', record, 'is a valid record');

      const parsedRecord = parseRecord(record, this.#headers);

      const pageContent = await this.#wikiClient.getPageContent(parsedRecord.pagename); // TODO: [error, pageContent]

      const updatedPageContent = processPageContent(pageContent, parsedRecord.content);

      if (updatedPageContent !== pageContent) {
        await this.#wikiClient.editPage(parsedRecord.pagename, updatedPageContent);
      }
    } else {
      this.#logger.debug('Record', record, 'is not a valid record');

      // TODO
    }
  }

  toJSON(): unknown {
    return {
      class: this.constructor.name,
      data: {
        headers: this.#headers,
      },
    };
  }
}

export default RecordProcessorState;
