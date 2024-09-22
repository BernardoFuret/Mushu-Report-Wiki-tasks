import path from 'node:path';

const generateLogPath = (srcDirname: string, filename: string): string => {
  return path.join(srcDirname, '..', 'logs', filename);
};

export { generateLogPath };
