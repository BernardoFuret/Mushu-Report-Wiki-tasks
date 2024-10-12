import 'dotenv/config';

import path from 'node:path';

import zod from 'zod';

const schema = zod.object({
  DEBUG: zod.coerce.boolean(),

  CSV_FILE_NAME: zod
    .string()
    .transform((val) => path.basename(val))
    .pipe(
      zod.string().regex(/\w/, {
        message: 'No valid CSV file name found. A CSV file name is required and must match /\\w/',
      }),
    ),

  WIKI_BOT_USERNAME: zod.string().trim().min(1),
  WIKI_BOT_PASSWORD: zod.string().trim().min(1),
});

export default schema;
