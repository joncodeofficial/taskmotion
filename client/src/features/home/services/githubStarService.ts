import axios from 'axios';
import { GITHUB_API_URL } from '@/config';

export const getGithubStar = async (): Promise<number> => {
  try {
    const { data } = await axios.get(GITHUB_API_URL);
    return data.watchers;
  } catch (e) {
    throw new Error('An error occurred getting the star count');
  }
};
