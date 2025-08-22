/* eslint-disable react-hooks/exhaustive-deps */
import { TaskProps } from '@shared/types/task.types';
import { useTaskState } from './useTaskState';
import { useParams } from 'react-router-dom';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { useModalStore } from '@/features/tasks/store/modalStore';
import { ChangeEvent, useCallback } from 'react';
import { MAX_TIMEOUT, SIZE_ID } from '@/shared/constants/base';
import { nanoid } from 'nanoid';
import { updateTaskState } from '@/features/tasks/utils/updateTaskState';
import { getAIDescription } from '@/shared/services/aiService';
import { calculateHeight, resetHeight } from '@/features/tasks/utils/calculateHeight';
import { replaceEmojis } from '@/shared/utils/replaceEmojis';
import { UserAuth } from '@/app/context/AuthContext';
import { useUpdateNotifications } from '../../../../shared/hooks/useNotification';
import { createNotification } from '@/shared/utils/createNotification';
import { useLists, useUpdateList } from '@/features/lists/hooks/useLists';
// Hook para manejar los handlers de la tarea
export const useTaskHandlers = (task: TaskProps, state: ReturnType<typeof useTaskState>) => {
  const { listId } = useParams();
  const { tasks, setTasks } = useTaskStore();
  const { setIsOpen, setTask } = useModalStore();
  const { email } = UserAuth().user;
  const updateNotifications = useUpdateNotifications();
  const { lists } = useLists();
  const updateList = useUpdateList();

  const updateTaskAndLists = useCallback(
    (updatedTasks: TaskProps[]) => {
      if (!listId) return;
      updateList.mutate({ listId, body: { tasks: updatedTasks } });
    },
    [listId, setTasks, lists]
  );

  const handleDuplicate = useCallback(() => {
    if (!listId) return;
    const newTask = { ...task, id: nanoid(SIZE_ID) };
    const updateTasks = [newTask, ...tasks];
    updateTaskAndLists(updateTasks);
  }, [task, listId, tasks]);

  const handleMoveTo = useCallback(
    (listIdMove?: string) => {
      if (!listId || !listIdMove) return;
      const removeTask = tasks.filter((t) => t.id !== task.id);
      setTasks(removeTask);

      if (!lists) return;
      const currentIndex = lists.findIndex((l) => l.listId === listId);
      const currentList = [...lists];

      if (currentIndex !== -1) {
        currentList[currentIndex].tasks = removeTask;
        updateList.mutate({ listId, body: { tasks: removeTask } });
      }

      const moveList = [...lists];
      const moveIndex = lists.findIndex((l) => l.listId === listIdMove);

      if (moveIndex !== -1) {
        moveList[moveIndex].tasks = [task, ...lists[moveIndex].tasks];
        updateList.mutate({
          listId: listIdMove,
          body: { tasks: moveList[moveIndex].tasks },
        });
      }
    },
    [task, listId, tasks]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!listId) return;
      e.preventDefault();
      e.stopPropagation();
      const updatedTasks = tasks.filter((elem: TaskProps) => elem.id !== task.id);
      updateTaskAndLists(updatedTasks);

      const body = createNotification({
        type: 'task',
        action: 'deleted',
        message: task.name,
        id: task.id,
      });

      updateNotifications.mutate({ email, body });
    },
    [listId, tasks, updateTaskAndLists]
  );

  const handleBlurDescription = () => {
    if (!listId || state.description === task.description) return;
    const { id } = task;
    const updateTasks = updateTaskState(id, tasks, {
      description: state.description,
    });
    updateTaskAndLists(updateTasks);
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
      const updatedTasks = updateTaskState(task.id, tasks, {
        name: taskNameFormatted,
      });
      state.setPreviousName(taskNameFormatted);
      state.setTaskName(taskNameFormatted);
      updateTaskAndLists(updatedTasks);
    } else {
      state.setTaskName(state.previousName);
    }
    state.setIsFocused(false);
    resetHeight(state.textareaRef);
  }, [listId, state.taskName, tasks]);

  // Handler para generar la descripción de la tarea utilizando la IA
  const handleGenerateAIDescription = async () => {
    if (!listId || !state.taskName) return;
    try {
      state.setIsGeneratingAI(true);
      const newDescription = await getAIDescription(state.taskName, state.description);
      const updatedTasks = updateTaskState(task.id, tasks, {
        description: newDescription,
      });
      state.setDescription(newDescription);
      updateTaskAndLists(updatedTasks);
    } catch (error) {
      console.error('Error generating AI description:', error);
    } finally {
      state.setIsGeneratingAI(false);
    }
  };

  return {
    updateTaskAndLists,
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
  };
};
