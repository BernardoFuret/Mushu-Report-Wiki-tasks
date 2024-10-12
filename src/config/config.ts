import schema from './schema';
import { type IConfig } from './types';

const { error, data } = schema.safeParse(process.env);

if (error) {
  throw new Error('Invalid env vars', { cause: error.issues });
}

const config: IConfig = {
  isDebug: data.DEBUG,

  csvFileName: data.CSV_FILE_NAME,

  wiki: {
    botUsername: data.WIKI_BOT_USERNAME,
    botPassword: data.WIKI_BOT_PASSWORD,
  },
} as const;

export default config;
