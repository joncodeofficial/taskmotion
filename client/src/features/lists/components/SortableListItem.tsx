import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { ListProps } from '@shared/types/list.types';
import ListItem from '@/features/lists/components/ListItem';

type SortableListItemProps = {
  list: ListProps;
};

const SortableListItem = ({ list }: SortableListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: list.listId!,
  });

  return (
    <ListItem
      list={list}
      gripSpace
      setNodeRef={setNodeRef}
      style={{
        opacity: isDragging ? 0 : 1,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      attributes={attributes}
      listeners={listeners}
    />
  );
};

export default SortableListItem;
