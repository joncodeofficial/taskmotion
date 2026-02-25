/* eslint-disable react-hooks/exhaustive-deps */
import { TaskProps } from '@shared/types/task.types';
import { useTaskState } from './useTaskState';
import { useParams } from 'react-router-dom';
import { useModalStore } from '@/features/tasks/store/modalStore';
import { ChangeEvent, useCallback } from 'react';
import { MAX_TIMEOUT } from '@/shared/constants/base';
import { getAIDescription } from '@/shared/services/aiService';
import { calculateHeight, resetHeight } from '@/features/tasks/utils/calculateHeight';
import { replaceEmojis } from '@/shared/utils/replaceEmojis';
import { UserAuth } from '@/app/context/AuthContext';
import { useUpdateNotifications } from '../../../../shared/hooks/useNotification';
import { createNotification } from '@/shared/utils/createNotification';
import { useUpdateTask, useDeleteTask, useDuplicateTask, useMoveTask } from '../useTasks';
import { nanoid } from 'nanoid';
import { SIZE_ID } from '@/shared/constants/base';

// Hook para manejar los handlers de la tarea
export const useTaskHandlers = (task: TaskProps, state: ReturnType<typeof useTaskState>) => {
  const { listId } = useParams();
  const { setIsOpen, setTask } = useModalStore();
  const { email } = UserAuth().user;
  const updateNotifications = useUpdateNotifications();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const duplicateTaskMutation = useDuplicateTask();
  const moveTaskMutation = useMoveTask();

  const handleDuplicate = useCallback(() => {
    if (!listId) return;
    const tempTask = { ...task, id: nanoid(SIZE_ID) };
    duplicateTaskMutation.mutate({ taskId: task.id, tempTask });
  }, [task, listId]);

  const handleCopyClipboard = useCallback(() => {
    if (!listId) return;
    navigator.clipboard.writeText(task.name);
  }, [task, listId]);

  const handleMoveTo = useCallback(
    (listIdMove?: string) => {
      if (!listId || !listIdMove) return;
      moveTaskMutation.mutate({ taskId: task.id, targetListId: listIdMove });
    },
    [task, listId]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!listId) return;
      e.preventDefault();
      e.stopPropagation();
      deleteTaskMutation.mutate(task.id);

      const body = createNotification({
        type: 'task',
        action: 'deleted',
        message: task.name,
        id: task.id,
      });

      updateNotifications.mutate({ email, body });
    },
    [listId, task]
  );

  const handleBlurDescription = () => {
    if (!listId || state.description === task.description) return;
    updateTaskMutation.mutate({ taskId: task.id, body: { description: state.description } });
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    state.setTaskName(e.target.value.trimStart());
    calculateHeight(state.textareaRef);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    state.setDescription(e.target.value.trimStart());
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    state.setChecked(e.target.checked);
    if (e.target.checked) {
      const body = createNotification({
        type: 'task',
        action: 'completed',
        message: task.name,
        id: task.id,
      });
      updateNotifications.mutate({ email, body });
    }
  };

  const handleClicks = (e: React.MouseEvent) => {
    state.setCountClick(e.detail);
  };

  // Handler para hacer doble clic en la tarea
  const handleDoubleClick = useCallback(() => {
    state.setIsFocused(true);
    setIsOpen(false);
    calculateHeight(state.textareaRef);
    if (state.textareaRef.current) state.textareaRef.current.focus();
  }, [setIsOpen, state.setIsFocused]);

  const handleClick = useCallback(() => {
    setIsOpen(true);
    setTask({ ...task, checked: state.checked });
  }, [task, state.checked, setIsOpen, setTask]);

  // Handler para iniciar el tiempo de pulsación y actualizar el contador de clics
  const handleTouchStart = useCallback(() => {
    if (state.isFocused) return;
    const currentTime = Date.now();
    state.setTouchStartTime(currentTime);
    const tapLength = currentTime - state.lastTapTime;
    state.setLastTapTime(tapLength < MAX_TIMEOUT && tapLength > 0 ? 0 : currentTime);
  }, [state.lastTapTime, state.isFocused]);

  // Handler para actualizar el contador de clics cuando se suelta el dedo
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (state.isFocused) return;
      e.preventDefault();
      const touchDuration = Date.now() - state.touchStartTime;
      if (touchDuration < MAX_TIMEOUT) state.setCountClick((prev) => prev + 1);
    },
    [state.touchStartTime, state.isFocused]
  );

  // Handler para actualizar el nombre de la tarea cuando se cambia
  const handleBlur = useCallback(() => {
    if (listId && state.taskName && state.taskName !== state.previousName) {
      const taskNameFormatted = replaceEmojis(state.taskName);
      state.setPreviousName(taskNameFormatted);
      state.setTaskName(taskNameFormatted);
      updateTaskMutation.mutate({ taskId: task.id, body: { name: taskNameFormatted } });
    } else {
      state.setTaskName(state.previousName);
    }
    state.setIsFocused(false);
    resetHeight(state.textareaRef);
  }, [listId, state.taskName]);

  // Handler para generar la descripción de la tarea utilizando la IA
  const handleGenerateAIDescription = async () => {
    if (!listId || !state.taskName) return;
    try {
      state.setIsGeneratingAI(true);
      const newDescription = await getAIDescription(state.taskName, state.description);
      state.setDescription(newDescription);
      updateTaskMutation.mutate({ taskId: task.id, body: { description: newDescription } });
    } catch (error) {
      console.error('Error generating AI description:', error);
    } finally {
      state.setIsGeneratingAI(false);
    }
  };

  return {
    handleDuplicate,
    handleMoveTo,
    handleDelete,
    handleBlurDescription,
    handleChange,
    handleChangeDescription,
    handleCheckboxChange,
    handleClicks,
    handleDoubleClick,
    handleClick,
    handleTouchStart,
    handleTouchEnd,
    handleBlur,
    handleGenerateAIDescription,
    handleCopyClipboard,
  };
};
