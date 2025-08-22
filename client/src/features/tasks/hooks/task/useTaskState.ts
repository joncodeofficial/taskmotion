import { MAX_TIMEOUT } from '@/shared/constants/base';
import { TaskProps } from '@shared/types/task.types';
import { useDebounce } from '@uidotdev/usehooks';
import { useDeferredValue, useRef, useState } from 'react';

// Hook para manejar el estado de la tarea
export const useTaskState = (task: TaskProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null!);
  // Estados
  const [taskName, setTaskName] = useState(task.name);
  const [checked, setChecked] = useState(task.checked);
  const [date, setDate] = useState(task.date ?? undefined);
  const [description, setDescription] = useState(task.description);
  const [isFocused, setIsFocused] = useState(false);
  const [previousName, setPreviousName] = useState(task.name);
  const [countClick, setCountClick] = useState(0);
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  // Estados derivados
  const deferredTaskName = useDeferredValue(taskName);
  const debouncedChecked = useDebounce(checked, 300);
  const debouncedCountClick = useDebounce(countClick, MAX_TIMEOUT);

  return {
    textareaRef,
    taskName,
    setTaskName,
    checked,
    setChecked,
    date,
    setDate,
    description,
    setDescription,
    isFocused,
    setIsFocused,
    previousName,
    setPreviousName,
    countClick,
    setCountClick,
    lastTapTime,
    setLastTapTime,
    touchStartTime,
    setTouchStartTime,
    isGeneratingAI,
    setIsGeneratingAI,
    deferredTaskName,
    debouncedChecked,
    debouncedCountClick,
  };
};
