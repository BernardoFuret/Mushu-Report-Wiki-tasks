import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import { type IJsonSerializable } from '@/types';

import { type IProcessor } from '../../../types';
import { type THeadersRecord } from '../headersProcessorState';
import { type ICsvProcessorState } from '../types';

import { isValidRecord, parseRecord } from './helpers';
import { processPageContent } from './transformers';
import { type TRecord } from './types';

class RecordProcessorState implements ICsvProcessorState, IJsonSerializable {
  #logger: ILogger;

  #processor: IProcessor;

  #headers: THeadersRecord;

  constructor(logger: ILogger, processor: IProcessor, headers: THeadersRecord) {
    this.#logger = logger.fork(LoggerLabels.PROCESSOR_STATE_RECORDS);

    this.#headers = headers;

    this.#processor = processor;
  }

  async #handleValidRecord(record: TRecord) {
    const parsedRecord = parseRecord(record, this.#headers);

    const wikiClient = this.#processor.getWikiClient();

    const pageContent = await wikiClient.getPageContent(parsedRecord.pagename);

    const updatedPageContent = processPageContent(pageContent, parsedRecord.content);

    if (updatedPageContent !== pageContent) {
      await wikiClient.editPage(parsedRecord.pagename, updatedPageContent);
    }
  }

  async consume(record: string[]): Promise<void> {
    this.#logger.info('Handling record', record);

    this.#logger.debug('Validating record', record);

    if (isValidRecord(record)) {
      this.#logger.debug('Record', record, 'is a valid record');

      try {
        await this.#handleValidRecord(record);
      } catch (error) {
        this.#logger.error('Error handling record', record, error);
      }
    } else {
      this.#logger.debug('Record', record, 'is not a valid record');

      this.#logger.error('Missing pagename on record', record);
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
