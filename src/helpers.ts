import path from 'node:path';

const getDataDirPath = (srcDirname: string): string => {
  return path.join(srcDirname, '..', 'data');
};

const getDataFilePath = (srcDirname: string, filename: string): string => {
  return path.join(getDataDirPath(srcDirname), filename);
};

export { getDataFilePath };
