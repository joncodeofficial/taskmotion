import { ListProps } from '@shared/types/list.types';
import { TaskProps } from '@shared/types/task.types';

export const getTaskCount = (list: ListProps, tasks: TaskProps[], listId?: string) =>
  list.listId === listId ? tasks.length : list.tasks.length;
