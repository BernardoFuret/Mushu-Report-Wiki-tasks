import path from 'node:path';

import winston from 'winston';

import { jsonReplacer, messageFormatter } from './formatters.js';
import { type IBaseLogger, type IBaseLoggerOptions } from './types.js';

const generateLogPath = (srcDirname: string, filename: string): string => {
  return path.join(srcDirname, '..', 'logs', filename);
};

const createBaseLogger = ({ srcDirname, truncateLogFiles }: IBaseLoggerOptions): IBaseLogger => {
  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(messageFormatter),
  );

  const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json({ replacer: jsonReplacer }),
  );

  const fileTransportsOptions = {
    flags: truncateLogFiles ? 'w' : 'a',
  };

  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'debug', // TODO: configure via env file?
        format: consoleFormat,
      }),
      new winston.transports.File({
        level: 'info',
        filename: generateLogPath(srcDirname, 'combined.log'),
        format: fileFormat,
        options: fileTransportsOptions,
      }),
      new winston.transports.File({
        level: 'error',
        filename: generateLogPath(srcDirname, 'errors.log'),
        format: fileFormat,
        options: fileTransportsOptions,
      }),
    ],
  });
};

export { createBaseLogger, generateLogPath };
