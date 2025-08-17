import { Hono } from 'hono';
import { getSupabase, supabaseMiddleware } from '@/middleware/supabase';
import { zListValidator } from '@/validators/list.validator';
import { UserProps } from '@/types/user.types';
import { ListProps } from '@shared/types/list.types';
import { jwtDecode } from 'jwt-decode';
import {
  createNewList,
  deleteList,
  getListInUser,
  getUserByEmail,
  getUsersByListId,
  updateList,
  updateListsInUser,
  updateUsersWithNewList,
} from '../services/lists';

export const listApp = new Hono();

listApp.use('*', supabaseMiddleware);

type JwtPayload = {
  user_metadata: {
    full_name: string;
    email: string;
  };
};

// GET A LIST OF USERS USING GOOGLE TOKEN
listApp.get('/', async (c) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const users = await getUserByEmail(c, decoded.user_metadata.email);
    const user = users.data?.[0] as UserProps;

    if (!user) {
      const body = {
        name: decoded.user_metadata.full_name,
        email: decoded.user_metadata.email,
        lists: [],
      };

      await getSupabase(c).from('users').insert(body).select();
      return c.json({ data: [] }, 200);
    }

    const lists = JSON.parse(user.lists.toString());

    const { data, error } = await getListInUser(c, lists);
    if (error) return c.json({ error }, 400);

    const order = (data as ListProps[]).map((list) => ({
      ...list,
      tasks: list.tasks.sort((a, b) => (a.checked ? 1 : b.checked ? -1 : 0)),
    }));

    return c.json({ data: order }, 200);
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// CREATE A NEW LIST
listApp.post('/:email', zListValidator, async (c) => {
  const body = (await c.req.json()) as ListProps;
  const email = c.req.param('email');

  const users = await getUserByEmail(c, email);

  const user = users.data?.[0] as UserProps;

  if (!user) return c.json({ error: 'User does not exist' }, 404);

  await updateListsInUser(c, user, body.listId as string, email);

  const { data, error } = await createNewList(c, body);

  if (error) return c.json({ error }, 400);

  return c.json({ data });
});

// UPDATE A LIST
listApp.put('/:listId', async (c) => {
  const body = (await c.req.json()) as ListProps;
  const listId = c.req.param('listId');

  const { data, error } = await updateList(c, listId, body);

  if (error) return c.json({ error }, 400);

  return c.json({ data }, 200);
});

// DELETE A LIST
listApp.delete('/:listId', async (c) => {
  const listId = c.req.param('listId');

  const { data: users, error: usersError } = await getUsersByListId(c, listId);

  if (usersError) return c.json({ error: usersError.message }, 400);

  for (const user of users as UserProps[]) {
    const lists = JSON.parse(user.lists.toString()) as string[];

    const newLists = lists.filter((id) => id !== listId.toString());

    const { error: updateUserError } = await updateUsersWithNewList(c, newLists, user.id);

    if (updateUserError) return c.json({ error: updateUserError }, 400);
  }

  const { data, error } = await deleteList(c, listId);

  if (error) return c.json({ error: error.message }, 400);

  return c.json({ data });
});
