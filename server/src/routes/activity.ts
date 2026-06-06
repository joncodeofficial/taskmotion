import { Hono } from 'hono';
import { supabaseMiddleware } from '@/middleware/supabase';
import { logActivity, getActivity } from '@/services/activity';

export const activityApp = new Hono();

activityApp.use('*', supabaseMiddleware);

activityApp.get('/:email', async (c) => {
  const email = c.req.param('email');
  const { data, error } = await getActivity(c, email);
  if (error) return c.json({ error: error.message }, 400);

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.date] = (counts[row.date] || 0) + 1;
  }

  const activity = Object.entries(counts).map(([date, count]) => ({ date, count }));
  return c.json({ data: activity }, 200);
});

activityApp.post('/:email', async (c) => {
  const email = c.req.param('email');
  const today = new Date().toISOString().split('T')[0];
  const { error } = await logActivity(c, email, today);
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ success: true }, 201);
});
