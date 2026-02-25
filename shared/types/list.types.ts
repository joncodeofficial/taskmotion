import { TaskProps } from './task.types';

export type ListProps = {
  listId?: string;
  name?: string;
  tasks?: TaskProps[];
  created_at?: string;
};
