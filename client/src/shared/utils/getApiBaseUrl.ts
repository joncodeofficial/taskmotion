import { TASKMOTION_API_DEV, TASKMOTION_API_PROD } from '@/config';

export const getApiBaseUrl = (): string => {
  return import.meta.env.DEV ? TASKMOTION_API_DEV : TASKMOTION_API_PROD;
};
