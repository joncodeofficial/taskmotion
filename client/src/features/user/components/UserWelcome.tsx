import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useAlertDialogStore } from '@/shared/store/dialogStore';
import { getGreeting } from '@/features/user/utils/getGreeting';
import { ListOptionsMenu } from '@/features/user/components/ListOptionsMenu';
import { useUpdateList } from '@/features/lists/hooks/useLists';
import { replaceEmojis } from '@/shared/utils/replaceEmojis';
import { format } from 'date-fns';

const UserWelcome = () => {
  const formattedDate = format(new Date(), 'EEEE, MMMM d');
  const { listId } = useParams();
  const { listTitle, setListTitle } = useAlertDialogStore();
  const updateList = useUpdateList();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [listName, setListName] = useState(listTitle);
  const [previousName, setPreviousName] = useState(listTitle);
  const [renameRequestCount, setRenameRequestCount] = useState(0);

  useEffect(() => {
    setListName(listTitle);
    setPreviousName(listTitle);
  }, [listTitle]);

  useEffect(() => {
    if (!renameRequestCount) return;
    setIsFocused(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [renameRequestCount]);

  const startRename = () => {
    setRenameRequestCount((current) => current + 1);
  };

  const handleBlur = () => {
    if (!listId) {
      setIsFocused(false);
      return;
    }

    const formattedName = replaceEmojis(listName.trim());
    if (formattedName && formattedName !== previousName) {
      updateList.mutate(
        { listId, body: { name: formattedName } },
        {
          onSuccess: () => {
            setListName(formattedName);
            setPreviousName(formattedName);
            setListTitle(formattedName);
          },
          onError: () => {
            setListName(previousName);
          },
        }
      );
    } else {
      setListName(previousName);
    }

    setIsFocused(false);
  };

  return (
    <div className='hidden lg:block'>
      <h3 className='text-gray-600 dark:text-neutral-300 text-lg font-light'>
        {getGreeting()} Today is {formattedDate}
      </h3>
      <div className='mt-1 flex items-center gap-3 min-w-0'>
        <div className='relative min-w-0 flex-1'>
          <input
            ref={inputRef}
            type='text'
            value={listName}
            onChange={(e) => setListName(e.target.value.trimStart())}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className={`w-full rounded-md border border-transparent bg-transparent px-1 text-3xl font-semibold text-gray-900 outline-none transition dark:text-white ${
              isFocused
                ? 'opacity-100 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
                : 'pointer-events-none opacity-0'
            }`}
          />
          <div
            className={`absolute inset-0 w-full text-left text-3xl font-semibold text-gray-900 dark:text-white ${
              isFocused ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          >
            <span className='block truncate px-1'>
              {listTitle || (
                <span className='text-gray-400 dark:text-neutral-500 animate-pulse'>Loading...</span>
              )}
            </span>
          </div>
        </div>
        <ListOptionsMenu onRenameList={startRename} />
      </div>
    </div>
  );
};

export default UserWelcome;
