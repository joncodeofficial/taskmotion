/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { useModalStore } from '@/features/tasks/store/modalStore';
import { replaceEmojis } from '@/shared/utils/replaceEmojis';
import { format } from 'date-fns';
import { updateTaskState } from '@/features/tasks/utils/updateTaskState';
import { TaskProps } from '@shared/types/task.types';
import { useParams } from 'react-router-dom';
import { useTaskState } from './useTaskState';
import { useTaskHandlers } from './useTaskHandlers';

// Hook principal que compone los otros hooks y contiene los efectos
export const useTask = (task: TaskProps) => {
  const { listId } = useParams();
  const { tasks, setTasks } = useTaskStore();
  const { isOpen } = useModalStore();

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
    const updatedTasks = updateTaskState(task.id, tasks, {
      checked: state.checked,
      date: format(new Date(), 'MM-dd-yyyy'),
    });
    handlers.updateTaskAndLists(updatedTasks);
  }, [state.debouncedChecked]);

  // Sincronizar cambios en el nombre de la tarea
  useEffect(() => {
    if (state.deferredTaskName === task.name) return;
    const taskNameFormatted = replaceEmojis(state.deferredTaskName);
    const updatedTasks = updateTaskState(task.id, tasks, {
      name: taskNameFormatted,
    });
    setTasks(updatedTasks);
  }, [state.deferredTaskName]);

  // Sincronizar cambios en la fecha
  useEffect(() => {
    if (!listId || !state.date || state.date === task.date) return;
    const updateTasks = updateTaskState(task.id, tasks, {
      date: state.date as string,
    });
    handlers.updateTaskAndLists(updateTasks);
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
