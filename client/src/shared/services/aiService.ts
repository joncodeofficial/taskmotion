import axios from 'axios';
import { getApiBaseUrl } from '@/shared/utils/getApiBaseUrl';
import { AIDescriptionResponse } from '@/shared/types/dataAI.types';

export const getAIDescription = async (taskName: string, description: string): Promise<string> => {
  try {
    const { data } = await axios.get<AIDescriptionResponse>(
      `${getApiBaseUrl()}api/ai/generateDescription?task=${taskName}&description=${description}`
    );
    return data.result.response.candidates[0].content.parts[0].text;
  } catch (e) {
    throw new Error('An error occurred while generating the AI description');
  }
};
