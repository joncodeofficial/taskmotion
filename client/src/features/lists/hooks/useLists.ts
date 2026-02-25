import {
  getLists,
  updateList,
  createList,
  deleteList,
} from '@/features/lists/services/listService';
import { getLocalStorageByRegex } from '@/features/lists/utils/getLocalStorageByRegex';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ListProps } from '@shared/types/list.types';

const LISTS_QUERY_KEY = ['lists'] as const;

type ListsSnapshot = Array<[readonly unknown[], ListProps[] | undefined]>;

const restoreListsSnapshot = (
  queryClient: ReturnType<typeof useQueryClient>,
  snapshot: ListsSnapshot
) => {
  snapshot.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });
};

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
    onMutate: async ({ body }) => {
      await queryClient.cancelQueries({
        queryKey: LISTS_QUERY_KEY,
      });

      const previousLists = queryClient.getQueriesData<ListProps[]>({
        queryKey: LISTS_QUERY_KEY,
      });

      queryClient.setQueriesData<ListProps[]>({ queryKey: LISTS_QUERY_KEY }, (old) => {
        const currentLists = old ?? [];
        return [...currentLists, body];
      });

      return { previousLists };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      restoreListsSnapshot(queryClient, context.previousLists);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: LISTS_QUERY_KEY,
      });
    },
  });
};

export const useUpdateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateList,
    onMutate: async ({ listId, body }) => {
      await queryClient.cancelQueries({
        queryKey: LISTS_QUERY_KEY,
      });

      const previousLists = queryClient.getQueriesData<ListProps[]>({
        queryKey: LISTS_QUERY_KEY,
      });

      queryClient.setQueriesData<ListProps[]>({ queryKey: LISTS_QUERY_KEY }, (old) => {
        if (!old) return old;
        return old.map((list) =>
          list.listId === listId
            ? {
                ...list,
                ...body,
              }
            : list
        );
      });

      return { previousLists };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      restoreListsSnapshot(queryClient, context.previousLists);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: LISTS_QUERY_KEY,
      });
    },
  });
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteList,
    onMutate: async ({ listId }) => {
      await queryClient.cancelQueries({
        queryKey: LISTS_QUERY_KEY,
      });

      const previousLists = queryClient.getQueriesData<ListProps[]>({
        queryKey: LISTS_QUERY_KEY,
      });

      queryClient.setQueriesData<ListProps[]>({ queryKey: LISTS_QUERY_KEY }, (old) => {
        if (!old) return old;
        return old.filter((list) => list.listId !== listId);
      });

      return { previousLists };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      restoreListsSnapshot(queryClient, context.previousLists);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: LISTS_QUERY_KEY,
      });
    },
  });
};
