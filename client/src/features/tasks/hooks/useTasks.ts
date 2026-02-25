import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTasksByListId,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
  duplicateTask,
  moveTask,
} from '../services/taskService';
import { useTaskStore } from '../store/taskStore';
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
      const previous = [...useTaskStore.getState().tasks];
      const newTask: TaskProps = {
        id: variables.id,
        list_id: variables.list_id,
        name: variables.name,
        description: variables.description,
        checked: variables.checked,
        date: variables.date,
        position: variables.position,
      };
      useTaskStore.getState().addTask(newTask);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) useTaskStore.getState().setTasks(context.previous);
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
      const previous = [...useTaskStore.getState().tasks];
      useTaskStore.getState().setTasks(
        previous.map((task) => (task.id === taskId ? { ...task, ...body } : task))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) useTaskStore.getState().setTasks(context.previous);
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
      const previous = [...useTaskStore.getState().tasks];
      useTaskStore.getState().deleteTask(taskId);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) useTaskStore.getState().setTasks(context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useReorderTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { items: { id: string; position: number }[]; previousTasks: TaskProps[] }) =>
      reorderTasks(variables.items),
    onError: (_err, variables) => {
      useTaskStore.getState().setTasks(variables.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDuplicateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { taskId: string; tempTask: TaskProps }) =>
      duplicateTask(variables.taskId),
    onMutate: ({ tempTask }) => {
      const previous = [...useTaskStore.getState().tasks];
      useTaskStore.getState().addTask(tempTask);
      return { previous, tempId: tempTask.id };
    },
    onSuccess: (data, _vars, context) => {
      if (context?.tempId && data.length > 0) {
        const current = useTaskStore.getState().tasks;
        const serverTask = data[0];
        useTaskStore.getState().setTasks(
          current.map((t) => (t.id === context.tempId ? serverTask : t))
        );
      }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) useTaskStore.getState().setTasks(context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useMoveTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moveTask,
    onMutate: ({ taskId }) => {
      const previous = [...useTaskStore.getState().tasks];
      useTaskStore.getState().deleteTask(taskId);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) useTaskStore.getState().setTasks(context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};
