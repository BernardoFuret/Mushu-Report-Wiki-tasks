import 'dotenv/config';

const csvFileName = process.env['CSV_FILE_NAME']?.trim();

if (!csvFileName) {
  throw new Error('No CSV file name found. A CSV file name is required');
}

const config = {
  isDebug: !!process.env['DEBUG'],
  csvFileName,
};

export default config;
