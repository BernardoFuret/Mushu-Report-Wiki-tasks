import schema from './schema';
import { type IConfig } from './types';

const { error, data } = schema.safeParse(process.env);

if (error) {
  throw new Error('Invalid env vars', { cause: error.issues });
}

const config: IConfig = Object.freeze({
  csvFileName: data.CSV_FILE_NAME,
  isDebug: data.DEBUG,
});

export default config;
