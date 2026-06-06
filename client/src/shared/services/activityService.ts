import axios from 'axios';
import { getApiBaseUrl } from '@/shared/utils/getApiBaseUrl';

export type ActivityPoint = { date: string; count: number };

export const getActivity = async (email: string): Promise<ActivityPoint[]> => {
  const { data } = await axios.get<{ data: ActivityPoint[] }>(`${getApiBaseUrl()}api/activity/${email}`);
  return data.data;
};

export const logActivity = async (email: string): Promise<void> => {
  await axios.post(`${getApiBaseUrl()}api/activity/${email}`);
};
