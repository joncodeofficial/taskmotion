import { BlankEnv, BlankInput } from 'hono/types';
import { getSupabase } from '@/middleware/supabase';
import { Context } from 'hono';

type ctx = Context<BlankEnv, '/', BlankInput>;

export const logActivity = async (c: ctx, email: string, date: string) => {
  return getSupabase(c).from('activity').insert({ email, date });
};

export const getActivity = async (c: ctx, email: string) => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return getSupabase(c)
    .from('activity')
    .select('date')
    .eq('email', email)
    .gte('date', oneYearAgo.toISOString().split('T')[0]);
};
