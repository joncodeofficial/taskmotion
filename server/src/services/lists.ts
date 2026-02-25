import { BlankEnv, BlankInput } from 'hono/types';
import { getSupabase } from '@/middleware/supabase';
import { Context } from 'hono';
import { UserProps } from '@/types/user.types';
import { ListProps } from '@shared/types/list.types';

type ctx = Context<BlankEnv, '/', BlankInput>;

export const getUserByEmail = async (c: ctx, email: string) => {
  return getSupabase(c).from('users').select(`*`).eq(`email`, `${email}`);
};

export const getListInUser = async (c: ctx, lists: string[]) => {
  return getSupabase(c)
    .from('lists')
    .select('*')
    .order('created_at', { ascending: true })
    .in('listId', lists);
};

export const updateListsInUser = async (c: ctx, user: UserProps, listId: string, email: string) => {
  return getSupabase(c)
    .from('users')
    .update({
      lists: [...JSON.parse(user.lists.toString()), listId],
    })
    .eq('email', email);
};

export const createNewList = async (c: ctx, body: ListProps) => {
  return getSupabase(c).from('lists').insert(body).select();
};

export const updateList = async (c: ctx, listId: string, body: Pick<ListProps, 'name'>) => {
  const newData: Record<string, unknown> = {};

  if (body.name) newData.name = body.name;

  return getSupabase(c).from('lists').update(newData).eq('listId', listId);
};

export const getUsersByListId = async (c: ctx, listId: string) => {
  return getSupabase(c).from('users').select('*').filter('lists', 'like', `%${listId}%`);
};

export const updateUsersWithNewList = async (c: ctx, lists: string[], id: string) => {
  return getSupabase(c).from('users').update({ lists }).eq('id', id);
};

export const deleteList = async (c: ctx, listId: string) => {
  return getSupabase(c).from('lists').delete().eq('listId', listId);
};
