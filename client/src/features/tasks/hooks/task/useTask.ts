/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useModalStore } from '@/features/tasks/store/modalStore';
import { format } from 'date-fns';
import { TaskProps } from '@shared/types/task.types';
import { useParams } from 'react-router-dom';
import { useTaskState } from './useTaskState';
import { useTaskHandlers } from './useTaskHandlers';
import { useUpdateTask } from '../useTasks';

// Hook principal que compone los otros hooks y contiene los efectos
export const useTask = (task: TaskProps) => {
  const { listId } = useParams();
  const { isOpen } = useModalStore();
  const updateTaskMutation = useUpdateTask();

  // Obtener el estado y los handlers
  const state = useTaskState(task);
  const handlers = useTaskHandlers(task, state);

  // Sincronizar estados cuando se abre/cierra el modal
  useEffect(() => {
    state.setTaskName(task.name);
    state.setChecked(task.checked);
    state.setDate(task.date);
    state.setDescription(task.description);
  }, [isOpen]);

  // Sincronizar cambios en el estado checked
  useEffect(() => {
    if (!listId || state.debouncedChecked === task.checked) return;
    updateTaskMutation.mutate({
      taskId: task.id,
      body: {
        checked: state.checked,
        date: format(new Date(), 'MM-dd-yyyy'),
      },
    });
  }, [state.debouncedChecked]);

  // Sincronizar cambios en la fecha
  useEffect(() => {
    if (!listId || !state.date || state.date === task.date) return;
    updateTaskMutation.mutate({
      taskId: task.id,
      body: { date: state.date as string },
    });
  }, [state.date]);

  // Manejar clics y doble clics
  useEffect(() => {
    if (state.debouncedCountClick === 0) return;
    if (state.debouncedCountClick === 1 && !state.isFocused) handlers.handleClick();
    if (state.debouncedCountClick > 1) handlers.handleDoubleClick();
    state.setCountClick(0);
  }, [state.debouncedCountClick]);

  return { ...state, ...handlers };
};
