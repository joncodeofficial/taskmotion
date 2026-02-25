import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const createTaskSchema = z.object({
  id: z.string(),
  list_id: z.string(),
  name: z.string(),
  description: z.string().default(''),
  position: z.number(),
});

const updateTaskSchema = z.object({
  name: z.string().optional(),
  checked: z.boolean().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  position: z.number().optional(),
});

const reorderSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number(),
  })
);

const moveTaskSchema = z.object({
  targetListId: z.string(),
});

export const zCreateTaskValidator = zValidator('json', createTaskSchema);
export const zUpdateTaskValidator = zValidator('json', updateTaskSchema);
export const zReorderValidator = zValidator('json', reorderSchema);
export const zMoveTaskValidator = zValidator('json', moveTaskSchema);
