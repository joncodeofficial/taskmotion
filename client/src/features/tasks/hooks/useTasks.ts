import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTasksByListId,
  createTask,
  updateTask,
  deleteTask,
  deleteTasksByListId,
  reorderTasks,
  duplicateTask,
  moveTask,
} from '../services/taskService';
import { TaskProps } from '@shared/types/task.types';

export const useTasks = (listId?: string) => {
  const query = useQuery({
    queryKey: ['tasks', listId],
    queryFn: () => getTasksByListId(listId!),
    enabled: !!listId,
  });

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onMutate: (variables) => {
      const queryKey = ['tasks', variables.list_id];
      const previous = queryClient.getQueryData<TaskProps[]>(queryKey);
      const newTask: TaskProps = {
        id: variables.id,
        list_id: variables.list_id,
        name: variables.name,
        description: variables.description,
        checked: variables.checked,
        date: variables.date,
        position: variables.position,
      };
      queryClient.setQueryData<TaskProps[]>(queryKey, [newTask, ...(previous ?? [])]);
      return { previous };
    },
    onError: (_err, variables, context) => {
      queryClient.setQueryData(['tasks', variables.list_id], context?.previous);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.list_id] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onMutate: ({ taskId, body }) => {
      const allCaches = queryClient.getQueriesData<TaskProps[]>({ queryKey: ['tasks'] });
      for (const [queryKey, tasks] of allCaches) {
        if (!tasks?.some((t) => t.id === taskId)) continue;
        queryClient.setQueryData<TaskProps[]>(
          queryKey,
          tasks.map((t) => (t.id === taskId ? { ...t, ...body } : t))
        );
        return { queryKey, previous: tasks };
      }
    },
    onError: (_err, _vars, context) => {
      if (context) queryClient.setQueryData(context.queryKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onMutate: (taskId) => {
      const allCaches = queryClient.getQueriesData<TaskProps[]>({ queryKey: ['tasks'] });
      for (const [queryKey, tasks] of allCaches) {
        if (!tasks?.some((t) => t.id === taskId)) continue;
        queryClient.setQueryData<TaskProps[]>(
          queryKey,
          tasks.filter((t) => t.id !== taskId)
        );
        return { queryKey, previous: tasks };
      }
    },
    onError: (_err, _vars, context) => {
      if (context) queryClient.setQueryData(context.queryKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useClearTasks = (listId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tasks: TaskProps[]) => deleteTasksByListId(tasks.map((task) => task.id)),
    onMutate: async () => {
      if (!listId) return;
      await queryClient.cancelQueries({ queryKey: ['tasks', listId] });
      const previous = queryClient.getQueryData<TaskProps[]>(['tasks', listId]);
      queryClient.setQueryData<TaskProps[]>(['tasks', listId], []);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (!listId) return;
      queryClient.setQueryData(['tasks', listId], context?.previous);
    },
    onSettled: () => {
      if (!listId) return;
      queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useReorderTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { items: { id: string; position: number }[]; listId: string; previousTasks: TaskProps[] }) =>
      reorderTasks(variables.items),
    onError: (_err, variables) => {
      queryClient.setQueryData(['tasks', variables.listId], variables.previousTasks);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.listId] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useDuplicateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { taskId: string; tempTask: TaskProps }) => duplicateTask(variables.taskId),
    onMutate: ({ tempTask }) => {
      const queryKey = ['tasks', tempTask.list_id];
      const previous = queryClient.getQueryData<TaskProps[]>(queryKey);
      queryClient.setQueryData<TaskProps[]>(queryKey, [tempTask, ...(previous ?? [])]);
      return { previous, tempId: tempTask.id };
    },
    onSuccess: (data, vars, context) => {
      if (context?.tempId && data.length > 0) {
        const queryKey = ['tasks', vars.tempTask.list_id];
        queryClient.setQueryData<TaskProps[]>(queryKey, (current) =>
          (current ?? []).map((t) => (t.id === context.tempId ? data[0] : t))
        );
      }
    },
    onError: (_err, vars, context) => {
      queryClient.setQueryData(['tasks', vars.tempTask.list_id], context?.previous);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.tempTask.list_id] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useMoveTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moveTask,
    onMutate: ({ taskId }) => {
      const allCaches = queryClient.getQueriesData<TaskProps[]>({ queryKey: ['tasks'] });
      for (const [queryKey, tasks] of allCaches) {
        if (!tasks?.some((t) => t.id === taskId)) continue;
        queryClient.setQueryData<TaskProps[]>(
          queryKey,
          tasks.filter((t) => t.id !== taskId)
        );
        return { queryKey, previous: tasks };
      }
    },
    onError: (_err, _vars, context) => {
      if (context) queryClient.setQueryData(context.queryKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};
