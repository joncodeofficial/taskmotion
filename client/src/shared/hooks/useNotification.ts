import { getNotifications, updateNotifications } from '@/shared/services/notificationsService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useNotifications = (email?: string) => {
  const query = useQuery({
    queryKey: ['notifications', email],
    queryFn: () => getNotifications(email!),
    enabled: !!email,
  });
  return {
    notifications: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
    isFetching: query.isFetching,
  };
};

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotifications,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', variables.email],
      });
    },
  });
};
