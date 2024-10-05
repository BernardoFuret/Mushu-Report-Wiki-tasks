import { LoggerLabels } from '@/constants/logger';
import { type ILogger } from '@/logger/types';
import { type IStreamReader } from '@/services/streamReader';
import { type IJsonSerializable } from '@/types';

import { type IProcessor } from '../../types';
import ProcessorState from '../ProcessorState';
import { type IProcessorState, type THeadersRecord } from '../types';

import { isValidRecord, parseRecord } from './helpers';
import { processPageContent } from './transformers';

class RecordProcessorState
  extends ProcessorState<string[]>
  implements IProcessorState<string[]>, IJsonSerializable
{
  #logger: ILogger;

  #headers: THeadersRecord;

  constructor(logger: ILogger, headers: THeadersRecord) {
    super();

    this.#logger = logger.fork(LoggerLabels.PROCESSOR_STATE_RECORDS);

    this.#headers = headers;
  }

  async consume(
    processor: IProcessor<string[]>,
    streamReader: IStreamReader<string[]>,
  ): Promise<void> {
    const wikiClient = processor.getWikiClient();

    const record = streamReader.readStream();

    this.#logger.debug('Validating record', record);

    // TODO: handle errors

    if (isValidRecord(record)) {
      this.#logger.debug('Record', record, 'is a valid record');

      const parsedRecord = parseRecord(record, this.#headers);

      const pageContent = await wikiClient.getPageContent(parsedRecord.pagename); // TODO: [error, pageContent]

      const updatedPageContent = processPageContent(pageContent, parsedRecord.content);

      if (updatedPageContent !== pageContent) {
        await wikiClient.editPage(parsedRecord.pagename, updatedPageContent);
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
