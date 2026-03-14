import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ListProps } from '@shared/types/list.types';
import { useAlertDialogStore } from '@/shared/store/dialogStore';
import { useQueryClient } from '@tanstack/react-query';
import { TaskProps } from '@shared/types/task.types';
import { Trash2 } from 'lucide-react';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { replaceEmojis } from '@/shared/utils/replaceEmojis';
import { useDebounce } from '@uidotdev/usehooks';
import { UserAuth } from '@/app/context/AuthContext';
import { useUpdateNotifications } from '@/shared/hooks/useNotification';
import { createNotification } from '@/shared/utils/createNotification';
import { useDeleteList, useLists, useUpdateList } from '@/features/lists/hooks/useLists';

type ListItemProps = {
  list: ListProps;
};

const ListItem = ({ list }: ListItemProps) => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const inputRef = useRef(null!) as React.MutableRefObject<HTMLInputElement>;
  const [isFocused, setIsFocused] = useState(false);
  const { setOpen, setHandleDelete, setListTitle } = useAlertDialogStore();
  const [listName, setListName] = useState(list.name);
  const [previousName, setPreviousName] = useState(list.name);
  const listNameDebounced = useDebounce(listName, 200);
  const { email } = UserAuth().user;
  const updateNotifications = useUpdateNotifications();
  const { lists } = useLists();
  const updateList = useUpdateList();
  const deleteList = useDeleteList();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value.trimStart());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!inputRef?.current || list.listId !== listId) return;
    if (e.key === 'Enter') inputRef?.current.blur();
  };

  const handleBlur = () => {
    if (listId && listName && listName !== previousName) {
      const formattedName = replaceEmojis(listName);
      updateList.mutate({
        listId,
        body: { name: formattedName },
      });
      setListName(formattedName);
      setPreviousName(formattedName);
      setListTitle(formattedName);
    } else setListName(previousName);
    setIsFocused(false);
  };

  const handleDeleteList = (e: React.MouseEvent, _listId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setHandleDelete(() => {
      if (!lists) return;
      if (_listId === listId) navigate('/u/dashboard');
      deleteList.mutate({ listId: _listId });

      const body = createNotification({
        type: 'list',
        action: 'deleted',
        message: list.name ?? 'none',
        id: _listId,
      });

      updateNotifications.mutate({ email, body });
    });
    setOpen(true);
  };

  const handleClick = () => {
    if (isFocused || list.listId === listId) return;
    setListTitle(listName as string);
    navigate(`/b/` + list.listId);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFocused) return;
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(-1, -1);
    setIsFocused(true);
  };

  useEffect(() => {
    if (listNameDebounced === list.name) return;
    setListTitle(listNameDebounced as string);
  }, [list.name, listNameDebounced, setListTitle]);

  return (
    <li
      tabIndex={0}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={`relative w-full h-12 mx-auto mt-1 flex items-center justify-between text-neutral-500 dark:text-neutral-100
        bg-neutral-50 dark:bg-neutral-900 rounded-md hover:bg-black/10 dark:hover:bg-white/20 
        transition-colors duration-200 select-none group
        ${listId === list.listId && 'bg-neutral-300 dark:bg-white/15'}`}
    >
      <input
        ref={inputRef}
        type='text'
        className={`w-full pl-2 mx-2 h-8 truncate text-sm bg-neutral-100 dark:bg-neutral-800
          outline-none rounded
          ${isFocused ? 'opacity-100' : 'opacity-0'}
          `}
        value={listName}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        onBlur={handleBlur}
      />
      <div
        title={listName as string}
        className={`absolute top-0 z-0 w-full h-12 rounded-md flex items-center
            ${isFocused && 'pointer-events-none'}`}
      >
        <span
          className={`pl-4 w-[calc(100%-2.5rem)] truncate text-sm ${
            !isFocused ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {listName}
        </span>
      </div>
      <Tooltip title='Delete list'>
        <button
          onClick={(e) => handleDeleteList(e, list.listId as string)}
          className='z-0 mr-2 w-7 h-7 flex justify-center items-center 
        text-sm font-medium bg-white dark:bg-neutral-800 rounded-md select-none aspect-square'
        >
          <Trash2
            data-testid='delete-icon'
            className='text-red-400 w-4 group-hover:inline-block hidden'
          />
          <span
            data-testid='task-count'
            className='text-center inline-block group-hover:hidden align-middle text-xs text-neutral-500 dark:text-neutral-100'
          >
            <span className='w-full'>
            {list.listId === listId
              ? (queryClient.getQueryData<TaskProps[]>(['tasks', listId]) ?? list.tasks ?? []).length
              : (list.tasks ?? []).length}
          </span>
          </span>
        </button>
      </Tooltip>
    </li>
  );
};

export default ListItem;
