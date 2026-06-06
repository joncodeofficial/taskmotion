import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getActivity, logActivity } from '@/shared/services/activityService';

export const useActivity = (email?: string) => {
  const query = useQuery({
    queryKey: ['activity', email],
    queryFn: () => getActivity(email!),
    enabled: !!email,
  });
  return {
    activity: query.data ?? [],
    isLoading: query.isLoading,
  };
};

export const useLogActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logActivity,
    onSuccess: (_, email) => {
      queryClient.invalidateQueries({ queryKey: ['activity', email] });
    },
  });
};
