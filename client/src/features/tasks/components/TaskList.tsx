import { useEffect } from 'react';
import SortableList from '@/features/tasks/components/dnd/SortableList';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useNavigate, useParams } from 'react-router';
import { useAlertDialogStore } from '@/shared/store/dialogStore';
import { useLists } from '@/features/lists/hooks/useLists';

const EmptyList = () => {
  return (
    <div className=' mx-auto mt-60 lg:pl-[340px]'>
      <h2 className='w-max text-gray-500 text-lg text-center mx-auto'>This list is empty</h2>
    </div>
  );
};

export const TaskList = () => {
  const { listId } = useParams();
  const { tasks } = useTasks(listId);
  const { lists } = useLists();
  const { setListTitle } = useAlertDialogStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lists) return;
    const findList = lists.find((l) => l.listId === listId);
    if (!findList && lists.length !== 0) navigate('/u/dashboard');
    setListTitle(findList?.name ?? '');
  }, [listId, lists, navigate, setListTitle]);

  return tasks.length > 0 ? <SortableList /> : <EmptyList />;
};
