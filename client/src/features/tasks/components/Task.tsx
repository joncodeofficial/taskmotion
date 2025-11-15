import { TaskProps } from '@shared/types/task.types';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import { TextInput } from '@/shared/components/ui/text-input';
import { DeleteButton } from '@/shared/components/buttons/DeleteButton';
import { useDragStore } from '@/features/tasks/store/dragStore';
import { useTask } from '@/features/tasks/hooks/task/useTask';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import SortableButton from '@/features/tasks/components/dnd/SortableButton';
import { TextDisplay } from '@/shared/components/TextDisplay';
import { dateStyle, dateText } from '@/features/tasks/utils/dateUtils';
import { OptionTaskButton } from '@/shared/components/buttons/OptionTaskButton';

interface TaskComponentProps {
  task: TaskProps;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}

export const Task = ({ task, attributes, listeners }: TaskComponentProps) => {
  const { isDragging: isDraggingStore } = useDragStore();

  const {
    textareaRef,
    taskName,
    checked,
    isFocused,
    handleChange,
    handleBlur,
    handleDelete,
    handleCheckboxChange,
    handleClicks,
    handleTouchStart,
    handleTouchEnd,
    handleDuplicate,
    handleMoveTo,
    handleCopyClipboard,
  } = useTask(task);

  return (
    <div
      title={task.name}
      className={`w-full p-2 my-1 overflow-x-hidden
      rounded-md flex justify-between items-center text-neutral-500 dark:text-neutral-100
      bg-neutral-100 dark:bg-neutral-900`}
    >
      <SortableButton attributes={attributes} listeners={listeners} />

      <Checkbox
        name='checked'
        disabled={isDraggingStore}
        checked={checked}
        onChange={handleCheckboxChange}
        classNameContainer='self-baseline'
        className='ml-1 disabled:cursor-default z-10 top-1.5'
      />

      <TextInput
        ref={textareaRef}
        value={taskName}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`mx-1.5 opacity-0 
          ${
            isFocused &&
            `
           bg-neutral-200 focus:bg-white dark:bg-neutral-900
           dark:focus:bg-neutral-800 focus:opacity-100 peer`
          }`}
      />

      <TextDisplay
        taskName={taskName}
        checked={checked}
        date={task.date || ''}
        onClick={handleClicks}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      {task.date && !checked && (
        <Badge text={dateText(task.date)} className={dateStyle(task.date)} />
      )}

      <DeleteButton onClick={handleDelete} onTouchEnd={handleDelete} />

      <OptionTaskButton
        handleDuplicate={handleDuplicate}
        handleMoveTo={handleMoveTo}
        handleCopyClipboard={handleCopyClipboard}
      />
    </div>
  );
};
