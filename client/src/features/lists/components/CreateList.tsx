import { UserAuth } from '@/app/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { replaceEmojis } from '@/shared/utils/replaceEmojis';
import { useNavigate } from 'react-router-dom';
import { useShortcut } from '@/shared/hooks/useShortcut';
import { SIZE_ID } from '@/shared/constants/base';
import { CreateInput } from '@/shared/components/CreateInput';
import { useUpdateNotifications } from '@/shared/hooks/useNotification';
import { createNotification } from '@/shared/utils/createNotification';
import { useCreateList, useLists } from '@/features/lists/hooks/useLists';

const CreateList = () => {
  const [listName, setListName] = useState('');
  const inputRef = useRef(null!) as React.RefObject<HTMLInputElement>;
  const { email } = UserAuth().user;
  const keydown = useShortcut(['ctrl+l']);
  const navigate = useNavigate();
  const updateNotifications = useUpdateNotifications();
  const { lists } = useLists();
  const createList = useCreateList();

  const handleCreateList = () => {
    if (listName && lists) {
      const newlist = {
        listId: nanoid(SIZE_ID),
        name: replaceEmojis(listName),
        tasks: [],
      };
      createList.mutate({ email, body: newlist });
      setListName('');
      navigate(`/b/${newlist.listId}`);
      inputRef.current?.blur();

      const body = createNotification({
        type: 'list',
        action: 'created',
        message: listName,
        id: newlist.listId,
      });

      updateNotifications.mutate({ email, body });
    }
  };

  const handleForm = () => {
    listName ? handleCreateList() : inputRef.current?.focus();
  };

  useEffect(() => {
    if (keydown === 'ctrl+l') inputRef.current?.focus();
  }, [keydown]);

  return (
    <CreateInput
      value={listName}
      onChange={setListName}
      onSubmit={handleForm}
      inputRef={inputRef}
      placeholder='Create new list...'
      shortcutKey='l'
      className='mt-1'
    />
  );
};

export default CreateList;
