import axios from 'axios';
import { ListProps } from '@shared/types/list.types';
import { getApiBaseUrl } from '@/utils/getApiBaseUrl';

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

// Function to get all lists for a user
export const getLists = async (sessionToken: string): Promise<ListProps[]> => {
  try {
    const { data: response } = await axios.get(`${getApiBaseUrl()}api/lists`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Unexpected error while fetching lists');
  }
};

type CreateListProps = {
  email: string;
  body: ListProps;
};

// Function to create a new list
export const createList = async ({ email, body }: CreateListProps): Promise<ListProps[]> => {
  try {
    const { data } = await api.post<{ data: ListProps[] }>(`api/lists/${email}`, body);
    return data.data;
  } catch {
    throw new Error('Error al crear la lista');
  }
};

type ListUpdateProps = {
  listId: string;
  body: ListProps;
};

// Function to update an existing list
export const updateList = async ({ listId, body }: ListUpdateProps): Promise<void> => {
  try {
    await api.put(`api/lists/${listId}`, body);
  } catch {
    throw new Error('Error al actualizar la lista');
  }
};

type DeleteListProps = {
  listId: string;
};

// Function to delete a list
export const deleteList = async ({ listId }: DeleteListProps): Promise<void> => {
  try {
    await api.delete(`api/lists/${listId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error al eliminar la lista: ${error.message}`);
    }
    throw new Error('Error inesperado al eliminar la lista');
  }
};
