import { Hono } from 'hono';
import { supabaseMiddleware } from '@/middleware/supabase';
import {
  zCreateTaskValidator,
  zUpdateTaskValidator,
  zReorderValidator,
  zMoveTaskValidator,
} from '@/validators/task.validator';
import {
  getTasksByListId,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
  duplicateTask,
  moveTask,
} from '../services/tasks';
import { nanoid } from 'nanoid';

export const taskApp = new Hono();

taskApp.use('*', supabaseMiddleware);

// GET tasks by list ID
taskApp.get('/:listId', async (c) => {
  const listId = c.req.param('listId');
  const { data, error } = await getTasksByListId(c, listId);

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ data }, 200);
});

// CREATE a new task
taskApp.post('/', zCreateTaskValidator, async (c) => {
  const body = c.req.valid('json');
  const { data, error } = await createTask(c, body);

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ data }, 201);
});

// REORDER tasks
taskApp.put('/reorder', zReorderValidator, async (c) => {
  const items = c.req.valid('json');
  const { error } = await reorderTasks(c, items);

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ success: true }, 200);
});

// UPDATE a task (partial)
taskApp.patch('/:taskId', zUpdateTaskValidator, async (c) => {
  const taskId = c.req.param('taskId');
  const body = c.req.valid('json');
  const { data, error } = await updateTask(c, taskId, body);

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ data }, 200);
});

// DELETE a task
taskApp.delete('/:taskId', async (c) => {
  const taskId = c.req.param('taskId');
  const { data, error } = await deleteTask(c, taskId);

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ data }, 200);
});

// DUPLICATE a task
taskApp.post('/:taskId/duplicate', async (c) => {
  const taskId = c.req.param('taskId');
  const newId = nanoid(16);
  const { data, error } = await duplicateTask(c, taskId, newId);

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ data }, 201);
});

// MOVE a task to another list
taskApp.post('/:taskId/move', zMoveTaskValidator, async (c) => {
  const taskId = c.req.param('taskId');
  const { targetListId } = c.req.valid('json');
  const { data, error } = await moveTask(c, taskId, targetListId);

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ data }, 200);
});
