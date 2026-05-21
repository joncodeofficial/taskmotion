import axios from 'axios';
import { TaskProps } from '@shared/types/task.types';
import { getApiBaseUrl } from '@/shared/utils/getApiBaseUrl';

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

export const getTasksByListId = async (listId: string): Promise<TaskProps[]> => {
  const { data: response } = await api.get<{ data: TaskProps[] }>(`api/tasks/${listId}`);
  return response.data;
};

export const createTask = async (body: {
  id: string;
  list_id: string;
  name: string;
  description: string;
  position: number;
  checked: boolean;
  date: string;
}): Promise<TaskProps[]> => {
  const { data: response } = await api.post<{ data: TaskProps[] }>('api/tasks', body);
  return response.data;
};

export const updateTask = async ({
  taskId,
  body,
}: {
  taskId: string;
  body: Partial<Pick<TaskProps, 'name' | 'checked' | 'date' | 'description' | 'position'>>;
}): Promise<TaskProps[]> => {
  const { data: response } = await api.patch<{ data: TaskProps[] }>(`api/tasks/${taskId}`, body);
  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`api/tasks/${taskId}`);
};

export const deleteTasksByListId = async (taskIds: string[]): Promise<void> => {
  await Promise.all(taskIds.map((taskId) => deleteTask(taskId)));
};

export const reorderTasks = async (items: { id: string; position: number }[]): Promise<void> => {
  await api.put('api/tasks/reorder', items);
};

export const duplicateTask = async (taskId: string): Promise<TaskProps[]> => {
  const { data: response } = await api.post<{ data: TaskProps[] }>(`api/tasks/${taskId}/duplicate`);
  return response.data;
};

export const moveTask = async ({
  taskId,
  targetListId,
}: {
  taskId: string;
  targetListId: string;
}): Promise<TaskProps[]> => {
  const { data: response } = await api.post<{ data: TaskProps[] }>(`api/tasks/${taskId}/move`, {
    targetListId,
  });
  return response.data;
};
