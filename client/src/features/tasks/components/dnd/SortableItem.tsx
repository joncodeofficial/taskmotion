import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { TASK_MAXWIDTH, TASK_MINWIDTH } from '@/shared/constants/base';
import { Task } from '@/features/tasks/components/Task';
import { TaskProps } from '@shared/types/task.types';

type SortableItemProps = {
  task: TaskProps;
};

const SortableItem = ({ task }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{
        maxWidth: `calc(clamp(${TASK_MINWIDTH}px, 100vw, ${TASK_MAXWIDTH}px))`,
        opacity: isDragging ? 0 : 1,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={`relative bg-gray-100 dark:bg-neutral-900 list-none user-select-none rounded-md mx-auto
        `}
    >
      <Task task={task} attributes={attributes} listeners={listeners} />
    </li>
  );
};

export default SortableItem;
