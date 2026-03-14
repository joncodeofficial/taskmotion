import { useMemo, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  Active,
  Over,
  DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableOverlay } from './SortableOverlay';
import { Virtuoso } from 'react-virtuoso';
import { useParams } from 'react-router';
import { useDragStore } from '@/features/tasks/store/dragStore';
import SortableItem from './SortableItem';
import { useReorderTasks, useTasks } from '@/features/tasks/hooks/useTasks';
import { useQueryClient } from '@tanstack/react-query';
import { TaskProps } from '@shared/types/task.types';

type handleDragEndProps = {
  active: Active;
  over: Over | null;
};

const SortableList = () => {
  const { listId } = useParams();
  const [active, setActive] = useState<Active | null>(null);
  const { setIsDragging } = useDragStore();
  const { tasks } = useTasks(listId);
  const queryClient = useQueryClient();
  const reorderTasks = useReorderTasks();

  const activeItem = useMemo(() => tasks.find((item) => item.id === active?.id), [active, tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (!listId) return;
    setActive(active);
    setIsDragging(true);
  };

  const handleDragEnd = ({ active, over }: handleDragEndProps) => {
    if (!listId) return;
    if (over && active.id !== over.id) {
      const previousTasks = queryClient.getQueryData<TaskProps[]>(['tasks', listId]) ?? [];
      const activeIndex = previousTasks.findIndex(({ id }) => id === active.id);
      const overIndex = previousTasks.findIndex(({ id }) => id === over.id);
      const newOrder = arrayMove(previousTasks, activeIndex, overIndex);
      queryClient.setQueryData<TaskProps[]>(['tasks', listId], newOrder);
      const items = newOrder.map((task, index) => ({ id: task.id, position: index }));
      reorderTasks.mutate({ items, listId, previousTasks });
    }
    setActive(null);
    setIsDragging(false);
  };

  return (
    <div className='w-full lg:pl-[340px] lg:mt-36 mt-4'>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActive(null)}
      >
        <SortableContext items={tasks}>
          <Virtuoso
            data={tasks}
            className='lg:!h-custom !h-custom-mobile'
            totalCount={tasks.length}
            itemContent={(index, item) => (
              <div key={item.id} className={`${!index && 'lg:pt-12'} `}>
                <SortableItem task={item} />
              </div>
            )}
          />
        </SortableContext>
        <SortableOverlay>{activeItem ? <SortableItem task={activeItem} /> : null}</SortableOverlay>
      </DndContext>
    </div>
  );
};

export default SortableList;
