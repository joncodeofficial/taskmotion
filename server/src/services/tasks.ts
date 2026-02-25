import { BlankEnv, BlankInput } from 'hono/types';
import { getSupabase } from '@/middleware/supabase';
import { Context } from 'hono';

type ctx = Context<BlankEnv, '/', BlankInput>;

export const getTasksByListId = async (c: ctx, listId: string) => {
  return getSupabase(c)
    .from('tasks')
    .select('*')
    .eq('list_id', listId)
    .order('position', { ascending: true });
};

export const createTask = async (
  c: ctx,
  body: { id: string; list_id: string; name: string; description: string; position: number }
) => {
  return getSupabase(c).from('tasks').insert(body).select();
};

export const updateTask = async (
  c: ctx,
  taskId: string,
  body: Partial<{ name: string; checked: boolean; date: string; description: string; position: number }>
) => {
  return getSupabase(c).from('tasks').update(body).eq('id', taskId).select();
};

export const deleteTask = async (c: ctx, taskId: string) => {
  return getSupabase(c).from('tasks').delete().eq('id', taskId);
};

export const reorderTasks = async (c: ctx, items: { id: string; position: number }[]) => {
  const supabase = getSupabase(c);
  const results = await Promise.all(
    items.map((item) => supabase.from('tasks').update({ position: item.position }).eq('id', item.id))
  );

  const error = results.find((r) => r.error);
  if (error?.error) return { data: null, error: error.error };
  return { data: results, error: null };
};

export const duplicateTask = async (c: ctx, taskId: string, newId: string) => {
  const { data: original, error: fetchError } = await getSupabase(c)
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (fetchError || !original) return { data: null, error: fetchError };

  const newTask = {
    ...original,
    id: newId,
    checked: false,
    created_at: undefined,
  };
  delete newTask.created_at;

  return getSupabase(c).from('tasks').insert(newTask).select();
};

export const moveTask = async (c: ctx, taskId: string, targetListId: string) => {
  return getSupabase(c).from('tasks').update({ list_id: targetListId }).eq('id', taskId).select();
};
