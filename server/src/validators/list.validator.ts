import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const listSchema = z.object({
  name: z.string(),
  listId: z.string(),
});

export const zListValidator = zValidator('json', listSchema);
