import {
  getLists,
  updateList,
  createList,
  deleteList,
} from '@/features/lists/services/listService';
import { getLocalStorageByRegex } from '@/features/lists/utils/getLocalStorageByRegex';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useLists = () => {
  const authToken = getLocalStorageByRegex(/auth-token/i);
  const parseAuth = JSON.parse(authToken as string);

  const query = useQuery({
    queryKey: ['lists', parseAuth.access_token],
    queryFn: () => getLists(parseAuth.access_token),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    lists: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
    isFetching: query.isFetching,
  };
};

export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lists'],
      });
    },
  });
};

export const useUpdateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lists'],
      });
    },
  });
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lists'],
      });
    },
  });
};
