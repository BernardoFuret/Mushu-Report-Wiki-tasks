import 'dotenv/config';

import path from 'node:path';

import zod from 'zod';

const schema = zod.object({
  CSV_FILE_NAME: zod
    .string()
    .transform((val) => path.basename(val))
    .pipe(
      zod.string().regex(/\w/, {
        message: 'No valid CSV file name found. A CSV file name is required and must match /\\w/',
      }),
    ),
  DEBUG: zod.coerce.boolean(),
});

export default schema;
