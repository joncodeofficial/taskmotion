import ListItem from './ListItem';
import CreateList from './CreateList';
import { AlertDialogMessage } from './AlertDialogMessage';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { BurgerButton } from './BurgerButton';
import { DashboardButton } from './DashboardButton';
import { useLists } from '@/features/lists/hooks/useLists';

export const ListCollection = () => {
  const { lists } = useLists();
  const isSmallDevice = useMediaQuery('only screen and (max-width : 1023px)');
  const [open, setOpen] = useState(!isSmallDevice);
  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    setOpen(!isSmallDevice);
  }, [isSmallDevice]);

  return (
    <>
      <BurgerButton onClick={() => setOpen(!open)} />
      <div
        onClick={() => setOpen(false)}
        className={`
          lg:backdrop-blur-none ${open ? 'backdrop-blur-sm visible' : 'invisible'}
          fixed top-0 pt-16 lg:pt-1 lg:top-15 z-[60] w-full lg:w-0 transition-all duration-300`}
      >
        <ul
          ref={animationParent}
          className={`w-3/4 md:w-[340px] h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-4.5rem)] overflow-y-auto 
            bg-background lg:ml-2 ml-0 rounded-md ${
              open ? 'left-0' : '-left-full md:-left-x-[348px]'
            }
            p-2 border border-neutral-200 dark:border-neutral-800 transition-all duration-700 ease-cubic shadow
            `}
          onClick={(e) => e.stopPropagation()}
        >
          <DashboardButton />
          {lists?.map((list) => (
            <ListItem list={list} key={list.listId} />
          ))}
          <CreateList />
        </ul>
      </div>
      <AlertDialogMessage />
    </>
  );
};
