import { inspect } from 'node:util';

import type { IJsonReplacer, IMessageFormater } from './types.js';

const messageFormatter: IMessageFormater = ({ timestamp, level, label, message = [] }) => {
  const parsedMessage = message.map((part) => inspect(part, { depth: 5, colors: true })).join(' ');

  return `[${timestamp}] [${label}] [${level}]: ${parsedMessage}`;
};

const serializeError = (error: Error) => {
  return {
    error: true,
    type: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause,
  };
};

const jsonReplacer: IJsonReplacer = (_key, value) => {
  return value instanceof Error ? serializeError(value) : value;
};

export { jsonReplacer, messageFormatter };
